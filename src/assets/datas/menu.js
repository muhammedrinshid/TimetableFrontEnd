// data/menuData.js
import { FaTachometerAlt, FaChalkboardTeacher, FaSchool, FaSave, FaCog } from 'react-icons/fa';

const menuData = [
  {
    name: 'Dashboard',
    icon: <FaTachometerAlt />,
    path: '',
  },
  {
    name: 'Teachers',
    icon: <FaChalkboardTeacher />,
    path: '/teachers',
  },
  {
    name: 'Classes',
    icon: <FaSchool />,
    path: '/classes',
  },
  {
    name: 'Saved tables',
    icon: <FaSave />,
    path: '/saved-timetables',
  },
  {
    name: 'Period Settings',
    icon: <FaCog />,
    path: '/period-settings',
  },
];

export default menuData;
