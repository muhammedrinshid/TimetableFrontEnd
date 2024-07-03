import React, { useState } from 'react';
import { PiChalkboardTeacherDuotone, PiStudent } from 'react-icons/pi';

const ToggleButton = ({onChange,value}) => {


  const handleViewType = (type) => {
    if (type != value) {
      console.log(type)
      onChange(type);
    }
  };

  return (
   
    <div className="relative flex items-center bg-white   w-full rounded-lg overflow-clip border-r border-light-primary">
    <div
      className={`absolute w-1/2 h-full bg-light-primary  transition-transform duration-300 ease-in-out ${
        value  ? 'transform translate-x-0' : 'transform translate-x-full'
      }`}
    />
    <button
      className={`relative flex justify-center text-sm text-opacity-80 items-center z-10 w-1/2 text-center py-1  transition-colors duration-300 ${
        value ? 'text-white' : 'text-light-primary'
      }`}
      onClick={() => handleViewType(true)}
    >
     <PiChalkboardTeacherDuotone className='text-xl' />
     {"  "} Teacher View
    </button>
    <button
      className={`relative flex justify-center text-sm text-opacity-80  z-10 w-1/2 text-center py-1  transition-colors duration-300 ${
        value ? 'text-light-primary' : 'text-white'
      }`}
      onClick={() => handleViewType(false)}
    >            <PiStudent className='text-xl'/>

      {" "} Student View
    </button>
  </div>
  
  );
};

export default ToggleButton;
