import React, { useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import Axios from "../../Axios"
import OTPVerify from '../../Components/OTPVerify/OTPVerify'



function Login() {
  const [number, setNumber] = useState('')
  const [error, setError] = useState({trigger:false,message:''})
  const [otp, setOtp] = useState({ trigger: false, number, url: "", })
  const [loading,setLoading] = useState(false)
  const LoignNow = async (e) => {
    e.preventDefault()
    setLoading(!loading)
    try {

      const response = await Axios.post("/login", { number: parseInt(number) })
      
      response.data.success ? setOtp({ trigger: true, number, url: "login" }) :
        setError({ trigger: true, message: response.data.message })
      
    }catch (error) {
      setError({ trigger: true, message: error.message })
      
    }finally {
      setLoading(false)
    }
  }
  return (
    <div className="login" style={{ backgroundImage: "url(./images/ls_bg.jpg)"}}  >
      <div className='login_header'>
        <h1>Sign In WhyChat</h1>
      </div>
      {
        otp.trigger ? <OTPVerify Info={otp} /> : <div className='login_body'>
         
          <form onSubmit={LoignNow} className="login_from">
            <div className="login_from_np">
              <label className="login_lable" >Phone Number</label>
              <div className='Login_from_input_container'>
                <input
                  className='login_input'
                  type='number'
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required />
              </div>
              <div className='ls_body_err'>
                {error.trigger ? <span className='ls_err_message'>{error.message}</span> : null}
              </div>
            </div>
            <div className="login_from_np">
              <Link className="login_from_link" to='/singup'>Create New Account ?</Link>
            </div>
            <button type="submit" className={`login_button ${loading && "login_button  button_loading"}`}>
              <span className="button_text">Login</span>
            </button>
          </form>
        </div>
      }

    </div>
  )
}

export default Login