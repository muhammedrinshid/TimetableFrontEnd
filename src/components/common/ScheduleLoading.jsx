import React, { useState, useEffect } from "react";
import { Clock, BookOpen, GraduationCap, Users } from "lucide-react";
import { useAuth } from "../../context/Authcontext";

const ScheduleLoading = ({ minDuration = 5 }) => {
  const { darkMode } = useAuth();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [rotation, setRotation] = useState(0);

  const messages = [
    "Arranging classes...",
    "Scheduling teachers...",
    "Optimizing lunch breaks...",
    "Balancing subjects...",
    "Finalizing timetables...",
    "Checking room conflicts...",
    "Resolving teacher conflicts...",
    "Handling student group conflicts...",
    "Validating elective group timeslot constraints...",
    "Ensuring teacher assignments...",
    "Ensuring timeslot assignments...",
    "Balancing tutor lesson load...",
    "Enforcing daily lesson limits...",
    "Preferring consistent teacher for subject...",
    "Limiting subjects to once per day...",
    "Avoiding overlapping periods for teachers with the same class...",
    "Avoiding continuous subject blocks...",
    "Minimizing continuous teaching for teachers...",
    "Avoiding consecutive elective lessons...",
  ];

  const icons = [BookOpen, Clock, GraduationCap, Users];

  useEffect(() => {
    setStartTime(Date.now());
    
    // Add a separate interval for faster rotation
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 5) % 360);
    }, 50);

    const interval = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const calculatedProgress = Math.min(
        (elapsedTime / minDuration) * 100,
        100
      );
      setProgress(calculatedProgress);
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      if (calculatedProgress >= 100 && elapsedTime >= minDuration) {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(rotationInterval);
    };
  }, [minDuration, startTime]);

  const styles = `
    @keyframes electron-glow {
      0%, 100% {
        filter: drop-shadow(0 0 4px ${darkMode ? "#60a5fa" : "#3b82f6"});
      }
      50% {
        filter: drop-shadow(0 0 8px ${darkMode ? "#93c5fd" : "#60a5fa"});
      }
    }
    .electron-glow {
      animation: electron-glow 3s ease-in-out infinite;
    }
  `;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-16">
      <style>{styles}</style>
      {/* Icon Animation Container */}
      <div className="relative w-64 h-64 mb-8">
        {icons.map((Icon, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 electron-glow"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation * 2}deg)`,
              top: `${
                50 -
                Math.cos(
                  (rotation / 180) * Math.PI + (index * Math.PI) / 2
                ) *
                  40
              }%`,
              left: `${
                50 +
                Math.sin(
                  (rotation / 180) * Math.PI + (index * Math.PI) / 2
                ) *
                  40
              }%`,
              transition: "all 0.1s linear",
            }}
          >
            <div className="bg-white/10 dark:bg-white/5 p-2 backdrop-blur-sm rounded-full">
              <Icon className="text-blue-600 dark:text-blue-400" size={24} strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>
      {/* Progress bar with gradient */}
      <div className="w-full max-w-md h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Message container */}
      <div className="mt-8 min-h-[60px] flex flex-col items-center justify-center">
        <p className="text-xl font-medium text-blue-600 dark:text-blue-400 text-center">
          {message}
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          {Math.round(progress)}% Complete
        </p>
      </div>
    </div>
  );
};

export default ScheduleLoading;