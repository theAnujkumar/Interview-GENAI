import React, { useState } from "react";
import {useNavigate , Link } from "react-router"
import "../../auth/auth.form.scss"
import { useAuth } from "../hooks/useAuth.js"

const Login = () => {
    
    // consume the context
    const {loading , handleLogin} = useAuth()
    const navigate = useNavigate()

    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")

    // on submit it would call handleLogin in hooks then call to backend
    // const handleSubmit = async(e) => {
    //     e.preventDefault()
    //     handleLogin({email,password})
    //     navigate("/")
    // }
    const handleSubmit = async (e) => {
        e.preventDefault()
        // 1. handleLogin execute hoga aur user state update karega
        const isSuccess = await handleLogin({email,password})
        
        // 2. Agar login success hua tabhi turant navigate hoga
        if (isSuccess) {
            navigate('/'); // Yahan apna main route daalein
        }
    };
    // const handleSubmit = async (data) => {
    //     // 1. handleLogin execute hoga aur user state update karega
    //     const isSuccess = await handleLogin(data);
        
    //     // 2. Agar login success hua tabhi turant navigate hoga
    //     if (isSuccess) {
    //         navigate('/'); // Yahan apna main route daalein
    //     }
    // };

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name='email' placeholder='Enter email address'/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" id="password" name='password' placeholder='Enter password'/>
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    )
};

export default Login;