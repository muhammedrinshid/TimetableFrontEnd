import React from 'react'
import BreadcrumbsComponent from './BreadcrumbsComponent'
import { CiDark, CiLight } from 'react-icons/ci'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { useAuth } from '../../context/Authcontext'

const Topbar = () => {
  const { darkMode, toggleTheme } = useAuth();
  return (
    <div className="flex flex-row justify-between p-4">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
        <BreadcrumbsComponent />
      </h2>
      <div className="flex flex-row justify-center gap-2 border-t border-white border-opacity-70 dark:border-gray-600">
        <div className="flex items-center rounded-full text-dark-primary text-opacity-80 hover:text-white hover:bg-light-primary duration-300 hover:opacity-50">
          <span
            onClick={toggleTheme}
            className="text-xl p-3 text-center cursor-pointer"
          >
            {darkMode ? (
              <CiLight className="text-gray-200" /> // Light icon in dark mode
            ) : (
              <CiDark className="text-gray-800" /> // Dark icon in light mode
            )}
          </span>
        </div>
        <div className="flex items-center rounded-full text-dark-primary text-opacity-80 hover:text-white hover:bg-light-primary duration-300 hover:opacity-50">
          <span className="text-xl p-3 text-center cursor-pointer">
            <IoIosNotificationsOutline className="text-gray-800 dark:text-gray-200" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Topbar
