
import React,{useState,useEffect} from "react"
import axios from "../../Axios"
import { profileUrlpath } from '../../Axios'
import { useSelector,useDispatch } from 'react-redux'
import { getSelectedContact,changeContactName } from '../../Features/User'


function Profile({ trigger, setTrigger }) {

    const dispatch = useDispatch()
    const conInfo = useSelector(getSelectedContact)
    const [name, setName] = useState(conInfo?.name)
    const [loading, setLoadin] = useState(false)
    const [err, setErr] = useState({ status: false, message: "" })

   
    const updateContact = async (e) => {
        e.preventDefault()
        try {

            setLoadin(true)
            const response = await axios.put('/contact/update-contact', {
                number: conInfo.number,
                name
            })
            setErr({ status: true, message: response.data.message })
            response.data.success && dispatch(changeContactName({ number: conInfo.number, name }))
                
        } catch (err) {
            console.log(err.message)
            setErr({ status: true, message: "oops something went wrong" })

        } finally {
            setLoadin(false)
        }
    }


    return trigger ? (
        <div className="profile_container"
            onClick={(e) => e.target === e.currentTarget ? setTrigger(false) : null}
        >
            <div className="profile">

                <div className="user_profile_photo">
                    <img className="user_photo"src={profileUrlpath + conInfo.photo} alt=""/>
                </div>

                <div className="user_info">

                    <div className="profile_err">
                        {err.status && <span className="profile_err_message" >{err.message}</span>}
                    </div>

                    <form id="profile_from" onSubmit={updateContact} >

                        <label className="profile_label" >Name</label>
                        <div className="user_info_np">
                            <input
                                value={name??conInfo.name}
                                className="user_info_input"
                                onChange={(e)=>setName(e.target.value)}/>
                        </div>

                        <label className="profile_label">Number</label>
                        <div className="user_info_np">
                            <input className="user_info_input"value={conInfo.number} disabled/>
                        </div>

                        <div className="user_info_bottom">
                            <button
                                type="submit"
                                className={`profile_save_button ${loading && "button_loading"}`}>
                                <span className='small_button_text'>Save</span>
                            </button>
                        </div>

                    </form>
                </div>

                <div className="profile_exit">
                    <button className="profile_exit_button" onClick={() => setTrigger(false)}>X</button>
                </div>

            </div>

        </div>

    ) : null
}

export default Profile