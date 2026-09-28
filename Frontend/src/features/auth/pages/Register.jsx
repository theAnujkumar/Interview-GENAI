import React, { useState } from "react";
import {useNavigate , Link } from "react-router"
import "../../auth/auth.form.scss"
import { useAuth } from "../hooks/useAuth.js"

const Register = () => {
    
    const {loading , handleRegister} = useAuth()
    const navigate = useNavigate()

    const [username , setUsername] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        handleRegister({username,email,password})
        navigate("/")
    }

    // if(loading){
    //     return (<main><h1>Loading.......</h1></main>)
    // }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" id="username" name='username' placeholder='Enter username'/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name='email' placeholder='Enter email address'/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                type={showPassword ? "text" : "password"} id="password" name='password' placeholder='Enter password'/>
                            <button
                                className="password-toggle"
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((visible) => !visible)}
                            >
                                <span className="password-eye-icon" aria-hidden="true">
                                    {showPassword && <span className="password-eye-slash" />}
                                </span>
                            </button>
                        </div>
                    </div>
                    <button className='button primary-button' >Register</button>
                </form>
                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
};

export default Register;