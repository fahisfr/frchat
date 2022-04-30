import React,{useState} from 'react'
import './Profile.css'
const { useSelector } = require('react-redux')

function Profile({ trigger, setTrigger }) {
    const User = useSelector(state => state.user.userInfo)
    const [name, setName] = useState(User.name)
    
    return trigger? (
        <div className="profile_container">
            <div className="profile">
                <div className="user_profile_photo">
                    <img className="user_photo"  />
                </div>
                <div className="user_info">
                    <form>
                        <label className="profile_label" >Name</label>
                        <div className="user_info_np">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="user_info_input"
                            />
                        </div>
                        <label className="profile_label">Number</label>
                        <div className="user_info_np">
                            <input
                                className="user_info_input"
                                value={User.number}
                                onChange={(e) => null}
                            />
                        </div>
                        <div className="user_info_bottom">
                            <button className="profile_save_button">Save</button>
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

    ):null
}

export default Profile