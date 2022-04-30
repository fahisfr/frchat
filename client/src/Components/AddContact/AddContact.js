import React, { useState } from 'react'
import './AddContact.css'
import Axios from "../../Axios"
function AddContact({ trigger, settrigger }) {
    const [number, setNumber] = useState("")
    const [name, setName] = useState("")
    const [Err, setErr] = useState({
        status: false,
        message: ""
    })


    const AddContactNow = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post("/contact", { number, name })
            if (response.data.success) {
                settrigger(false)
                return
            }
            setErr({ status: true, message: response.data.message })
        } catch (error) {

        }
    }
    return trigger ? (
        <div className="add_contact_container">
            <div className="add_contact">
                <div className="add_contact_header">
                    <div className="add_contact_title">
                        <span> </span>
                        <h1>Add Contact</h1>
                    </div>
                    <div className="add_contact_message">

                        {
                            Err.status ? <span style={{ color: "red" }}>{Err.message}</span> :
                                <span>Add a contact to start chatting</span>
                        }

                    </div>
                </div>

                <div className="add_contact_body">
                    <from onSubmit={AddContactNow} className="add_contact_form">
                        <div className="add_contact_from_child">
                            <label className="add_contact_label">Name</label>
                            <div className="add_contact_input">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="add_contact_from_chiled">
                            <label className="add_contact_label">Phone Number</label>
                            <div className="add_contact_input">
                                <input
                                    type="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            onClick={(e) => AddContactNow(e)}
                            className="add_contact_button"
                        >Add Contact</button>
                    </from>
                </div>
            </div>
        </div>
    ) : null
}

export default AddContact