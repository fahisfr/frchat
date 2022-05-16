
import React, { useState } from 'react'
import './OTPVerify.css'
import Axios from "../../Axios"

import { useDispatch } from "react-redux"
import { login } from "../../Features/User"

function OTPVerify({ Info }) {
    const dispatch = useDispatch()
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [err, setError] = useState(false)
    const handleChange = (element, index) => {
        setOtp([...otp.map((value, arryindex) => {
            if (arryindex === index) {
                element.nextSibling && element.nextSibling.focus();
                return element.value;
            } else if (element.value === "") {
                element.previousSibling && element.previousSibling.focus();
                return value;
            }
            return value;
        }
        )])
    }
    const VefifyOTP = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post(`/${Info.url}/otp-verify`, {
                otp: otp.join(""),
                number: parseInt(Info.number),
                name: Info?.names
            })
            if (response.data.success) {
                dispatch(login({ name: Info.name, number: Info.number }))
                localStorage.setItem("accessToken", response.data.accesstoken)
                return;
            }
            setError(true)
        } catch (error) {
            alert(error)
        }
    }
    const Re_sendOTP = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post(`/${Info.url}`, { number: Info.number })
            setOtp(new Array(6).fill(""))
            response.data.success ? setError(false) : alert(response.data.message)
        } catch (err) {
            alert(err)
        }
    }


    return Info.status ? (
        <div className="otp_body">
            <form onSubmit={VefifyOTP} className="otp_form">
                <div className="">
                    <h1 className="otp_title">Verification Code</h1>
                </div>
                <div className="otp_form_np" >
                    {
                        err ? <h3 className="otp_title_contact" style={{ color: 'red' }}>Invalid OTP</h3>:
                            <h3 className="otp_title_contact">
                                Please Enter The Verification Code Send To 91+{Info.number}
                            </h3>
                    }
                </div>
                <div className="otp_form_np">
                    <label className="otp_label" >Enter OTP</label>
                    <div className='otp_input_container' >
                        {
                            otp.map((data, index) => {
                                return (
                                    <input className="otp_input"
                                        type="text"
                                        maxLength="1"
                                        key={index}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onFocus={(e) => e.target.select()}
                                        placeholder="_"
                                        required
                                    />
                                )
                            })
                        }
                    </div>
                </div >
                <div className="">
                    <h4 className="otp_nonotp">Didn't receive the code
                        <span className="opt_resend" onClick={(e) => Re_sendOTP(e)} >Resend OTP?</span>
                    </h4>
                </div>
                <button type="submit" className="otp_button">Verify</button>
            </form>
        </div>
    ) : null
}

export default OTPVerify