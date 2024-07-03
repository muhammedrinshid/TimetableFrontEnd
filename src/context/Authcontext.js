import React, {
    
    createContext,
    useContext,
    useState,

} from "react"

const AuthContext = createContext();

export const useAuth=()=>{
    return useContext(AuthContext)
}

export const AuthProvider = ({children})=>{




    const [fullMenu,setFullmenu]=useState(true)


    const is_authenticated=true

    const contextData={

        is_authenticated:is_authenticated,
        fullMenu:fullMenu,
        setFullmenu:setFullmenu,
        NumberOfPeriodsInAday:6

    }




    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}
