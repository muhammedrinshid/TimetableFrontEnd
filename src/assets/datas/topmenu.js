// data/menuData.js
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiDark } from "react-icons/ci";


const topMenu = [
  {
    name: "Darkmode",
    icon: <CiDark />
    ,

    path: "/teachers",
  },{
    name: "Messages",
    icon: <IoIosNotificationsOutline />,
    path: "/dashboard",
  },
  
];

export default topMenu;
