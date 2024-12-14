import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, IconButton } from '@mui/material';
import { 
  MdOutlineCreateNewFolder, 
  MdSystemUpdateAlt,
  MdChangeCircle,
  MdNotificationsActive,
  MdClear,
  MdError,
  MdWarning,
  MdInfo,
  MdCheckCircle,
  MdAdd,
  MdEdit,
  MdSync,
  MdDelete,
  MdMarkEmailRead
} from 'react-icons/md';

// Updated Notification Type Definitions with More Nuanced Colors
const NOTIFICATION_TYPES = {
  INFO: {
    icon: MdInfo,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    hoverBg: 'hover:bg-sky-100',
    severityLevel: 1
  },
  ALERT: {
    icon: MdWarning,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    hoverBg: 'hover:bg-yellow-100',
    severityLevel: 2
  },
  REMINDER: {
    icon: MdCheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverBg: 'hover:bg-green-100',
    severityLevel: 3
  },
  DAYTIMETABLE_CREATION_ERROR: {
    icon: MdError,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverBg: 'hover:bg-red-100',
    severityLevel: 4
  },
  CREATE_DAYTIMETABLE: {
    icon: MdOutlineCreateNewFolder,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    severityLevel: 1
  },
  UPDATE_DAYTIMETABLE: {
    icon: MdSystemUpdateAlt,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100',
    severityLevel: 2
  },
  CHANGE_AND_CREATE: {
    icon: MdChangeCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-100',
    severityLevel: 3
  }
};

// Enhanced Mock Notifications with More Context


const NotificationActionButton = ({ icon: Icon, tooltip, onClick }) => {
  return (
    <Tooltip title={tooltip} arrow>
      <IconButton onClick={onClick} size="small">
        <Icon className="text-gray-600 hover:text-blue-500" />
      </IconButton>
    </Tooltip>
  );
};

const NotificationPanel = ({ isOpen, onClose,mockNotifications }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  }, []);

  const processedNotifications = useMemo(() => {
    return notifications.map(notification => {
      const typeInfo = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.INFO;
      return {
        ...notification,
        typeInfo
      };
    });
  }, [notifications]);

  const renderNotificationContent = (notification) => {
    const { icon: Icon, color, bgColor } = notification.typeInfo;

    return (
      <div className={`
        flex items-center space-x-4 w-full p-4 
        ${notification.read ? 'opacity-50' : 'bg-white dark:bg-gray-800'}
        border-b border-gray-100 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
      `}>
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex-grow">
          <h4 className={`
            font-semibold 
            ${notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}
          `}>
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.description}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {notification.context}
          </div>
        </div>
        <div className="flex space-x-2">
          {notification.type === 'CREATE_DAYTIMETABLE' && (
            <NotificationActionButton
              icon={MdOutlineCreateNewFolder}
              tooltip="Create Timetable"
              onClick={() => console.log('Create Day Timetable Action')}
            />
          )}
          {notification.type === 'UPDATE_DAYTIMETABLE' && (
            <NotificationActionButton
              icon={MdSystemUpdateAlt}
              tooltip="Update Timetable"
              onClick={() => console.log('Update Day Timetable Action')}
            />
          )}
          {notification.type === 'CHANGE_AND_CREATE' && (
            <>
              <NotificationActionButton
                icon={MdChangeCircle}
                tooltip="Change Record"
                onClick={() => console.log('Change Record Action')}
              />
              <NotificationActionButton
                icon={MdAdd}
                tooltip="Add Record"
                onClick={() => console.log('Add Record Action')}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-16 right-4 w-[600px] shadow-2xl rounded-xl border z-50 overflow-hidden 
            dark:bg-gray-900 dark:text-white bg-white text-gray-900 border-gray-200 dark:border-gray-700`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <MdNotificationsActive className="w-7 h-7 text-blue-600" />
              <h2 className="text-xl font-bold">
                Notifications 
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                  ({processedNotifications.length})
                </span>
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={markAllAsRead}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <MdMarkEmailRead className="w-6 h-6" />
              </button>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <MdClear className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {processedNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
              >
                {renderNotificationContent(notification)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
