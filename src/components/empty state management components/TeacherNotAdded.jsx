import React from 'react';
import { UserPlus } from 'lucide-react';

const TeacherNotAdded = ({ handleCreateTeacherOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in-blur">
      <UserPlus 
        className="w-16 h-16 text-light-secondary dark:text-dark-accent mb-6 animate-zoom-in" 
      />
      
      <h2 className="text-2xl font-semibold text-light-primary dark:text-dark-text mb-3 font-Inter">
        Teacher Profile Required
      </h2>
      
      <p className="text-light-primaryShades-600 dark:text-dark-muted mb-2 max-w-sm font-Roboto">
        To optimize class scheduling and resource allocation, please add teacher information to proceed.
      </p>
      
      <p className="text-sm text-text_1 dark:text-dark-muted mb-8 max-w-sm font-Roboto">
        Adding a teacher profile will enable you to manage schedules, subjects, and classroom assignments effectively.
      </p>
      
      <button
        onClick={handleCreateTeacherOpen}
        className="px-6 py-3 bg-light-primary dark:bg-dark-accent text-white rounded-md 
                 hover:bg-light-primaryShades-700 dark:hover:bg-dark-primaryShades-600 
                 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent 
                 focus:ring-offset-2 transition-colors
                 font-Inter text-sm"
      >
        Create Teacher Profile
      </button>
    </div>
  );
};

export default TeacherNotAdded;