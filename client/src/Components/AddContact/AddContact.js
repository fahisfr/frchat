import React from 'react'
import './AddContact.css'

function AddContact({trigger, settrigger}) {
    return trigger ? (
        <div className="add_contact_container" onDoubleClick={()=>settrigger(false)}>
            <div className="add_contact">
                <div className="add_contact_header">
                    <div className="add_contact_title">
                        <span> </span>
                        <h1>Add Contact</h1>
                    </div>
                    <div className="add_contact_message">
 
                        <span>96633062570 this number not register in whychat</span>
                    </div>
                </div>

                <div className="add_contact_body">
                    <from className="add_contact_form">
                        <div className="add_contact_from_child">
                            <label className="add_contact_label">Name</label>
                            <div className="add_contact_input">
                                <input type="text" />
                            </div>
                        </div>
                        <div className="add_contact_from_chiled">
                            <label className="add_contact_label">Phone Number</label>
                            <div className="add_contact_input">
                                <input type="number" />
                            </div>
                        </div>
                        <button className="add_contact_button">
                            <span>Add Contact</span>
                        </button>
                    </from>
                </div>
            </div>
        </div>
    ):null
}

export default AddContact