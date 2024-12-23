import React, { useState, useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Advanced data generation with more sophisticated logic
const generateProfessionalData = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const data = [];

  const sophisticatedNotes = [
    "Strategic planning",
    "Deep work session",
    "Project milestone",
    "Collaborative effort",
    "Innovation breakthrough"
  ];

  while (start <= end) {
    const performanceScore = Math.floor(Math.random() * 5) - 2; // Range from -2 to 2
    
    data.push({
      date: start.toISOString().split('T')[0],
      count: performanceScore,
      details: {
        score: performanceScore,
        insight: sophisticatedNotes[Math.floor(Math.random() * sophisticatedNotes.length)]
      }
    });
    
    start.setDate(start.getDate() + 1);
  }

  return data;
};

// Sophisticated color mapping
const getPerformanceColorClass = (value) => {
  if (!value || value.count === undefined) return 'fill-neutral-100';
  
  const colorMap = {
    2: 'fill-emerald-600 dark:fill-emerald-400',
    1: 'fill-emerald-400 dark:fill-emerald-300',
    0: 'fill-neutral-300 dark:fill-neutral-600',
    '-1': 'fill-rose-400 dark:fill-rose-500',
    '-2': 'fill-rose-600 dark:fill-rose-700'
  };

  return colorMap[value.count] || 'fill-neutral-200';
};

const HeatmapCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Memoized data generation
  const monthData = useMemo(() => 
    generateProfessionalData(currentDate.getFullYear(), currentDate.getMonth()), 
    [currentDate.getFullYear(), currentDate.getMonth()]
  );

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date) => 
    date.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
      {/* Refined Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <button 
          onClick={() => changeMonth(-1)} 
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          {formatMonthYear(currentDate)}
        </h2>
        
        <button 
          onClick={() => changeMonth(1)} 
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          aria-label="Next Month"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Heatmap Container */}
      <div className="flex-grow p-4">
        <CalendarHeatmap
          startDate={new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)}
          endDate={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)}
          values={monthData}
          classForValue={getPerformanceColorClass}
          tooltipDataAttrs={(value) => {
            if (!value?.details) return {};
            return {
              'data-tooltip-content': `
                Date: ${value.date || 'N/A'}
                Performance Score: ${value.details.score}
                Insight: ${value.details.insight || 'No additional insights'}
              `
            };
          }}
          showWeekdayLabels
          gutterSize={3}
        />
      </div>

      {/* Performance Legend */}
      <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-between items-center space-x-2 text-xs text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm fill-emerald-600 dark:fill-emerald-400"></div>
            <span>Exceptional</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm fill-emerald-400 dark:fill-emerald-300"></div>
            <span>Strong</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm fill-neutral-300 dark:fill-neutral-600"></div>
            <span>Neutral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm fill-rose-400 dark:fill-rose-500"></div>
            <span>Below Par</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm fill-rose-600 dark:fill-rose-700"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapCalendar;