import React, {  useEffect, useState } from 'react'
import './AddContact.css'
import Axios from "../../Axios"
import { useDispatch  } from "react-redux"
import { addContact } from "../../Features/User"

function AddContact({ trigger, setTrigger }) {

    const dispatch = useDispatch()
    const [number, setNumber] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [Err, setErr] = useState({
        status: false,
        message: ""
    })

    const AddContactNow = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {

            const { data: { success, message, contact } } = await Axios.post("/contact/add-contact", { number: parseInt(number), name })
            if (success) {
                dispatch(addContact(contact))
                setTrigger(false)
                setName("")
                setNumber("")
                return
            }

            setErr({ status: true, message })

        } catch (error) {
            console.log(error)
          setErr({ status: true, message:"oops something went wrong" })
        }finally{
            setLoading(false)
        }
    }
    return trigger? (
        <div className="add_contact_container"
            onClick={(e) => e.target === e.currentTarget ? setTrigger(false) : null}
        >
            <div className="add_contact">
                <div className="add_contact_header">
                    <div className="add_contact_title">
                        <h1>Add Contact</h1>
                    </div>
                    <div className="add_contact_message">

                        {
                            Err.status ? <span style={{ color: "red" }}>{Err.message}</span> :
                                <span>Enter contact name and number</span>
                        }

                    </div>
                </div>

                <div className="add_contact_body">
                    <form className="add_contact_form">
                        <div className="add_contact_from_child">
                            <label className="add_contact_label">Name</label>
                            <div className="add_contact_input_container">
                                <input
                                    className="add_contact_input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="add_contact_from_chiled">
                            <label className="add_contact_label">Number</label>
                            <div className="add_contact_input_container">
                                <input
                                    className="add_contact_input"
                                    type="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div
                            className='add_contact_body_bottom'
                        >
                            <button
                                type="submit"
                                onClick={(e) => AddContactNow(e)}
                                className={`add_contact_button ${loading && "button_loading"}`}>
                                <span className='button_text'>Add Contact</span>
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    ) : null
}

export default AddContact