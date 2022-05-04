import React, { useEffect, useState, useRef } from 'react'
import './Home.css'
import AddContact from '../../Components/AddContact/AddContact';
import ContactMenu from '../../Components/ContactMenu/ContactMenu';
import Profile from '../../Components/Profile/Profile';
import { contact, ChangeUserStatus, ContactsMessages, GetUserInfo, typing } from "../../Features/User"
import { FiAlignLeft, } from "react-icons/fi";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux'


function Home() {

  const divRef = useRef(null);
  const dispatch = useDispatch()
  const [server, setSever] = useState(null)
  const { contacts, ...info } = useSelector(GetUserInfo)
  const [SlectedContactIndex, setSlectedContactIndex] = useState(null)
  const [myMessage, setMyMessage] = useState('')

  const [typingStatus, setTypingStatus] = useState(false)
  const [ProfileTrigger, setProfileTrigger] = useState(false)
  const [AddContactTrigger, setAddContactTrigger] = useState(false);
  const [ContactMenuTrigger, setContactMenuTrigger] = useState(false)

  const SlectedContact = contacts[SlectedContactIndex]

  useEffect(() => {
    WebSocket.prototype.emit = function (event, data) {
      this.send(JSON.stringify({ event, data }));
    }
    let server = new WebSocket(`ws://localhost:4000/auth=${localStorage.getItem('accesstoken')}`)
    setSever(server)
    server.onmessage = (e) => {
      const { event, data } = JSON.parse(e.data)

      switch (event) {
        case "contactsinfo":
          dispatch(contact(data.contacts))
          break;
        case "message":
          dispatch(ContactsMessages({ ...data, position: 'start' }))
          divRef.current.scrollIntoView({ behavior: 'smooth' });
          break;
        case "user_online_status":
          dispatch(ChangeUserStatus(data))
          break;
        case "typing":
          dispatch(typing(data))
      }
    }
    return () => {
      server.close()
    }

  }, [dispatch])

  const SendMessgae = e => {
    e.preventDefault()
    dispatch(ContactsMessages({
      from: SlectedContact.number, message: {
        message: myMessage,
        date: new Date().toLocaleTimeString(),
        position: 'end'
      }
    }))
    server.emit('message', {
      from: info.number,
      to: SlectedContact.number,
      message: {
        message: myMessage,
        date: new Date().toLocaleTimeString(),
        position: 'start'
      }
    })
    setMyMessage('')
    setTypingStatus(false)


  }
  const sendTypingStatus = (status) => {
    server.emit('typing', {
      from: info.number,
      to: SlectedContact.number,
      status
    })
    setTypingStatus(status)
  }

  const ChangeMessge = e => {
    setMyMessage(e.target.value)
    if (e.target.value.length > 0 && !typingStatus) {
      return sendTypingStatus(true)
    }else if (e.target.value.length === 0 && typingStatus) {
      sendTypingStatus(false)
    }
  }


  const messageOnFocusOut = () => {
    if (typingStatus) {
      server.emit('typing', {
        from: info.number,
        to: SlectedContact.number,
        status: false
      })
      setTypingStatus(false)
    }
  }

  return (
    <div className="home">
      <Profile trigger={ProfileTrigger} setTrigger={setProfileTrigger} />
      <AddContact trigger={AddContactTrigger} setTrigger={setAddContactTrigger} />
      <div className="home_left">
        <header className="home_left_header">
          <FiAlignLeft
            size={37}
            onClick={() => setProfileTrigger(true)}
          />
          <div className="home_r-h_m">
            <div className="home_m_div" >
              <div className="home_menu"></div>
              <div className="home_menu"></div>
              <div className="home_menu"></div>
            </div>
          </div>
        </header>
        <div className="home_search">
          <input className="home_search_bar" type="text" placeholder="search.." />
          <button className="home_search_button"><BiSearch size={12} /></button>
        </div>
        <div className="home_contacts">
          {
            contacts.map((contact, index) => {

              return (
                <div className="contact " key={index} onClick={() => setSlectedContactIndex(index)} >
                  <div className='contact_info_img'>
                    <img className="contact_image" src={contact.photo} alt="loding" />
                  </div>
                  <div className="contact_info_ndl">
                    <div className="contact_info_n-d">
                      <div className="contact_info_name">
                        <span className="contact_name">{contact.name}</span>
                      </div>
                      <div className="contact_info_date">
                        <span className="contact_date">{contact.messages?.length > 0 ? contact.messages[contact.messages.length - 1].date : ""}</span>
                      </div>
                    </div>
                    <div className="contact_info_l">
                      <div className="contact_info_message">
                        {
                          contact?.typing ?
                            <span className="contact_typing">
                              Typing...
                            </span> :
                            <span className="contact_message" >
                              {contact?.messages?.length > 0 ? contact.messages[contact.messages.length - 1].message : "no message"}
                            </span>
                        }




                      </div>
                      <div className="contact_online_status">
                        {
                          contact.online ?
                            <span className="contact_online_status_true">Online</span> :
                            <span className="contact_online_status_false">Offline</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div className="add_contact_icon" onClick={() => setAddContactTrigger(!AddContactTrigger)} >
          </div>
        </div>
      </div>

      {
        SlectedContact ?
          <div className="home_right">
            <header className='home_right_header'>
              <div className="home_r-h_back">
                <button className="home_r-h_back_button">
                  <BsArrowLeftShort size={45} />
                </button>
              </div>
              <div className="home_r-h_contact_info">
                <div className="home_r-h_contact_photo">
                  <img className="home_r-h_contact_image" src={SlectedContact.photo} alt="" />
                </div>
                <div className="home_r-h_contact_n-s">
                  <div className="home_r-h_contact_name">
                    <span className="">{SlectedContact.name}</span>
                  </div>
                  <div className="home_r-h_contact_status">
                    {
                      SlectedContact?.typing ?
                        <span className="contact_typing">
                          Typing...
                        </span> :
                        SlectedContact.online ?
                          <span className="contact_online_status_true">Online</span> :
                          <span className="contact_online_status_false">Offline</span>
                    }
                  </div>
                </div>
              </div>
              <div className="home_r-h_m">
                <div className="home_m_div" onClick={() => setContactMenuTrigger(!ContactMenuTrigger)} >
                  <div className="home_menu"></div>
                  <div className="home_menu"></div>
                  <div className="home_menu"></div>
                </div>
              </div>
            </header>
            <div className="home_chats" >
              <ContactMenu trigger={ContactMenuTrigger} SlectedContact={SlectedContact} />
              {
                contacts.find(contact => contact.number === SlectedContact.number).messages.map((message, index) => {
                  return (
                    <div className={`home_c_message-${message.position}`} key={index}  >
                      <div className="home_c-message_box" >
                        <span className="h_message">{message.message}</span>
                      </div>
                      <div>
                        <span className="h_m_date">{message.date}</span>
                      </div>
                    </div>
                  )
                })
              }
              <div ref={divRef} />
            </div>
            <footer className="home_right_footer">
              <form onSubmit={SendMessgae} className="home_message_form">
                <div className="home_r-b_message">
                  <input
                    type='text'
                    value={myMessage}
                    onChange={ChangeMessge}
                    onBlur={messageOnFocusOut}

                    placeholder="Type a message"
                    className="home_message_input"
                    required
                  />
                </div>
                <div className="home_r-b_button">
                  <button
                    type="submit"
                    className="home_message_send_button"

                  >Send</button>
                </div>
              </form>
            </footer>
          </div>
          : null
      }



    </div >
  )
}

export default Home