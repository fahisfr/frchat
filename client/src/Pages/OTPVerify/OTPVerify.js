
import React, { useState } from 'react'
import './OTPVerify.css'

function OTPVerify(props) {
    const [otp, setOtp] = useState(new Array(6).fill(""));
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

    return (
        <div className="otp">
            <div className="otp_body">
                <form className="otp_form">
                    <div className="">
                        <h1 className="otp_title">Verification Code</h1>
                    </div>
                    <div className="otp_form_np" >
                        <h3 className="otp_title_content">Please Enter The Verification Code Send To 91+9633062570</h3>
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
                                        />
                                    )}
                                )
                            }

                        </div>
                    </div >
                    <div className="">
                        <h4 className="otp_nonotp">Didn't receive the code
                            <span className="opt_resend"> Resend OTP?</span></h4>
                    </div>
                    <button type="submit" className="otp_button">Verify</button>
                </form>
            </div>

        </div>
    )

}

export default OTPVerify