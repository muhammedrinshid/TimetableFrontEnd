// data/menuData.js
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaSchool,
  FaSave,
  FaCog,
  FaRegListAlt,
  FaSlidersH
} from 'react-icons/fa';
import {
  MdOutlineDashboard,
  MdOutlineSupervisorAccount,
  MdOutlineClass,
  MdOutlineSaveAlt,
  MdSettings
} from 'react-icons/md';  // Importing new icons

const menuData = [
  {
    name: 'Dashboard',
    icon: <MdOutlineDashboard />,  // Alternative dashboard icon
    path: '',
  },
  {
    name: 'Teachers',
    icon: <MdOutlineSupervisorAccount />,  // More representative teacher icon
    path: '/teachers',
  },
  {
    name: 'Classes',
    icon: <MdOutlineClass />,  // Alternative class icon
    path: '/classes',
  },
  {
    name: 'Saved tables',
    icon: <MdOutlineSaveAlt />,  // Alternative save icon
    path: '/saved-timetables',
  },
  {
    name: 'Academics ',
    icon: <MdSettings />,  // Cleaner settings icon
    path: '/user-configurations',
  },
  {
    name: 'Directives',  // New menu item
    icon: <FaSlidersH />,  // Choose an appropriate icon
    path: '/directives-configuration',
  },
];

export default menuData;
