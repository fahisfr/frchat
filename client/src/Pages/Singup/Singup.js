import './Singup.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from "../../Axios"


import OtpVerify from '../../Components/OTPVerify/OTPVerify'

function Singup() {
    const [error, setError] = useState({ trigger: false, message: "" })
    const [name, setName] = useState('')
    const [number, setNumber] = useState("")
    const [loading,setLoadign] = useState(false)
    const [Otp, setOtp] = useState({
        trigger: false,
        number: null,
        name: "",
        path: "",
    })

    const SingupNow = async (e) => {
        e.preventDefault()
        setLoadign(true)
        try {

            const response = await Axios.post("/singup", { name, number: parseInt(number) })
            setLoadign(false)
            response.data.success ? setOtp({ trigger: true, number, name, url: "singup" })
                : setError({ trigger: true, message: response.data.message })

        } catch (error) {
            setError({ trigger: true, message: error.message })
            
        }finally{
            setLoadign(false)
        }
    }
    return (
        <div className="singup" style={{ backgroundImage: "url(./images/ls_bg.jpg)" }}>
            <div className='singup_header'>
                <h1>Create new account</h1>
            </div>
            {
                Otp.trigger ? <OtpVerify Info={Otp} /> : <div className='singup_body'>
                    <form onSubmit={SingupNow} className="singup_from">
                        <div className="singup_from_np">
                            <label className="singup_lable" >Name</label>
                            <div className='singup_from_input_container'>
                                <input
                                    className='singup_input'
                                    type='text'
                                    required
                                    value={name}
                                    placeholder=""
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="singup_from_np">
                            <label className="singup_lable" >Phone Number</label>
                            <div className='singup_from_input_container'>
                                <input
                                    className='singup_input'
                                    type='number'
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='ls_body_err'>
                                {error.trigger ? <span className='ls_err_message'>{error.message}</span> : null}
                            </div>
                        </div>
                        <div className="singup_from_np">
                            <Link className="singup_from_link" to='/login'>Already have an account ?</Link>
                        </div>
                        <button type="submit" className={`singup_button ${loading && "button_loading"}`}>
                            <span className="button_text">Singup</span>
                        </button>
                    </form>
                </div>
            }
        </div>
    )
}

export default Singup