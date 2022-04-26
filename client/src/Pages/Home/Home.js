import React, { useEffect, useState, useRef } from 'react'

import './Home.css'
import { faker } from '@faker-js/faker'

import AddContact from '../../Components/AddContact/AddContact';

import { FiAlignLeft, } from "react-icons/fi";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";



const server = new WebSocket(`ws://localhost:4000/auth=${localStorage.getItem('token')}`)

function Home() {
  
  const divRref = useRef(null);
  const [addContact, setAddContact] = useState(false);
  const [messages, setMessages] = useState([])
  const [mymesage, setMyMessage] = useState('')

  server.onmessage = e => {
    setMessages([
      ...messages, JSON.parse(e.data)
    ])
  }

  const SendMessgae = e => {
    console.log(mymesage)
    e.preventDefault();
    setMessages([
      ...messages, {
        type: 'message',
        message: mymesage,
        position: "end"
      }
    ])

    server.send(
      JSON.stringify({
        type: 'message',
        message: mymesage,

      }

      )
    )


  }

  const clientsInfo = number => {
    let clients = []
    for (let i = 0; i < number; i++) {
      const image = faker.image.avatar()
      const name = faker.name.findName()
      const date = faker.date.recent()
      const message = faker.lorem.sentence(12)

      clients.push({ name, image, date, message })

    }
    return clients
  }



  const user = (number) => {
    let user = []
    for (let i = 0; i < number; i++) {

      const message = faker.lorem.sentence(12)
      const where = ["end", "start"]
      const position = where[Math.floor(Math.random() * where.length)]

      user.push({ message, position })
    }
    return user
  }





  return (
    <div className="home">
      <AddContact trigger={addContact} settrigger={setAddContact}  />
      <div className="home_left">
        <header className="home_left_header">
          <FiAlignLeft size={37} />
          {/* <img className="home_r-h_contact_image" src={faker.image.avatar()} /> */}
        </header>
        <div className="home_search">
          <input className="home_search_bar" type="text" placeholder="search.." />
          <button className="home_search_button"><BiSearch size={12} /></button>
        </div>

        <div className="home_contacts">


          <div className="contact " >
            <div className='contact_info_img'>
              <img className="contact_image" alt="" />
            </div>
            <div className="contact_info_ndl">
              <div className="contact_info_n-d">
                <div className="contact_info_name">
                  <span className="contact_name"></span>
                </div>
                <div className="contact_info_date">
                  <span className="contact_date">12/13/2999</span>
                </div>
              </div>
              <div className="contact_info_l">
                <div className="contact_info_message">
                  <span className="contact_message"> </span>
                </div>
                <div className="contact_online_n-o">
                  {/* <span className="">Onliee</span> */}
                </div>
              </div>
            </div>
          </div>
          
          <div className="add_contact_icon" onClick={()=>setAddContact(!addContact)} >
          </div>

        </div>
      </div>
      <div className="home_right">
        <header className='home_right_header'>
          <div className="home_r-h_back">
            <button className="home_r-h_back_button">
              <BsArrowLeftShort size={45}  />
            </button>
          </div>
          <div className="home_r-h_contact_info">
            <div className="home_r-h_contact_photo">
              <img className="home_r-h_contact_image" alt="" />
            </div>
            <div className="home_r-h_contact_n-s">
              <div className="home_r-h_contact_name">
                <span className=""></span>
              </div>
              <div className="home_r-h_contact_status">
                <span className="home_r-h_status">Online</span>
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



          <div  className={`home_c_message-${user.position}`}   >
            <div className="home_c-message_box" >
              <span className="h_message">{user.message}</span>
            </div>
            <div>
              <span className="h_m_date">12/13/2999 10:34AM</span>
            </div>
          </div>



        </div>
        <footer className="home_right_footer">
          <form onSubmit={SendMessgae} className="home_message_form">
            <div className="home_r-b_message">
              <input type='text' value={mymesage} onChange={(e) => setMyMessage(e.target.value)} className="home_message_input" />
            </div>
            <div className="home_r-b_button">
              <button type="submit" className="home_message_send_button" >Send</button>
            </div>
          </form>
        </footer>

      </div>
    </div>
  )
}

export default Home