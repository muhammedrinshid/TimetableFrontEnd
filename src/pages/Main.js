import React, { useContext } from "react";
import { userAvatar } from "../assets/images";
import classNames from "classnames";
import { Sidebar, Topbar } from "../components/specific";
import { useAuth } from "../context/Authcontext";
import { Outlet } from "react-router-dom";





const Main = () => {
  const { fullMenu } = useAuth();

  return (

    

    
    <div
      className={classNames(
        "h-full w-full grid  grid-rows-[5rem_1fr] duration-500 bg-dark-background1",
        fullMenu ? "grid-cols-[10rem_1fr]" : "grid-cols-[5rem_1fr] "
      )}
    >
      {/* grind item one */}
      <div class="bg-light-primary opacity-90 border-b border-white border-opacity-70 flex justify-center items-center ">
        <img
          src={userAvatar}
          className="rounded-full opacity-80"
          width={40}
          alt=""
        />
      </div>

      {/* grid item two top bar*/}
      <Topbar />
      {/* grid item thre side bar */}
      <Sidebar />

      {/* grid item four main content */}


      <React.Fragment><Outlet />{Outlet}</React.Fragment>
     
      
    </div>



  );
};

export default Main;
