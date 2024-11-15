// data/menuData.js
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaSchool,
  FaSave,
  FaCog,
  FaRegListAlt,
  FaSlidersH,
  FaMagic,
} from "react-icons/fa";
import {
  MdOutlineDashboard,
  MdOutlineSupervisorAccount,
  MdOutlineClass,
  MdOutlineSaveAlt,
  MdSettings,
  MdOutlineBuild,
  MdSchedule,
  MdAutorenew, // Importing new icon for Build Schedule
} from "react-icons/md"; // Importing new icons

const menuData = [
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard />, // Cleaner settings icon
    path: "",
  },
  {
    name: "Academics",
    icon: <MdSettings />, // Cleaner settings icon
    path: "/user-configurations",
  },
  {
    name: "Teachers",
    icon: <MdOutlineSupervisorAccount />, // More representative teacher icon
    path: "/teachers",
  },
  {
    name: "Classes",
    icon: <MdOutlineClass />, // Alternative class icon
    path: "/classes",
  },
  {
    name: "Day Planner",
    icon: <MdOutlineDashboard />, // Alternative dashboard icon
    path: "/day-planner",
  },
  {
    name: "Saved tables",
    icon: <MdOutlineSaveAlt />, // Alternative save icon
    path: "/saved-timetables",
  },

  {
    name: "Directives", // New menu item
    icon: <FaSlidersH />, // Choose an appropriate icon
    path: "/directives-configuration",
  },
  {
    name: "Ai Scheduler", // New Build Schedule item
    icon: <FaMagic />, // Icon for building/creating
    path: "/build-schedule", // Route for Build Schedule page
  },

];

export default menuData;
