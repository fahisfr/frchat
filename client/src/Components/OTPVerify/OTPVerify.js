import Button from '@restart/ui/esm/Button'
import React from 'react'
import './OTPVerify.css'

function OTPVerify(props) {
    return props.trgger ? (
        <div className="otp">
            <form className="otp_form">
                <div className="">
                    <h1 className="otp_title">Verification Code</h1>
                </div>
                <div className="otp_form_np" >
                    <h3 className="otp_title_content">Please Enter The Verification Code Send To 91+9633062570</h3>
                </div>
                <div className="otp_form_np">
                    <label className="otp_label" >Enter OTP</label>
                    <div className='otp_input_container'>
                        <input className='otp_input' type='number'  />
                    </div>
                </div >
                <div className="">
                    <h4 className="otp_nonotp">Didn't receive the code 
                        <span className="opt_resend"> Resend OTP?</span></h4>
                </div>
                <Button type="submit" className="otp_button">Verify</Button>
            </form>

        </div>
    ):null
      
}

export default OTPVerify