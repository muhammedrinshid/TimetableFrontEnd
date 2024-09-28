import React from "react";
import { motion } from "framer-motion";
import {
  RiCalendarLine,
  RiTimeLine,
  RiPencilLine,
  RiBookLine,
  RiAlarmLine,
  RiBookOpenLine,
  RiDraftLine,
  RiFileListLine,
  RiNumbersLine,
} from "react-icons/ri";
import { LuBrain, LuSchool } from "react-icons/lu";
import { CiViewTimeline } from "react-icons/ci";
import { SiStagetimer } from "react-icons/si";
import { IoMdSpeedometer } from "react-icons/io";
import { FaInfinity } from "react-icons/fa6";
import {
  MdSchedule,
  MdOutlineEventNote,
  MdOutlineClass,
  MdSchool,
  MdOutlineAssignment,
  MdOutlineHistoryEdu,
  MdOutlineSchool,
} from "react-icons/md";
import {
  FaChalkboardTeacher,
  FaBell,
  FaGraduationCap,
  FaInfoCircle,
} from "react-icons/fa";

// Icons array
const icons = [
  RiCalendarLine,
  RiTimeLine,
  RiPencilLine,
  RiBookLine,
  RiAlarmLine,
  RiBookOpenLine,
  RiDraftLine,
  RiFileListLine,
  RiNumbersLine,
  MdSchedule,
  MdOutlineEventNote,
  MdOutlineClass,
  MdSchool,
  MdOutlineAssignment,
  MdOutlineHistoryEdu,
  MdOutlineSchool,
  FaChalkboardTeacher,
  FaBell,
  FaGraduationCap,
  LuSchool,
  CiViewTimeline,
  SiStagetimer,
  IoMdSpeedometer,
  LuBrain,
  FaInfinity,
  FaInfoCircle,
];

const shades = ["text-white", "text-slate-200", "text-slate-100"]; // Different opacity levels

const BackgroundIcons = () => {
  const positions = React.useMemo(
    () =>
      Array.from({ length: 7 }).flatMap(() =>
        icons.map(() => ({
          top: Math.random() * 100,
          left: Math.random() * 100,
        }))
      ),
    []
  );

  return (
    <>
      {positions.map((pos, index) => {
        const IconComponent = icons[index % icons.length]; // Use modulus to avoid index out of bounds
        return (
          <motion.div
            key={index}
            className={`absolute text-opacity-20 ${
              shades[Math.floor(Math.random() * shades.length)]
            }`} // Add random shade class
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
            animate={{
              y: [0, -10, 0], // Float effect
              rotate: [0, 5, -5, 0], // Rotate effect
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          >
            <IconComponent /> {/* Render the icon */}
          </motion.div>
        );
      })}
    </>
  );
};

export default BackgroundIcons;
