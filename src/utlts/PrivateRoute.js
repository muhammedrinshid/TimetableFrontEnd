
import {Navigate, Outlet,} from 'react-router-dom'
import { useAuth } from '../context/Authcontext'


const PrivateRoute = () => {

                                                                                                    
    const {is_authenticated}=useAuth()

  

  return (
    is_authenticated?<Outlet/>:<Navigate to="/login" />
  )
}

export default PrivateRoute                                                                                                                                                                                                               