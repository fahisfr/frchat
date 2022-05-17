import './Singup.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from "../../Axios"


import OtpVerify from '../../Components/OTPVerify/OTPVerify'

function Singup() {
    const [name, setName] = useState('')
    const [number, setNumber] = useState("")
    const [Otp, setOtp] = useState({
        status: false,
        number: "",
        name: "",
        path: "",
    })

    const SingupNow = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post("/singup", { name, number })
            if (response.data.success) {
                setOtp({ status: true, number, name, url: "singup" })
                return;
            }
            alert(response.data.message)
        } catch (error) {
            alert(error.message)
        }
    }
    return (
        <div className="singup">
            <div className='singup_header'>
                <h1>Create new account</h1>
            </div>
            {
                Otp.status ? <OtpVerify Info={Otp} /> : <div className='singup_body'>
                    <form onSubmit={SingupNow} className="singup_from">
                        <div className="loign_from_np">
                            <label className="login_lable" >Nmae</label>
                            <div className='Loign_from_input_container'>
                                <input
                                    className='login_input'
                                    type='text'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="singup_from_np">
                            <label className="singup_lable" >Phone Number</label>
                            <div className='singup_from_input_container'>
                                <input
                                    className='login_input'
                                    type='number'
                                    required
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="singup_from_np">
                            <Link className="singup_from_link" to='/login'>Already have an account ?</Link>
                        </div>
                        <button
                            type='submit'
                            className="singup_button"
                        >Login</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default Singup