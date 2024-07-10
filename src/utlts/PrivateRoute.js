
import {Navigate, Outlet,} from 'react-router-dom'
import { useAuth } from '../context/Authcontext'


const PrivateRoute = () => {

                                                                                                    
    const {user}=useAuth()
    console.log(user)

  

  return (
    user===null?<Navigate to="/login" />:<Outlet/>
  )
}

export default PrivateRoute                                                                                                                                                                                                               