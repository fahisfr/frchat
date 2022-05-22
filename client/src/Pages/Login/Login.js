import React, { useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import Axios from "../../Axios"
import OTPVerify from '../../Components/OTPVerify/OTPVerify'





function Login() {
  const [number, setNumber] = useState('')
  const [otp, setOtp] = useState({ trigger:false, number, url: "", })
  const LoignNow = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", {number:parseInt(number)})
      if (response.data.success) {
        setOtp({trigger:true,number,url:"login"})
      }

    } catch (error) {

    }
  }
  return (
    <div className="login" >
      <div className='login_header'>
        <h1>Sign In WhyChat</h1>
      </div>
      {
        otp.trigger ? <OTPVerify Info={otp} /> : <div className='login_body'>
          <form onSubmit={LoignNow} className="loign_from">
            <div className="loign_from_np">
              <label className="login_lable" >Phone Number</label>
              <div className='Loign_from_input_container'>
                <input
                  className='login_input'
                  type='text'
                  maxLength='10'
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required />
              </div>
            </div>
            <div className="loign_from_np">
              <Link className="loign_from_link" to='/singup'>Create New Account</Link>
            </div>
            <button type="submit" className="loign_button">Login</button>
          </form>
        </div>
      }

    </div>
  )
}

export default Login