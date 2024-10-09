import React from "react";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import { LuSchool } from "react-icons/lu";
import { AiOutlineLogout } from "react-icons/ai";
import { menuData, bottomMenu } from "../../assets/datas";
import { useAuth } from "../../context/Authcontext";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { fullMenu, setFullmenu, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-light-primary dark:bg-dark-primary dark:opacity-90 opacity-90 flex flex-col h-full">
      {/* menus */}
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="flex flex-col justify-start py-4">
          {menuData.map((ele) => (
            <NavLink
              key={ele.path}
              to={ele.path}
              className={({ isActive }) =>
                `flex cursor-pointer ${
                  fullMenu ? "justify-start" : "justify-center"
                } items-center rounded-lg mx-2 my-1 p-2 duration-200  text-white text-opacity-80 hover:text-light-primary dark:hover:text-dark-background1 hover:bg-white dark:hover:bg-dark-accent hover:opacity-70
        ${isActive ? "bg-white bg-opacity-80 dark:bg-dark-accent " : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-xl text-center cursor-pointer ${
                      isActive
                        ? "text-light-primary dark:text-dark-background1"
                        : "hover:text-opacity-100"
                    }`}
                  >
                    {ele.icon}
                  </span>
                  {fullMenu && (
                    <p
                      className={`animate-zoom-in text-xs duration-200 ml-2 ${
                        isActive
                          ? "text-light-primary dark:text-dark-background1"
                          : ""
                      }`}
                    >
                      {ele.name}
                    </p>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* logout and settings */}
      <div className="flex-shrink-0 border-t border-white border-opacity-70">
        <div
          className={`flex ${
            fullMenu ? "justify-start" : "justify-center"
          } items-center rounded-lg mx-2 my-1 p-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300 hover:opacity-70`}
          onClick={() => navigate("user-profile")}
        >
          <span className="text-xl text-center cursor-pointer">
            <LuSchool />
          </span>
          {fullMenu && (
            <p className="animate-slide-in-left text-xs duration-200 ml-2">
              Profile
            </p>
          )}
        </div>
        <div
          onClick={() => logoutUser()}
          className={`flex ${
            fullMenu ? "justify-start" : "justify-center"
          } items-center rounded-lg mx-2 my-1 p-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300 hover:opacity-70`}
        >
          <span className="text-xl text-center cursor-pointer">
            <AiOutlineLogout />
          </span>
          {fullMenu && (
            <p className="animate-slide-in-left text-xs duration-200 ml-2">
              Logout
            </p>
          )}
        </div>
        <div
          onClick={() => setFullmenu((cur) => !cur)}
          className="flex justify-center rounded-md mx-2 my-1 p-2 text-white text-opacity-80 hover:text-light-primary hover:bg-white duration-300"
        >
          <span className="text-xl text-center cursor-pointer">
            {fullMenu ? <CgMenuRight /> : <CgMenuLeft />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
