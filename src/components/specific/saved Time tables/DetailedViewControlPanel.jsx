import React, { useState } from "react";
import { PiChalkboardTeacherDuotone, PiStudent } from "react-icons/pi";

const DetailedViewControlPanel = ({ days, onDayChange, onViewChange,selectedDay,isTeacherView }) => {





  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center mx-2 gap-4 px-3">
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

      {/* Day Buttons */}
      <div className="flex flex-wrap justify-end items-center gap-2 flex-grow">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`px-4 py-2 text-sm font-medium border transition-all duration-300 rounded-lg shadow-md
              ${
                selectedDay === day
                  ? "bg-light-primary text-white border-light-primary hover:bg-light-primaryShades-700"
                  : "bg-white text-light-primary border-light-primaryShades-300 hover:bg-light-primaryShades-400"
              } focus:ring-2 focus:ring-light-primary focus:bg-light-primary focus:text-white`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DetailedViewControlPanel;
