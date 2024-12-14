import React, { useEffect, useState } from "react";
import TeachersActivityStatsControlePanel from "./TeachersActivityStatsControlePanel";
import AnalyticsCards from "./AnalyticsCards";
import TeachersActivityGrid from "./TeachersActivityGrid";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/Authcontext";

const TeachersActivityStats = ({ setSelectedTeacher }) => {
  const { apiDomain, headers, academicYearEnd, academicYearStart } = useAuth();
  const [selectedDate, setSelectedDate] = useState({
    startDate: academicYearStart || null,
    endDate: academicYearEnd || null,
  });
  const [teachersLeaveAndOverloads, setTeachersLeaveAndOverloads] = useState(
    []
  );

  const fetchTeachersLeaveAndOverloads = async () => {
    try {
      // Ensure start_date and end_date are provided
      const start_date_str = selectedDate?.startDate;
      const end_date_str = selectedDate?.endDate;

      if (!start_date_str || !end_date_str) {
        toast.info("Start date and end date are required.");
      }

      // Fetch the data from the API
      const response = await axios.get(
        `${apiDomain}/api/activity/teacher-activity-summary/`,
        {
          headers,
          params: {
            start_date: start_date_str,
            end_date: end_date_str,
          },
        }
      );

      // Update state with the fetched data
      setTeachersLeaveAndOverloads(
        response.data?.teacher_activity_summary || []
      );
    } catch (error) {
      console.error("Error fetching Teachers Leave and Overloads data:", error);
      toast.error("Failed to fetch Teachers Leave and Overloads data");
    }
  };
  useEffect(() => {
    fetchTeachersLeaveAndOverloads();
  }, []);
  return (
    <div className="  grid grid-rows-[auto_auto_1fr] h-full">
      <AnalyticsCards />
      <div className=" overflow-auto w-full h-full max-h-full">
        <TeachersActivityGrid
          teachersLeaveAndOverloads={teachersLeaveAndOverloads}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleRefresh={() => fetchTeachersLeaveAndOverloads()}
          setSelectedTeacher={setSelectedTeacher}
        />
      </div>
    </div>
  );
};

export default TeachersActivityStats;
