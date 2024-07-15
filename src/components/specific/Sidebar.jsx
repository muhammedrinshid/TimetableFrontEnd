import React from "react";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";

import { LuSchool } from "react-icons/lu";

import { AiOutlineLogout } from "react-icons/ai";
import { menuData, bottomMenu } from "../../assets/datas";
import { useAuth } from "../../context/Authcontext";
import { NavLink, Navigate, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { fullMenu, setFullmenu, logoutUser } = useAuth();

  const navigate=useNavigate()
  return (
    <div class="bg-light-primary opacity-90 flex flex-col justify-between">
      {/* menus */}
      <div className="flex flex-col justify-center gap-1 pt-6">
      {menuData.map((ele) => (
  <NavLink
    key={ele.path}
    to={ele.path}
    className={({ isActive }) => 
      `flex cursor-pointer ${
        fullMenu ? "justify-start" : "justify-center"
      } items-center rounded-lg m-2 duration-200 
      ${isActive 
        ? "bg-white" 
        : "text-white text-opacity-80 hover:bg-white hover:text-opacity-100"}`
    }
  >
    {({ isActive }) => (
      <>
        <span className={`text-xl p-2 text-center cursor-pointer ${
          isActive ? "text-light-primary" : "text-white group-hover:text-light-primary"
        }`}>
          {ele.icon}
        </span>
        {fullMenu && (
          <p className={`animate-zoom-in text-sm duration-200 ml-1 ${
            isActive ? "text-light-primary" : "text-white group-hover:text-light-primary"
          }`}>
            {ele.name}
          </p>
        )}
      </>
    )}
  </NavLink>
))}
      </div>

      {/* logout and settings */}
      <div className="flex flex-col justify-center gap-1 pb-6 border-t border-white border-opacity-70">
        <div
          className={`flex ${
            fullMenu ? "justify-start" : "justify-center"
          } items-center rounded-lg  m-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300 hover:opacity-70`}
          onClick={()=>navigate("user-profile")}
        >
          <span className=" text-xl p-2 text-center    cursor-pointer">
            <LuSchool />
          </span>
          {fullMenu && (
            <p className="animate-slide-in-left text-sm duration-200 ml-1">
              Profile
            </p>
          )}
        </div>
        <div
          onClick={() => logoutUser()}
          className={`flex ${
            fullMenu ? "justify-start" : "justify-center"
          } items-center rounded-lg  m-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300 hover:opacity-70`}
        >
          <span className=" text-xl p-2 text-center    cursor-pointer">
            <AiOutlineLogout />
          </span>
          {fullMenu && (
            <p className="animate-slide-in-left text-sm duration-200 ml-1">
              Lougout
            </p>
          )}
        </div>

        <div
          onClick={() => setFullmenu((cur) => !cur)}
          className="flex justify-center rounded-md  m-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300 "
        >
          <span className=" text-xl p-2 text-center    cursor-pointer">
            {fullMenu ? <CgMenuRight /> : <CgMenuLeft />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
