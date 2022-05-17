import React, { useState, useRef } from 'react'
import './Profile.css'
import { useSelector } from 'react-redux'
import Axios ,{profileUrlpath} from '../../Axios'


function Profile({ trigger, setTrigger }) {

    const User = useSelector(state => state.user.userInfo)
    const fileInputRef = useRef(null)
    const [err, setErr] = useState({ status: false, message: "" })
    const [name, setName] = useState(User.name)
    const [photo, setPhoto] = useState(User.photo)


    const UpdateProfile = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', name)
        formData.append('photo', photo)
        try {
            const response = await Axios.post('/user/update-profile', formData)
            console.log(response)
            if (response.data.success) {
                setTrigger(false)
            } else {
                console.log("working")
                setErr({ status: true, message: response.data.message })
            }

        } catch (err) {
            console.log(err)
        }
    }


    return trigger ? (
        <div className="profile_container">

            <div className="profile">

                <div className="user_profile_photo">
                    <img
                        className="user_photo"
                        src={profileUrlpath + User.photo}
                        alt="profile_pho"
                        onClick={() => { fileInputRef.current.click() }}
                    />
                    <input
                        className="user_photo_input"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </div>
                <div className="user_info">
                    <div className="profile_err">
                        {
                            err.status&& <span className="profile_err_message" >{err.message}</span>
                        }
                    </div>
                    <form id="profile_from" >
                        <label className="profile_label" >Name</label>
                        <div className="user_info_np">
                            <input
                                value={name}
                                className="user_info_input"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <label className="profile_label">Number</label>
                        <div className="user_info_np">
                            <input
                                className="user_info_input"
                                value={User.number}
                                disabled
                            />
                        </div>
                        <div className="user_info_bottom">
                            <button
                                className="profile_save_button"
                                onClick={(e) => UpdateProfile(e)}
                            >Save</button>
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