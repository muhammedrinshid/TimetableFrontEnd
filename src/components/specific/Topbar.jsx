import React, { useState } from "react";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import { CiDark, CiLight } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useAuth } from "../../context/Authcontext";
import NotificationPanel from "./NotificationPanel";
import { Badge } from "lucide-react";
import { IconButton } from "@mui/material";
const mockNotifications = [
  {
    id: 1,
    type: "INFO",
    title: "Information Notice",
    description: "General updates on the system.",
    timestamp: new Date(),
    read: false,
    context: "General Info",
  },
  {
    id: 2,
    type: "ALERT",
    title: "Server Alert",
    description: "Server maintenance scheduled.",
    timestamp: new Date(),
    read: false,
    context: "System Alerts",
  },
  {
    id: 3,
    type: "REMINDER",
    title: "Reminder to Backup",
    description: "Regular data backup is due.",
    timestamp: new Date(),
    read: false,
    context: "Data Management",
  },
  {
    id: 4,
    type: "DAYTIMETABLE_CREATION_ERROR",
    title: "Timetable Creation Error",
    description: "Failed to create timetable for today.",
    timestamp: new Date(),
    read: false,
    context: "Academic Scheduling",
  },
  {
    id: 5,
    type: "CREATE_DAYTIMETABLE",
    title: "Create Day Timetable",
    description: "Prepare a timetable for the current day.",
    timestamp: new Date(),
    read: false,
    context: "Academic Scheduling",
  },
  {
    id: 6,
    type: "UPDATE_DAYTIMETABLE",
    title: "Update Day Timetable",
    description: "Modify the existing day timetable.",
    timestamp: new Date(),
    read: false,
    context: "System Maintenance",
  },
  {
    id: 7,
    type: "CHANGE_AND_CREATE",
    title: "Change and Create",
    description: "Apply changes and create new records.",
    timestamp: new Date(),
    read: false,
    context: "Resource Management",
  },
];
const Topbar = () => {
  const { darkMode, toggleTheme } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="relative">
      <div className="flex flex-row justify-between p-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          <BreadcrumbsComponent />
        </h2>
        <div className="flex flex-row justify-center gap-2 border-t border-white border-opacity-70 dark:border-gray-600">
          <div className="flex items-center rounded-full text-dark-primary text-opacity-80 hover:text-white hover:bg-light-primary duration-300 hover:opacity-50">
            <span
              onClick={toggleTheme}
              className="text-xl p-3 text-center cursor-pointer"
            >
              {darkMode ? (
                <CiLight className="text-gray-200" />
              ) : (
                <CiDark className="text-gray-800" />
              )}
            </span>
          </div>
          <div
            className="flex items-center rounded-full text-dark-primary text-opacity-80 hover:text-white hover:bg-light-primary duration-300 hover:opacity-50 relative"
            onClick={toggleNotification}
          >
            <IconButton>
        

              <Badge color="secondary"  badgeContent={mockNotifications.length||16} max={99}>
              <IoIosNotificationsOutline className="text-gray-800 dark:text-gray-200 text-xl" />
              </Badge>
            </IconButton>
          </div>
        </div>
      </div>

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        mockNotifications={mockNotifications}
      />
    </div>
  );
};

export default Topbar;
