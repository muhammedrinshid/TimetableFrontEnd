import React from "react";
import { FaUsers, FaCalendarCheck, FaTasks, FaChalkboardTeacher, FaBusinessTime } from "react-icons/fa";

const AnalyticsCards = () => {
  // Updated realistic data structure
  const data = {
    teachers: { total: 50, trend: { isPositive: true, value: 5 } },
    leaves: { total: 120, trend: { isPositive: false, value: 3, description: "Seasonal" } },
    extraWorkloads: { total: 30, trend: { isPositive: false, value: 8, description: "Event-driven" } },
    lessons: { total: 1200, trend: { isPositive: true, value: 2 } },
    workingDays: { total: 250, trend: { isPositive: true, value: 3 } }
  };

  const MetricsCard = ({ title, value, icon: Icon, trend, isLoading }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full transition-all hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`${isLoading ? "bg-gray-100 animate-pulse" : "bg-blue-50"} p-3 rounded-lg`}>
          <Icon size={24} className={isLoading ? "text-gray-400" : "text-blue-600"} />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-sm">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            {isLoading ? (
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-xl font-bold">{value}</p>
                {trend && (
                  <div className={`flex items-center text-sm ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                    {trend.isPositive ? (
                      <span className="mr-1">↑</span>
                    ) : (
                      <span className="mr-1">↓</span>
                    )}
                    {trend.value}% {trend.description && <span className="text-gray-500">({trend.description})</span>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-4 px-6 max-w-5xl mx-auto"> {/* Reduced width here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Total Teachers Card */}
        <MetricsCard
          title="Total Teachers"
          value={data.teachers.total}
          icon={FaChalkboardTeacher}
          trend={data.teachers.trend}
        />

        {/* Total Leaves Card */}
        <MetricsCard
          title="Total Leaves Taken"
          value={data.leaves.total}
          icon={FaCalendarCheck}
          trend={data.leaves.trend}
        />

        {/* Total Extra Workloads Card */}
        <MetricsCard
          title="Total Extra Workloads"
          value={data.extraWorkloads.total}
          icon={FaTasks}
          trend={data.extraWorkloads.trend}
        />

        {/* Total Lessons Conducted Card */}
        {/* <MetricsCard
          title="Total Lessons Conducted"
          value={data.lessons.total}
          icon={FaUsers}
          trend={data.lessons.trend}
        /> */}

        {/* Total Working Days Card */}
        {/* <MetricsCard
          title="Total Working Days"
          value={data.workingDays.total}
          icon={FaBusinessTime}
          trend={data.workingDays.trend}
        /> */}

      </div>
    </div>
  );
};

export default AnalyticsCards;
