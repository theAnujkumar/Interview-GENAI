// data ke ander user ayenga aur userdetails
// hook layer manages state and api layer
// when call api layer and what to do of api layer data/response
// and store data

// now consume the auth context data in any component that is a child of AuthProvider

import {useContext , useEffect} from "react"
import {AuthContext} from "../auth.context.jsx"
import { getMe, login, logout, register } from "../services/auth.api.js"
import {useNavigate } from "react-router"

export const useAuth = () => {

    // consume the context by using useContext keyword
    const context = useContext(AuthContext)
    const navigate = useNavigate()
    const {user , setUser , loading , setLoading} = context

    // here backend login function call through api services
    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await login({ email, password });
            
            if (response?.user) {
                // now set user and then state update
                setUser(response.user);
                setLoading(false);
                return true; // Success return karein
            }
            
            setLoading(false);
            return false;
        } catch (err) {
            console.error("Login handle error:", err);
            setLoading(false);
            return false;
        }
    };

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
            await logout(); // Calls API and cleans localStorage
        }
        catch(err)
        {
            console.log(err)
        }
        finally {
            setUser(null); // Clear React state
            setLoading(false);
            navigate('/login'); // Redirect user cleanly
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            const token = localStorage.getItem("token");

            // 1. Guard Clause: Agar token hi nahi hai toh API call mat karo
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const data = await getMe();

                // 2. Safe Optional Chaining & Success Check
                if (data?.success && data?.user) {
                    setUser(data.user);
                } else {
                    // Token invalid ya expired ho gaya hai
                    localStorage.removeItem("token");
                    setUser(null);
                    navigate('/login');
                }
            } catch (err) {
                console.error("Auth initialization error:", err);
                localStorage.removeItem("token");
                setUser(null);
                navigate('/login');
            } finally {
                // 3. Guaranteed Loading State Update
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);
    // useEffect(() => {
        
    //     const getAndSetUser = async() => {
    //         try{
    //             const data = await getMe()
    //             setUser(data.user)
    //             setLoading(false)
    //         }
    //         catch(err)
    //         {
    //             console.log(err)
    //             setLoading(false)
    //             navigate('/login')
    //         }
    //     }
    //     getAndSetUser()
    // },[])

    return { user, loading, handleLogin, handleRegister, handleLogout }

}

// get me 