import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import  { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
let apiDomain = "http://127.0.0.1:8000";
export const AuthProvider = ({ children }) => {
  const [authTocken, setAuthTocken] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  
  const [loading, setLoading] = useState(true);
  const [fullMenu, setFullmenu] = useState(true);

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens") ? jwtDecode(authTocken.access) : null
  );


  

  useEffect(() => {
    if (loading) {
      if (authTocken) {
        updateTocken();
      }
    }
    let intervalId = setInterval(() => {
      if (authTocken) {
        updateTocken();
      }
    }, 1000 * 60 * 14);
    return () => {
      clearInterval(intervalId);
    };
  }, [authTocken, loading]);

  let logoutUser = () => {
    setUser(null);
    setAuthTocken(null);
    localStorage.removeItem("authTokens");
  };


  let updateTocken = async () => {

    axios
      .post(`${apiDomain}/api/token/refresh/`, {
        refresh: authTocken.refresh,
      })
      .then((res) => {
        if (res.status == 200) {
          setAuthTocken(()=>res.data);
          setUser(jwtDecode(res.data?.access));
          localStorage.setItem("authTokens", JSON.stringify(res.data));
        }
      })
      .catch((error) => {
        if (error.response) {
          logoutUser();
        }
      });
    if (loading) {
      setLoading(false);
    }
  };


  const contextData = {
    user:user,
    fullMenu: fullMenu,
    setFullmenu: setFullmenu,
    NumberOfPeriodsInAday: 7,
    numbeOfDayInWeek: 5,
    totalperiodsInWeek: 40,
    apiDomain: apiDomain,
    setAuthTocken:setAuthTocken,
    setUser:setUser,
    logoutUser:logoutUser,
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+String(authTocken?.access)
    },
    fileUploadHeaders:{
      headers:{
        "Content-Type":"multipart/form-data",
        'Authorization':'Bearer '+String(authTocken?.access)
      }
    
    },
    getHeaders:{
      headers:{
        'Authorization':'Bearer '+String(authTocken?.access)


      }
    
    },

  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
