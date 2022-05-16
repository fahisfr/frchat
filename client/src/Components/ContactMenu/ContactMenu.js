import React from 'react'
import './ContactMenu.css'
import { getSelectedContact ,removeContact } from "../../Features/User"
import { useSelector, useDispatch } from 'react-redux'
import Axios from "../../Axios"

function ContactMenu({ trigger, setAddContactTrigger, setContactProfileTrigger }) {
    const dispatch = useDispatch()
    const contact = useSelector(getSelectedContact)
    const removeContactNow = async () => {
        const { notSaved, number } = contact
        if (notSaved) {
            dispatch(removeContact(contact))
            return;
        }
        const respose = await Axios.put('/contact/remove-contact', { number})
        respose && dispatch(removeContact(number))

    }
    return trigger ? (
        <div className="contact_menu">
            {
                contact.notSaved ?
                    <div
                        className="contact_menu_options"
                        onClick={() =>setAddContactTrigger({ status: true, number: contact.number })}
                    >
                        <span className="contact_menu_option" >Add Contact</span>
                    </div> :
                    <div
                        className="contact_menu_options"
                        onClick={() =>setContactProfileTrigger(true)}
                    >
                        <span className="contact_menu_option">Contact info</span>
                    </div>
            }
            <div
                className="contact_menu_options"
                onClick={() => removeContactNow()}
            >
                <span className="contact_menu_option-r">Remove Contact</span>
            </div>
        </div>
    ) : null
}

export default ContactMenu