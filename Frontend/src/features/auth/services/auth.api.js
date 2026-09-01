import axios from "axios";

// create an instance of axios with baseURL and headers
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});


export async function register({username , email , password})
{
    try{
        const response = await api.post('api/auth/register', {
            username , email , password
        })
        console.log("frontend part");
        console.log("Register API RESPONSE............", response)
        return response.data
    }
    catch(err)
    {
        console.log("frontend part");
        console.log("Register API ERROR............", err)
        toast.error("Registered User Failed")
    }
}

export async function login({email , password})
{
    try{
        const response = await api.post('api/auth/login', {
            email , password
        })
        console.log("frontend part");
        console.log("LOGIN API RESPONSE............", response)
        return response.data
    }
    catch(err)
    {
        console.log("frontend part");
        console.log("LOGIN API ERROR............", err)
        toast.error("Login Failed")
    }
}

export async function logout()
{
    try{
        const response = await api.post('api/auth/logout')
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
}

export async function getMe()
{
    try{
        const response = await api.get('api/auth/get-me')
        console.log("frontend part");
        console.log("getMe API RESPONSE............", response)
        return response.data
    }
    catch(err)
    {
        console.log("frontend part");
        console.log("getMe API ERROR............", err)
        toast.error("getMe Failed")
    }
}

// create api layer for authentication, using axios to make api calls to the backend.
// communicate with backend and get data from backend and return data to hook layer.