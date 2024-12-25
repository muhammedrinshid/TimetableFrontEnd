import React from "react";
import {
  Users,
  Battery,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Avatar } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import { FaClock, FaCheckCircle, FaTasks } from "react-icons/fa";

// Metrics Card Component (unchanged)
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
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  {trend.value}%
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Teacher Avatar Component (unchanged)
const TeacherAvatar = ({ src, name }) => (
  <div className="flex flex-col items-center gap-2">
    <Avatar
      alt={name}
      src={src || "/api/placeholder/32/32"}
      className="w-8 h-8 shadow-sm"
    />
    <span className="text-xs font-medium text-gray-600">{name}</span>
  </div>
);

const StatusBars = ({ teachersWeekAnalytics }) => {
  const { apiDomain } = useAuth();

  // Skeleton and empty state rendering (unchanged)
  if (!teachersWeekAnalytics) {
    // ... (previous skeleton loading code)
  }

  if (!teachersWeekAnalytics.chart_details?.length) {
    // ... (previous empty state code)
  }

  // Prepare data for the chart with separated bars
  const chartData = teachersWeekAnalytics.chart_details?.map((teacher) => ({
    teacher: `${teacher.name}`,
    surName: `${teacher.surname}`,
    extraLoads: teacher.extra_loads_last_week,
    workingSessions: teacher.working_sessions_in_a_week,
    leaves: teacher.leaves_last_week,
    freeSessions: teacher.free_sessions_in_a_week,
    profileImage: teacher.profile_image
      ? `${apiDomain}${teacher.profile_image}`
      : null,
  }));

  const CustomTooltip = ({ indexValue, data }) => (
    <div className="relative bg-white p-4 shadow-lg rounded-lg border border-gray-200">
      <div className="absolute -top-4 -left-4">
        <TeacherAvatar
          name={indexValue}
          src={data?.profileImage}
          className="w-14 h-14 rounded-full border-2 border-white shadow-md"
        />
      </div>
      <div className="pt-6 pl-2">
        <div className="mb-2">
          <span className="font-semibold text-lg text-gray-800">
            {indexValue} {data?.surName}
          </span>
        </div>
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-500 rounded-full">
                <FaClock />
              </div>
              <span className="text-gray-600">Working Sessions:</span>
            </div>
            <span className="font-medium">{data.workingSessions}</span>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-500 rounded-full">
                <FaCheckCircle />
              </div>
              <span className="text-gray-600">Free Sessions:</span>
            </div>
            <span className="font-medium">{Math.abs(data.freeSessions)}</span>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-500 rounded-full">
                <FaTasks />
              </div>
              <span className="text-gray-600">Extra Loads:</span>
            </div>
            <span className="font-medium">{data.extraLoads}</span>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-red-100 text-red-500 rounded-full">
                <FaTasks />
              </div>
              <span className="text-gray-600">Leaves:</span>
            </div>
            <span className="font-medium">{data.leaves}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Metrics cards (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Teachers"
          value={teachersWeekAnalytics.chart_header_details?.total_teachers}
          icon={Users}
          trend={{ isPositive: true, value: 12 }}
        />
        <MetricsCard
          title="Utilization Capacity"
          value={teachersWeekAnalytics.chart_header_details?.teachers_utilization_capacity}
          icon={Battery}
          trend={{ isPositive: true, value: 8 }}
        />
        <MetricsCard
          title="Total Work Sessions"
          value={teachersWeekAnalytics.chart_header_details?.total_classroom_work_sessions}
          icon={Calendar}
          trend={{ isPositive: false, value: 3 }}
        />
      </div>

      <div className="overflow-auto h-full flex flex-col justify-center items-center">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Teachers Weekly Overview</h2>
        </div>
        <div className="p-2 py-10">
          <div className="w-full h-full overflyau overflow-scroll">
            <div style={{ height: "500px", minWidth: "800px" }}>
              {/* <ResponsiveBar
                data={chartData}
                keys={[
                  "extraLoads",
                  "workingSessions", 
                  "leaves", 
                  "freeSessions"
                ]}
                groupMode="grouped"
                indexBy="teacher"
                margin={{ top: 60, right: 40, bottom: 100, left: 40 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                colors={["#fbbf24", "#2563eb", "#fca5a5", "#93c5fd"]}
                borderRadius={5}
                borderWidth={2}
                borderColor="white"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 70,
                  tickRotation: 0,
                  renderTick: ({ x, y, value }) => {
                    const teacher = chartData.find((d) => d.teacher === value);
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <circle
                          cx={0}
                          cy={28}
                          r={18}
                          fill="white"
                          stroke="#ccc"
                          strokeWidth="2"
                          style={{
                            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                          }}
                        />
                        <clipPath id={`clipCircle-${value}`}>
                          <circle cx={0} cy={28} r={16} />
                        </clipPath>
                        <image
                          x={-16}
                          y={12}
                          width={32}
                          height={32}
                          href={teacher?.profileImage || "/api/placeholder/32/32"}
                          clipPath={`url(#clipCircle-${value})`}
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <text
                          x={0}
                          y={65}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{
                            fill: "#444",
                            fontSize: "14px",
                            fontWeight: "bold",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {value}
                        </text>
                      </g>
                    );
                  },
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Sessions",
                  legendPosition: "middle",
                  legendOffset: -32,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateY: 100,
                    itemsSpacing: 20,
                    itemWidth: 110,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 12,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemOpacity: 1,
                          transform: "scale(1.1)",
                        },
                      },
                    ],
                  },
                ]}
                tooltip={CustomTooltip}
                theme={{
                  tooltip: {
                    container: {
                      background: "transparent",
                      padding: 0,
                      borderRadius: 0,
                      boxShadow: "none",
                    },
                  },
                }}
                role="application"
                ariaLabel="Teacher sessions chart"
                motionConfig="wobbly"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBars;