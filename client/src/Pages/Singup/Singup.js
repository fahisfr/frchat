import React from 'react'
import { Link } from 'react-router-dom'


import './Singup.css'



function Singup() {
    return (
        <div className="singup">
            <div className='singup_header'>
                <h1>Sing Up</h1>
            </div>
            <div className='singup_body'>
                <form className="singup_from">
                    <div className="loign_from_np">
                        <label className="login_lable" >Nmae</label>
                        <div className='Loign_from_input_container'>
                            <input className='login_input' type='text' placeholder='' />
                        </div>
                    </div>
                    <div className="singup_from_np">
                        <label className="singup_lable" >Phone Number</label>
                        <div className='singup_from_input_container'>
                            <input className='login_input' type='number' placeholder='' />
                        </div>
                    </div>
                    <div className="singup_from_np">
                        <label className="login_lable" >Password</label>
                        <div className='singup_from_input_container'>
                            <input className='login_input' type='password' placeholder='' />
                        </div>
                    </div>
                    <div className="loign_from_np">
                        <label className="login_lable" >Confirm Password</label>
                        <div className='Loign_from_input_container'>
                            <input className='login_input' type='password' />
                        </div>
                    </div>
                    <div className="singup_from_np">
                        <Link className="singup_from_link" to='/login'>Already have an account ?</Link>
                    </div>
                    <button className="singup_button">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Singup