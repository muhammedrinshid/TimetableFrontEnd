import React from 'react';
import { User, CalendarCheck } from 'lucide-react';

const EmptyTeacherAttendanceState = () => {
  const features = [
    { icon: <User className="w-5 h-5" />, text: 'No teachers added yet' },
    { icon: <CalendarCheck className="w-5 h-5" />, text: 'No timetable generated yet' }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-4 ">
      <div className="max-w-lg w-full p-8 text-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
        {/* Empty State Icon */}
        <div className="relative h-20 w-20 mx-auto mb-6">
          <User className="w-20 h-20 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>

        {/* Main Content */}
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Teachers and Timetable Not Found
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 px-4">
          No teachers have been added or timetable created yet. Add teachers and generate a timetable to begin tracking attendance.
        </p>

        {/* Features List */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400">{feature.icon}</span>
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmptyTeacherAttendanceState;
