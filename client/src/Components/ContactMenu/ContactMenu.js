import React, { useState } from 'react'
import './ContactMenu.css'
import { getSelectedContact, removeContact } from "../../Features/User"
import { useSelector, useDispatch } from 'react-redux'
import Axios from "../../Axios"

function ContactMenu({ trigger, setAddContactTrigger, setContactProfileTrigger }) {

    const dispatch = useDispatch()
    const contact = useSelector(getSelectedContact)
    const [loading, setLoading] = useState(false)
    const removeContactNow = async (e) => {

        try {
            setLoading(true)
            const { notSaved, number } = contact

            const respose = await Axios.put('/contact/remove-contact', { number, saved: notSaved ? false : true })
            respose && dispatch(removeContact(number))

        } catch (err) {
            alert("oops something went wrong")
        } finally {
            setLoading(false)
        }


    }
    return trigger ? (
        <div className="contact_menu">
            {
                contact.notSaved || !contact.name ?
                    <div
                        className="contact_menu_options"
                        onClick={() => setAddContactTrigger({ status: true, number: contact.number })}
                    >
                        <span className="contact_menu_option" >Add Contact</span>
                    </div> :
                    <div
                        className="contact_menu_options"
                        onClick={() => setContactProfileTrigger(true)}
                    >
                        <span className="contact_menu_option">Contact info</span>
                    </div>
            }
            <div
                className= {`contact_menu_options ${loading && "menu_options_loading"}`}
                onClick={removeContactNow}
            >
                <span className="contact_menu_option-r">Remove Contact</span>
            </div>
        </div>
    ) : null
}

export default ContactMenu