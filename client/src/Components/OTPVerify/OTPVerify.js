
import React, { useState } from 'react'
import './OTPVerify.css'
import Axios from "../../Axios"

import { useDispatch } from "react-redux"
import  { login } from "../../Features/User"


function OTPVerify({ Info }) {
    const { trigger, url, ...userInfo } = Info

    const dispatch = useDispatch()
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [err, setError] = useState(false)
    const [loading, setLoading] = useState(false)
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
    userInfo.number=parseInt(userInfo.number)
    const vefifyOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Axios.post(`/${url}/otp-verify`, {
                otp: otp.join(""),
                ...userInfo
            })
            if (response.data.success) {
                dispatch(login(userInfo))
                localStorage.setItem("auth_token", response.data.accesstoken)
                return;
            }
            setError(true)
        } catch (error) {
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const reSendOTP = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post(`/${url}`, userInfo)
            setOtp(new Array(6).fill(""))
            response.data.success ? setError(false) : alert(response.data.message)
        } catch (err) {
            alert(err)
        }
    }


    return (
        <div className="otp_body">
            <form onSubmit={vefifyOTP} className="otp_form">
                <div className="">
                    <h1 className="otp_title">Verification Code</h1>
                </div>
                <div className="otp_form_np" >
                    {
                        err ? <h3 className="otp_title_contact" style={{ color: 'red' }}>Invalid OTP</h3> :
                            <h3 className="otp_title_contact">
                                Please enter OTP  we've sent you on 91+{Info.number}
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
                                        type="number"
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
                    <h4 className="otp_nonotp">Didn't receive the code? 
                        <span className="opt_resend" onClick={(e) => reSendOTP(e)} > Resend OTP</span>
                    </h4>
                </div>
                <button type="submit" className={`otp_button ${loading && "button_loading"}`}>
                    <span className='button_text'>Verify</span>
                </button>
            </form>
        </div>
    )
}

export default OTPVerify