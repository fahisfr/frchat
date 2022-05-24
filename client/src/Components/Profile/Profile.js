import React, { useState, useRef } from 'react'
import './Profile.css'
import { useSelector,useDispatch } from 'react-redux'
import {logout} from '../../Features/User'
import Axios, { profileUrlpath } from '../../Axios'


function Profile({ trigger, setTrigger }) {
    const dispatch = useDispatch()
    const User = useSelector(state => state.user.userInfo)
    const [preview, setPreview] = useState(null)
    const fileInputRef = useRef(null)
    const [err, setErr] = useState({ status: false, message: "" })
    const [name, setName] = useState()
    const [photo, setPhoto] = useState(User.photo)


    const imagePreview = (e) => {

        setPhoto(e.target.files[0])
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(e.target.files[0])
    }



    const UpdateProfile = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', name)
        formData.append('photo', photo)
        try {
            const response = await Axios.post('/user/update-profile', formData)
            response.data.success ? setTrigger(false) : setErr({ status: true, message: response.data.message })

        } catch (err) {
            setErr({ status: true, message: "oops something went wrong" })

        }



    }

    const logoutNow = async (e) => {
        console.log("logout now")
        e.preventDefault()
        try {
                Axios.post('/user/logout').then(res => {
                    dispatch(logout())
                    localStorage.removeItem('accessToken')
            })
        } catch (err) {
            setErr({ status: true, message: err.message })

        }
    }

    return trigger ? (
        <div className="profile_container"
            onClick={(e) => e.target === e.currentTarget ? setTrigger(false): null}
        >
            <div className="profile">
                <div className="user_profile_photo">
                    <img
                        className="user_photo"
                        src={preview ?? profileUrlpath + User.photo}
                        alt="profile_photo"
                        onClick={() => { fileInputRef.current.click() }}
                    />
                    <input
                        className="user_photo_input"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={imagePreview}
                    />
                </div>
                <div className="user_info">
                    <div className="profile_err">
                        {
                            err.status && <span className="profile_err_message" >{err.message}</span>
                        }
                    </div>
                    <form id="profile_from" >
                        <label className="profile_label" >Name</label>
                        <div className="user_info_np">
                            <input
                                value={name ?? User.name}
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
                                onClick={(e)=>UpdateProfile(e)}
                            >Save</button>

                            <button
                                className='profile_logout_button'
                                onClick={(e)=>logoutNow(e)}
                            >Logout</button>
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