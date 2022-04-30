import React, { useEffect, useState, useRef } from 'react'
import './Home.css'
import { faker } from '@faker-js/faker'
import AddContact from '../../Components/AddContact/AddContact';
import { contact, ChangeUserStatus, ContactsMessages,GetUserInfo } from "../../Features/User"
import { FiAlignLeft, } from "react-icons/fi";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux'


function Home() {
  const dispatch = useDispatch()
  const [server, setSever] = useState(null)
  const { contacts, ...info } = useSelector(GetUserInfo)
  const [SlectedContact, setSlectedContact] = useState(null)
  const divRref = useRef(null);
  const [addContact, setAddContact] = useState(false);
  const [mymessage, setMyMessage] = useState('')
  const [Typing, setTyping] = useState(false)
  useEffect(() => {
    let server = new WebSocket(`ws://localhost:4000/auth=${localStorage.getItem('accesstoken')}`)
    setSever(server)
    server.onmessage = (e) => {
      const response = JSON.parse(e.data)
      switch (response.event) {
        case "contactsinfo":
          dispatch(contact(response.contacts))
          break;
        case "message":
          dispatch(ContactsMessages(response))
          break;
        case "user_online_status":
          dispatch(ChangeUserStatus(response))
          break;
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
        message: mymessage,
        date: new Date().toLocaleTimeString(),
        position: 'end'
      }
    }))
    server.send(JSON.stringify({
      type: "sendmessage",
      from: info.number,
      to: SlectedContact.number,
      message: {
        message: mymessage,
        date: new Date().toLocaleTimeString(),
        position: 'start'
      }
    }))
    setMyMessage('')
  
  }

 
  
  return (
    <div className="home">
      <AddContact trigger={addContact} settrigger={setAddContact} />
      <div className="home_left">
        <header className="home_left_header">
          <FiAlignLeft size={37} />
        </header>
        <div className="home_search">
          <input className="home_search_bar" type="text" placeholder="search.." />
          <button className="home_search_button"><BiSearch size={12} /></button>
        </div>
        <div className="home_contacts">
          {
            contacts.map((contact, index) => {
              return (
                <div className="contact " key={index} onClick={() => setSlectedContact(contact)} >
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
                        <span className="contact_message">{
                          contact.messages?.length > 0 ? contact.messages[contact.messages.length - 1].message : 'no message'
                        }</span>
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
          <div className="add_contact_icon" onClick={() => setAddContact(!addContact)} >
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
                      SlectedContact.online ?
                        <span className="contact_online_status_true">Online</span> :
                        <span className="contact_online_status_false">Offline</span>
                    }
                  </div>
                </div>
              </div>
              <div className="home_r-h_m">
                <div className="home_r-h_m_div">
                  <div className="home_r-h_menu"></div>
                  <div className="home_r-h_menu"></div>
                  <div className="home_r-h_menu"></div>
                </div>
              </div>
            </header>
            <div className="home_chats">
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
            </div>
            <footer className="home_right_footer">
              <form onSubmit={SendMessgae} className="home_message_form">
                <div className="home_r-b_message">
                  <input
                    type='text'
                    value={mymessage}
                    onChange={(e)=>setMyMessage(e.target.value)}
                    className="home_message_input"
                    required
                  />
                </div>
                <div className="home_r-b_button">
                  <button
                    type="submit"
                    className="home_message_send_button"
                    disabled={!mymessage}
                  >Send</button>
                </div>
              </form>
            </footer>
          </div>
          : null
      }



    </div>
  )
}

export default Home