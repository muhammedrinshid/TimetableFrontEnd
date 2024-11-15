import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, CalendarDays } from 'lucide-react';

const EmptyDefaultTimetableState = ({ onGenerate, onBrowseTemplates }) => {
  const [isIconHovered, setIsIconHovered] = useState(false);

  const features = [
    { icon: <Sparkles className="w-5 h-5" />, text: 'AI-powered schedule generation' },
    { icon: <Clock className="w-5 h-5" />, text: 'Optimized time management' },
    { icon: <CalendarDays className="w-5 h-5" />, text: 'Flexible customization options' }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-12 text-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700  dark:bg-gray-800/80 backdrop-blur-md">
        {/* Animated Icon */}
        <div 
          className="relative h-20 w-20 mx-auto mb-8"
          onMouseEnter={() => setIsIconHovered(true)}
          onMouseLeave={() => setIsIconHovered(false)}
        >
          <Calendar 
            className={`w-20 h-20 text-blue-600 dark:text-blue-400 absolute top-0 left-0 transition-all duration-500 transform
              ${isIconHovered ? 'opacity-0 scale-0' : 'opacity-80 scale-100'}`}
          />
          <Clock 
            className={`w-20 h-20 text-blue-600 dark:text-blue-400 absolute top-0 left-0 transition-all duration-500 transform
              ${isIconHovered ? 'opacity-80 scale-100' : 'opacity-0 scale-0'}`}
          />
        </div>

        {/* Main Content */}
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          Ready to Create Your Perfect Schedule?
        </h3>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          No default timetable found. Let's create one that works for you!
        </p>

        {/* Features List */}
        <ul className="max-w-md mx-auto mb-8 space-y-3">
          {features.map((feature, index) => (
            <li 
              key={index}
              className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300"
            >
              <span className="text-blue-600 dark:text-blue-400">
                {feature.icon}
              </span>
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <button
            onClick={onGenerate}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Schedule
          </button>
          
          <button
            onClick={onBrowseTemplates}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Browse Templates
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyDefaultTimetableState;

