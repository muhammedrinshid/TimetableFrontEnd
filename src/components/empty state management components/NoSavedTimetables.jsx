import React from 'react';
import { Calendar } from 'lucide-react';

const NoSavedTimetables = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in-blur">
      <Calendar 
        className="w-12 h-12 text-light-secondaryShades-400 dark:text-dark-muted mb-4 animate-zoom-in" 
      />
      
      <h3 className="text-lg font-medium text-light-primary dark:text-dark-text mb-2 font-Inter">
        No Saved Timetables
      </h3>
      
      <p className="text-sm text-text_1 dark:text-dark-muted max-w-sm font-Roboto">
        Your generated timetables will appear here for quick access and future reference.
      </p>
    </div>
  );
};

export default NoSavedTimetables;