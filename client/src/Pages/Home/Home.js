import React, { useEffect, useState, useRef } from 'react'
import './Home.css'
import AddContact from '../../Components/AddContact/AddContact';
import Profile from '../../Components/Profile/Profile';
import ContactProfile from '../../Components/ContactProfile/ContactProfile';
import ContactMenu from '../../Components/ContactMenu/ContactMenu';
import Loading from '../../Components/HomePageLoading/HomeLoading';
import { profileUrlpath } from '../../Axios';
import {
  addUserInfo, GetUserInfo,
  addContactMessage, changeContactStatus,
  changeTypingStatus, selectContact,
  getSelectedContact

}
  from "../../Features/User"
import { FiAlignLeft, } from "react-icons/fi";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux'



WebSocket.prototype.emit = function (event, data) {
  this.send(JSON.stringify({ event, data }));
}

function Home() {

  const divRef = useRef(null);
  const dispatch = useDispatch()
  const [ws, setWs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myMessage, setMyMessage] = useState('')
  const [conSearch, setConSearch] = useState('')
  const { contacts, ...userInfo } = useSelector(GetUserInfo)

  const [typingStatus, setTypingStatus] = useState(false)
  const [ProfileTrigger, setProfileTrigger] = useState(false)
  const [AddContactTrigger, setAddContactTrigger] = useState(false)
  const [ContactMenuTrigger, setContactMenuTrigger] = useState(false)
  const [ContactProfileTrigger, setContactProfileTrigger] = useState(false)
  const selectedContact = useSelector(getSelectedContact)


  const playMessagePopAudio = () => {
    const onwMessage = new Audio('./audios/onmessage.mp3')
    onwMessage.volume = 0.1
    onwMessage.play()
  }
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:4002/a?${localStorage.getItem('auth_token')}`)
    ws.onopen = () => {
      setWs(ws)
      setLoading(false)
    }

    ws.onmessage = (e) => {
      const { event, data } = JSON.parse(e.data)
      switch (event) {
        case "userInfo":
          dispatch(addUserInfo(data))
          break;
        case "message":
          dispatch(addContactMessage({ ...data, position: 'start' }))
          divRef.current.scrollIntoView({ behavior: 'smooth' });
          playMessagePopAudio()
          break;
        case "onlineStatus":
          dispatch(changeContactStatus(data))
          break;
        case "typing":
          dispatch(changeTypingStatus(data))
          break;
        default:
          break;
      }
    }

    ws.onclose = () => {
      setWs(null)
      setLoading(true)
    }

    return () => ws.close()
  }, [dispatch])


  const filterContactList = () => {
    let contactList = []
    if (conSearch.length > 0) {
      contactList = contacts.filter(contact => contact.name?.toLowerCase().includes(conSearch.toLowerCase()))
    } else {
      for (let contact of contacts) {
        contact.online ? contactList.splice(0, 0, contact) : contactList.push(contact)
      }
    }
    return contactList
  }


  const sendTypingStatus = (status) => {

    ws.emit('typing', {
      from: userInfo.number,
      to: selectedContact.number,
      status
    })
    setTypingStatus(status)
  }

  const messageOnChange = e => {
    setMyMessage(e.target.value)
    if (e.target.value.length > 0 && !typingStatus) {
      return sendTypingStatus(true)
    } else if (e.target.value.length === 0 && typingStatus) {
      sendTypingStatus(false)
    }
  }

  const onFouceOutMessage = (e) => {
    sendTypingStatus(false)
  }

  const setMessageObj = (from, to) => {
    const info = {
      from,
      message: {
        message: myMessage,
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    }
    to ? info.to = to : info.message.from = 'me'
    return info
  }

  const SendMessgaeNow = e => {
    e.preventDefault()
    playMessagePopAudio()
    dispatch(addContactMessage(setMessageObj(selectedContact.number)))
    ws.emit('message', setMessageObj(userInfo.number, selectedContact.number))
    setMyMessage('')
    setTypingStatus(false)
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  }



  return (
    <div className="home">

      <Loading loading={loading} />
      <Profile trigger={ProfileTrigger} setTrigger={setProfileTrigger} />
      <AddContact trigger={AddContactTrigger} setTrigger={setAddContactTrigger} />
      <ContactProfile trigger={ContactProfileTrigger} setTrigger={setContactProfileTrigger} />

      <div className="home_left">
        <div className="home_left_header">
          <FiAlignLeft
            size={37}
            id="home_left_header_icon"
            onClick={() => setProfileTrigger(true)}
          />

        </div>
        <div className="home_search">
          <input
            className="home_search_bar"
            type="text"
            placeholder="Search..."
            value={conSearch}
            onChange={e => setConSearch(e.target.value)}
          />
          {
            conSearch.length > 0 ?
              <button className="home_search_button" onClick={() => setConSearch('')}>X</button>
              :
              <button className="home_search_button">
                <BiSearch size={14} />
              </button>
          }
        </div>

        <div className="home_contacts">
          {
            filterContactList().map((contact, index) => {

              return (
                <div className="contact " key={index} onClick={() => dispatch(selectContact(contact.number))} >
                  <div className='contact_info_img'>
                    <img className="contact_image" src={`${profileUrlpath}${contact.photo ?? "default.jpg"}`} alt="" />
                  </div>
                  <div className="contact_info_ndl">
                    <div className="contact_info_n-d">
                      <div className="contact_info_name">
                        <span className="contact_name">{contact.name ?? contact.number}</span>
                      </div>
                      <div className="contact_info_date">
                        <span className="contact_date">
                          {
                            contact.messages?.length > 0 ? contact.messages[contact.messages.length - 1].date : ""
                          }
                        </span>
                      </div>
                    </div>
                    <div className="contact_info_l">
                      <div className="contact_info_message">
                        {
                          contact.online && contact?.typing ?
                            <span className="contact_typing">
                              Typing...
                            </span> :
                            <span className="contact_message" >
                              {contact.messages?.length > 0 ? contact.messages[contact.messages.length - 1].message : "no messages"}
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
          <div className="add_contact_icon" onClick={() => setAddContactTrigger(true)} >

          </div>
        </div>
      </div>

      {
        selectedContact ?
          <div className="home_right">
            <div className='home_right_header'>
              <div className="home_r-h_back">
                <button
                  onClick={() => dispatch(selectContact(null))}
                  className="home_r-h_back_button">
                  <BsArrowLeftShort size={43} />
                </button>
              </div>
              <div className="home_r-h_contact_info">
                <div className="home_r-h_contact_photo">
                  <img
                    className="home_r-h_contact_image"
                    src={`${profileUrlpath}${selectedContact.photo ?? "default.jpg"}`}
                    alt=""
                    onClick={() => setContactProfileTrigger(true)}
                  />
                </div>
                <div className="home_r-h_contact_n-s">
                  <div className="home_r-h_contact_name">
                    <span>{selectedContact.name ?? selectedContact.number}</span>
                  </div>
                  <div className="home_r-h_contact_status">
                    {
                      selectedContact.typing ?
                        <span className="contact_typing">
                          Typing...
                        </span> :
                        selectedContact.online ?
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
            </div>
            <div className="home_chats" >
              <ContactMenu
                trigger={ContactMenuTrigger}
                setAddContactTrigger={setAddContactTrigger}
                setContactProfileTrigger={setContactProfileTrigger}
              />
              {
                selectedContact.messages?.map((data, index) => {
                  return (
                    <div key={index}>
                      {
                        data.from ?
                          <div className="home_c_message-me" >
                            <div className="home_c-message_box-me" >
                              <span className="message">{data.message}</span>
                            </div>
                            <div>
                              <span className="h_m_date">{data.date}</span>
                            </div>
                          </div> :
                          <div className="home_c_message-contact"  >
                            <div className="home_c-message_box-contact" >
                              <span className="message">{data.message}</span>
                            </div>
                            <div>
                              <span className="h_m_date">{data.date}</span>
                            </div>
                          </div>
                      }
                    </div>

                  )
                })
              }
              <div id="div_ref" ref={divRef} />
              <div className='home_c_message-me'  >
                <div className="home_c-message_box" >
                  <span className="h_message"></span>
                </div>
                <div>
                  <span className="h_m_date"></span>
                </div>
              </div>
            </div>
            <div className="home_right_footer">
              <form onSubmit={SendMessgaeNow} className="home_message_form">
                <div className="home_r-b_message">
                  <input
                    type='text'
                    value={myMessage}
                    onChange={messageOnChange}
                    onBlur={onFouceOutMessage}

                    placeholder="Type a message..."
                    className="home_message_input"
                    required
                  />
                </div>
                <div className="home_r-b_button">
                  <button
                    type="submit"
                    className="home_message_send_button"
                  ></button>
                </div>
              </form>
            </div>
          </div>
          :
          <div className="home_right_logo" >
            <img
              className="hoem_right_logo_img"
              src="https://harver.com/wp-content/uploads/2020/08/chat@2x.png"
              alt="logo"
            />
          </div>
      }
    </div >
  )
}

export default Home