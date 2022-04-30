import React from 'react'
import "./ContactMenu.css"
function ContactMenu({ trigger, SelectContact }) {
    
    return trigger ? (
        <div className="contact_menu">
            <div className="contact_menu_options">
                <spa className="contact_menu_option">Clear Chat</spa>
            </div>
            <div  className="contact_menu_options ">
                <span className="contact_menu_option-r">Remove Contact</span>
            </div>
        </div>
    ):null
}

export default ContactMenu