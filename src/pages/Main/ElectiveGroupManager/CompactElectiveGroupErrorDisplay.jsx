import React from "react";
import { AlertTriangle, Users, Clock } from "lucide-react";
import { useAuth } from "../../../context/Authcontext";

const errorTypeConfig = {
  "Concurrent Classrooms": {
    icon: Users,
    symbol: "🔄",
    color: "text-orange-500",
    getMessage: (error) => `${error.classroom_name} has multiple subjects`
  },
  "Inconsistent Lessons": {
    icon: Clock,
    symbol: "⚠️",
    color: "text-purple-500",
    getMessage: () => "Inconsistent lesson count"
  },
  "Invalid Group Configuration": {
    icon: AlertTriangle,
    symbol: "⚙️",
    color: "text-red-500",
    getMessage: () => "Invalid configuration"
  },
  "Missing Options": {
    icon: AlertTriangle,
    symbol: "📝",
    color: "text-amber-500",
    getMessage: () => "Missing options"
  },
  "Classroom Capacity": {
    icon: Users,
    symbol: "👥",
    color: "text-blue-500",
    getMessage: () => "Capacity exceeded"
  }
};

const CompactElectiveGroupErrorDisplay = ({ groupErrors }) => {
  const { isDarkMode } = useAuth();

  if (!groupErrors?.length) return null;

  const getErrorDetails = (error) => {
    const config = errorTypeConfig[error.type] || {
      icon: AlertTriangle,
      color: "text-red-500",
      getMessage: () => error.details || "Unknown error"
    };

    const IconComponent = config.icon;
    
    return {
      icon: <IconComponent className={`w-4 h-4 ${config.color}`} />,
      message: config.getMessage(error),
      bgColor: isDarkMode ? `bg-${config.color.split('-')[1]}-900/10` : `bg-${config.color.split('-')[1]}-50`
    };
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm" role="alert">
      {groupErrors.map((error, index) => {
        const { icon, message, color } = getErrorDetails(error);
        
        return (
          <div 
            key={`${error.type}-${index}`} 
            className="flex items-center gap-1 text-vs"
          >
            {icon}
            <span className={color}>{message}</span>
            {index < groupErrors.length - 1 && (
              <span className="text-gray-300" aria-hidden="true">•</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CompactElectiveGroupErrorDisplay;