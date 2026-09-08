// data ke ander user ayenga aur userdetails
// hook layer manages state and api layer
// when call api layer and what to do of api layer data/response
// and store data

// now consume the auth context data in any component that is a child of AuthProvider

import {useContext , useEffect} from "react"
import {AuthContext} from "../auth.context.jsx"
import { getMe, login, logout, register } from "../services/auth.api.js"

export const useAuth = () => {

    // consume the context by using useContext keyword
    const context = useContext(AuthContext)
    const {user , setUser , loading , setLoading} = context

    // here backend login function call through api services
    const handleLogin = async({email,password}) => {
        setLoading(true)
        try{
            const response = await login({email,password})
            // here In setuser me user ka data store ho jayenga frontend me
            setUser(response.user)
            setLoading(false)
        }
        catch(err)
        {
            console.log(err)
            setLoading(false)
        }
    }

    const handleRegister = async({username,email,password}) => {
        setLoading(true)
        try{
            const response = await register({username,email,password})
            setUser(response.user)
            setLoading(false)
        }
        catch(err)
        {
            console.log(err)
            setLoading(false)
        }
    }

    const handleLogout = async() => {
        setLoading(true)
        try{
            const response = await logout()
            setUser(null)
            setLoading(false)
        }
        catch(err)
        {
            console.log(err)
            setLoading(false)
        }
    }

    useEffect(() => {
        
        const getAndSetUser = async() => {
            try{
                const data = await getMe()
                setUser(data.user)
                setLoading(false)
            }
            catch(err)
            {
                console.log(err)
                setLoading(false)
            }
        }
        getAndSetUser()
    },[])

    return { user, loading, handleLogin, handleRegister, handleLogout }

}

// get me 