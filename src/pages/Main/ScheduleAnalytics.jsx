import React, { useEffect, useState } from "react";
import EmailStatus from "./ScheduleAnalytics/EmailStatus";
import TeacherStatusList from "./ScheduleAnalytics/TeacherStatusList";
import StatusBars from "./ScheduleAnalytics/StatusBars";
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";

const ScheduleAnalytics = () => {
  const { apiDomain, headers } = useAuth();

  const [view, setView] = useState("Teacher Centric View");
  const [teachersWeekAnalytics, setTeachersWeekAnalytics] = React.useState({
    chart_header_details: {
      total_teachers: 0,
      teachers_utilization_capacity: 0,
      total_classroom_work_sessions: 0,
    },
    chart_details: [],
  });
  const fetchWeeklyTeacherStats = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/analytics/teacher-utilization/`,
        { headers }
      );
      setTeachersWeekAnalytics(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teacher analytics",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWeeklyTeacherStats();
  }, []);
  return (
    <div className="p-4 pt-0 grid  grid-cols-[7fr_3fr] gap-2 h-full">
      {/* First Row: Status Bars */}
      <div className="col-start-1 col-end-2 max-h-full     max-w-full  overflow-y-auto">
        <StatusBars teachersWeekAnalytics={teachersWeekAnalytics}/>
     
      </div>

      {/* Second Row */}

      <div className="col-start-2 col-end-3     max-h-full overflow-y-auto">
        <TeacherStatusList teachersWeekAnalytics={teachersWeekAnalytics?.chart_details}/>
      </div>

    </div>
  );
};

export default ScheduleAnalytics;
