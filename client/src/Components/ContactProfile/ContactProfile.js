
import React from "react"

import {profileUrlpath} from '../../Axios'

function Profile({ trigger, setTrigger, contact }) {
  
 
    
    return trigger ? (
        <div className="profile_container">
            <div className="contactprofile">
                <div className="user_profile_photo">
                    <img
                        className="user_photo"
                        src={profileUrlpath + contact.photo}
                        alt="profile_photo"
                    />
                </div>
                <div className="user_info">
                    <div className="profile_err">
                        {
                            // contact.err.status && <span className="profile_err_message" >{contact.err.message}</span>
                        }
                    </div>
                    <form className="profile_from" >
                        <label className="profile_label" >Name</label>
                        <div className="user_info_np">
                            <input
                                className="user_info_input"
                                value={contact.name}
                                disabled
                            />
                        </div>
                        <label className="profile_label">Number</label>
                        <div className="user_info_np">
                            <input
                                className="user_info_input"
                                value={contact.number}
                                disabled
                            />
                        </div>
                    </form>
                </div>
                <div className="profile_exit">
                    <button
                        className="profile_exit_button"
                        onClick={() => setTrigger(false)}
                    >X</button>
                </div>
            </div>
        </div>
    ) : null
}

export default Profile