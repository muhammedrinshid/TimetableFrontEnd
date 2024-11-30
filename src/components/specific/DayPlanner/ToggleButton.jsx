import React from "react";
import { PiChalkboardTeacherDuotone, PiStudent } from "react-icons/pi";
import { useAuth } from "../../../context/Authcontext";

const ToggleButton = ({ onChange, value }) => {
  const { darkMode } = useAuth();

  const handleViewType = (type) => {
    if (type !== value) {
      onChange(type);
    }
  };

  return (
    <div
      className={`relative flex w-full rounded-lg overflow-hidden transition-all h-full p-1 mr-5
        ${darkMode ? "bg-dark-secondary" : "bg-white shadow-md"}`}
    >
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-transform duration-500 ease-in-out
    ${value ? "left-1" : "right-1"}
    ${
      darkMode
        ? "bg-gradient-to-r from-dark-accent to-dark-primary"
        : "bg-gradient-to-r from-light-primary to-light-secondary"
    }`}
      />

      <button
        onClick={() => handleViewType(true)}
        className={`flex-1 flex items-center justify-center font-medium z-10 transition-colors duration-500
          ${
            value
              ? darkMode
                ? "text-dark-text"
                : "text-white"
              : darkMode
              ? "text-dark-muted"
              : "text-light-primary"
          }`}
      >
        <PiChalkboardTeacherDuotone size={20} className="mr-2" />
        Teacher
      </button>
      <button
        onClick={() => handleViewType(false)}
        className={`flex-1 flex items-center justify-center font-medium z-10 transition-colors duration-500
          ${
            !value
              ? darkMode
                ? "text-dark-text"
                : "text-white"
              : darkMode
              ? "text-dark-muted"
              : "text-light-primary"
          }`}
      >
        <PiStudent size={20} className="mr-2" />
        Class
      </button>
    </div>
  );
};

export default ToggleButton;
