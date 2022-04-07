import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'

import OTPVerify from '../../Components/OTPVerify/OTPVerify'

function Login() {
  return (
    <div className="login">
        {/* <OTPVerify trgger={false}/> */}
      <div className='login_header'>
        <h1>Sign In WhyChat</h1>
      </div>
      <div className='login_body'>
        <form className="loign_from">
          <div className="loign_from_np">
            <label className="login_lable" >Phone Number</label>
            <div className='Loign_from_input_container'>
              <input className='login_input' type='number' placeholder='' />
            </div>
          </div>
          <div className="loign_from_np">
            <label className="login_lable" >Password</label>
            <div className='Loign_from_input_container'>
              <input className='login_input' type='password' placeholder='' />
            </div>
          </div>
          <div className="loign_from_np">
            <Link className="loign_from_link" to='/singup'>Create New Account</Link>
          </div>
          <button className="loign_button">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login