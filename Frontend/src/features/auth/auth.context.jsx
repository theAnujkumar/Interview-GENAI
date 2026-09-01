import {createContext, useState} from "react"

// create a context
export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const[user , setUser] = useState(null)
    const[loading , setLoading] = useState(true)

    // it will do context provide
    return(
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

// do complete

/*
state layer
state management for authentication, using context API to provide 
user state and loading state across the application. 
and store data or frontend data
*/