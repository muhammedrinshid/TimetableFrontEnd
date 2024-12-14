import React from "react";
import { PiChalkboardTeacherDuotone, PiStudent } from "react-icons/pi";
import { FaExpand } from "react-icons/fa"; // Expand icon from react-icons

const CompactViewControlPanel = ({ onViewChange, isTeacherView, onExpandView }) => {

  return (
    <div className="w-full flex justify-between items-center mx-2 gap-4 px-3 mb-4">
      {/* Toggle Button */}
      <div className="basis-1/3 flex justify-center sm:justify-start">
        <div
          className="relative flex w-full max-w-md rounded-full overflow-hidden transition-all h-12 shadow-lg bg-white"
        >
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-8px)] rounded-full transition-transform duration-500 ease-in-out
              ${isTeacherView ? "left-1" : "right-1"}
              bg-gradient-to-r from-light-primary to-light-secondary shadow-md`}
          />
          <button
            onClick={() => onViewChange(true)}
            className={`flex-1 flex items-center justify-center font-medium z-10 transition-colors duration-500
              ${isTeacherView ? "text-white" : "text-light-primary"} hover:scale-105`}
          >
            <PiChalkboardTeacherDuotone size={24} className="mr-2" />
            Teacher
          </button>
          <button
            onClick={() => onViewChange(false)}
            className={`flex-1 flex items-center justify-center font-medium z-10 transition-colors duration-500
              ${!isTeacherView ? "text-white" : "text-light-primary"} hover:scale-105`}
          >
            <PiStudent size={24} className="mr-2" />
            Class
          </button>
        </div>
      </div>

      {/* Expand Button */}
      <div className="flex justify-center sm:justify-end items-center flex-grow">
        <button
          onClick={onExpandView}
          className="px-4 py-2 text-sm font-medium bg-light-primary text-white rounded-lg shadow-md transition-all duration-300 hover:bg-light-primaryShades-500 flex items-center"
        >
          <FaExpand size={16} className="mr-2" />
          Expand View
        </button>
      </div>
    </div>
  );
};

export default CompactViewControlPanel;
