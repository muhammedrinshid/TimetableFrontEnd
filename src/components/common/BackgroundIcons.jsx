import React from 'react';
import { motion } from 'framer-motion';
import {
  RiCalendarLine, RiTimeLine, RiBookLine,
  RiAlarmLine, RiBookOpenLine
} from "react-icons/ri";
import {
  MdSchedule, MdOutlineClass,
  MdOutlineSchool, MdOutlineTimer
} from "react-icons/md";
import {
  FaChalkboardTeacher, FaBell,
  FaGraduationCap, FaClock
} from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import { SiStagetimer } from "react-icons/si";

const BackgroundIcons = () => {
  const iconComponents = [
    RiCalendarLine, RiTimeLine, RiBookLine, RiAlarmLine, 
    RiBookOpenLine, MdSchedule, MdOutlineClass, MdOutlineSchool,
    FaChalkboardTeacher, FaBell, FaGraduationCap, LuBrain,
    SiStagetimer, FaClock, MdOutlineTimer,
    RiCalendarLine, RiTimeLine, RiBookLine, RiAlarmLine, 
    RiBookOpenLine, MdSchedule, MdOutlineClass, MdOutlineSchool,
    FaChalkboardTeacher, FaBell, FaGraduationCap, LuBrain,
    SiStagetimer, FaClock, MdOutlineTimer,
    RiCalendarLine, RiTimeLine, RiBookLine, RiAlarmLine, 
    RiBookOpenLine, MdSchedule, MdOutlineClass, MdOutlineSchool,
    FaChalkboardTeacher, FaBell, FaGraduationCap, LuBrain,
    SiStagetimer, FaClock, MdOutlineTimer,
    RiCalendarLine, RiTimeLine, RiBookLine, RiAlarmLine, 
    RiBookOpenLine, MdSchedule, MdOutlineClass, MdOutlineSchool,
    FaChalkboardTeacher, FaBell, FaGraduationCap, LuBrain,
    SiStagetimer, FaClock, MdOutlineTimer,
  ];

  // Generate floating icon positions
  const iconPositions = React.useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.8 + Math.random() * 0.4,
      delay: Math.random() * 5,
      icon: iconComponents[i % iconComponents.length],
    }));
  }, []);

  // Generate hexagon grid points
  const hexPoints = React.useMemo(() => {
    const points = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        points.push({
          x: col * 140 + (row % 2) * 70 - 100,
          y: row * 120 - 100,
          delay: (row + col) * 0.2,
        });
      }
    }
    return points;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-indigo-400/5 to-purple-500/5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Elegant circular clock */}
      <div className="absolute right-20 top-20 w-64 h-64">
        <motion.div
          className="absolute inset-0 rounded-full border border-white/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-white/5"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-28 w-0.5 bg-gradient-to-b from-white/20 to-transparent origin-bottom"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Hexagon grid */}
      {hexPoints.map((point, index) => (
        <motion.div
          key={`hex-${index}`}
          className="absolute"
          style={{ left: point.x, top: point.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: point.delay, duration: 1 }}
        >
          <motion.div
            className="w-20 h-24 relative"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: point.delay,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                 style={{
                   clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                 }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Floating icons with glass effect */}
      {iconPositions.map((pos, index) => {
        const IconComponent = pos.icon;
        return (
          <motion.div
            key={`icon-${index}`}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.7,
              scale: pos.scale,
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: pos.delay,
            }}
          >
            <div className="relative">
              {/* Blur circle behind icon */}
              <div className="absolute inset-0 bg-white/5 rounded-full blur-md transform scale-150" />
              {/* Icon */}
              <IconComponent className="text-white/40 w-8 h-8 relative z-10" />
            </div>
          </motion.div>
        );
      })}

      {/* Floating time blocks */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={`block-${index}`}
          className="absolute w-40 h-24 rounded-lg"
          style={{
            left: `${15 + index * 20}%`,
            top: `${40 + (index % 3) * 15}%`,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 1 }}
        >
          <motion.div
            className="w-full h-full rounded-lg bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm border border-white/5"
            animate={{
              y: [-10, 10, -10],
              rotate: [-2, 2, -2],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: index,
            }}
          >
            <div className="h-full w-full p-4 flex flex-col justify-around">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ width: '0%' }}
                  animate={{ width: ['0%', '100%', '0%'] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5 + index,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Light beams */}
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={`beam-${index}`}
          className="absolute -inset-24 opacity-[0.02]"
          initial={{ rotate: index * 60 }}
          animate={{
            rotate: [index * 60, index * 60 + 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: index * 2,
          }}
        >
          <div className="w-full h-12 bg-gradient-to-r from-transparent via-white to-transparent" />
        </motion.div>
      ))}

      {/* Subtle particles */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundIcons;

