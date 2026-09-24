import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// create an instance of axios with baseURL and headers
const api = axios.create({
  //baseURL: "http://localhost:3000",
  baseURL : BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

import { toast } from "react-hot-toast"

export async function register({username , email , password})
{
    try{
        const response = await api.post('/api/auth/register', {
            username , email , password
        })
        console.log("frontend part");
        console.log("Register API RESPONSE............", response)

        // now set token into localStorage
        // if (response.data?.token) {
        //     localStorage.setItem("token", response.data.token);
        // }
        return response.data
    }
    catch(err)
    {
        console.log("frontend part");
        console.log("Register API ERROR............", err)
        toast.error("Registered User Failed")
        throw err;
    }
}

export async function login({email , password})
{
    try{
        // call to backend and get response from backend
        const response = await api.post('/api/auth/login', {
            email , password
        })
        console.log("frontend part");
        console.log("LOGIN API RESPONSE............", response)

        // now set token into localStorage
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        //localStorage.setItem("token", JSON.stringify(response.data.token));
        
        console.log("response data of login ",response.data)

        return response.data
    }
    catch(err)
    {
        console.log("frontend part");
        console.log("LOGIN API ERROR............", err)
        toast.error(err.response?.data?.message || "Login Failed")
        throw err;
    }
}

export async function logout()
{
    try{
        const response = await api.get('/api/auth/logout')
        console.log("frontend part");
        console.log("LOGOUT API RESPONSE............", response)
        return response.data
    }
    catch(err)
    {
        console.log("frontend part");
        console.log("LOGOUT API ERROR............", err)
        toast.error("LOGOUT Failed")
    }
    finally {
        // ALWAYS remove token from client storage
        localStorage.removeItem("token");
    }
}

export async function getMe() {
    try {
        const token = localStorage.getItem("token");

        // Guard Clause: Agar local storage me token nahi hai toh network request na karein
        if (!token) {
            return { success: false, user: null, message: "No token found" };
        }

        const response = await api.get('/api/auth/get-me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("frontend part");
        console.log("getMe API RESPONSE............", response.data);

        return response.data;
    } catch (err) {
        console.log("frontend part");
        console.warn("getMe API ERROR............", err.response?.data?.message || err.message);

        // Toast error REMOVED (Guest/logged-out flow me error toast nahi dikhana chahiye)
        return {
            success: false,
            user: null,
            message: err.response?.data?.message || "Unauthorized"
        };
    }
}
// export async function getMe()
// {
//     try{
//         const response = await api.get('/api/auth/get-me')
//         console.log("frontend part");
//         console.log("getMe API RESPONSE............", response)
//         return response.data
//     }
//     catch(err)
//     {
//         console.log("frontend part");
//         console.log("getMe API ERROR............", err)
//         toast.error("getMe Failed")
//     }
// }

// create api layer for authentication, using axios to make api calls to the backend.
// communicate with backend and get data from backend and return data to hook layer.