import React from "react";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import { menuData, bottomMenu } from "../../assets/datas";
import { useAuth } from "../../context/Authcontext";
import { NavLink, Navigate } from "react-router-dom";

const Sidebar = () => {
  const { fullMenu, setFullmenu } = useAuth();
  return (
    <div class="bg-light-primary opacity-90 flex flex-col justify-between">
      {/* menus */}
      <div className="flex flex-col justify-center gap-1 pt-6">
        {menuData.map((ele) => (
          <NavLink className={({isActive})=>isActive?"":null} to={ele.path}>
          <div
          onClick={Navigate(ele.path)}
            className={`flex cursor-pointer ${
              fullMenu ? "justify-start" : "justify-center"
            } items-center rounded-lg  m-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-200 hover:opacity-70 `}
          >
            <span className=" text-xl p-2 text-center    cursor-pointer">
              {ele.icon}
            </span>
            {fullMenu && (
              <p className="animate-zoom-in text-sm duration-200 ml-1">
                {ele.name}
              </p>
            )}
          </div>
          </NavLink>
        ))}
      </div>

      {/* logout and settings */}
      <div className="flex flex-col justify-center gap-1 pb-6 border-t border-white border-opacity-70">
        {bottomMenu.map((ele) => (
          <div
            className={`flex ${
              fullMenu ? "justify-start" : "justify-center"
            } items-center rounded-lg  m-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300 hover:opacity-70`}
          >
            <span className=" text-xl p-2 text-center    cursor-pointer">
              {ele.icon}
            </span>
            {fullMenu && (
              <p className="animate-slide-in-left text-sm duration-200 ml-1">
                {ele.name}
              </p>
            )}
          </div>
        ))}
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
