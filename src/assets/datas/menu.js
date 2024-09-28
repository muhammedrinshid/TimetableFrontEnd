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
    icon: <MdOutlineDashboard />, // Alternative dashboard icon
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
    name: "Build Schedule", // New Build Schedule item
    icon: <FaMagic />, // Icon for building/creating
    path: "/build-schedule", // Route for Build Schedule page
  },
];

export default menuData;
