// data/menuData.js
import {  IoSettingsOutline  } from 'react-icons/io5';
import { RiUserSettingsLine } from "react-icons/ri";

import { AiOutlineLogout } from "react-icons/ai";

const bottomMenu = [
  {
    name: 'Setting',
    icon: <IoSettingsOutline />,
    path: '/dashboard',
  },
  {
    name: 'Lougout',
    icon:<AiOutlineLogout />
    ,
    path: '/teachers',
  },
  
  
];

export default bottomMenu;
