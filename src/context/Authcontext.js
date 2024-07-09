import { Password } from "@mui/icons-material";
import React, {
    
    createContext,
    useContext,
    useState,

} from "react"

const AuthContext = createContext();

export const useAuth=()=>{
    return useContext(AuthContext)
}
let apiDomain="http://127.0.0.1:8000"
export const AuthProvider = ({children})=>{


   




    const [fullMenu,setFullmenu]=useState(true)


    const is_authenticated=true

    const contextData={

        is_authenticated:is_authenticated,
        fullMenu:fullMenu,
        setFullmenu:setFullmenu,
        NumberOfPeriodsInAday:7,
        numbeOfDayInWeek:5,
        totalperiodsInWeek:40,
        apiDomain:apiDomain,

    }




    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}
