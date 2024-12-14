import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import TimetableControlPanel from "../BuildSchedule/TimetableControlPanel";

import CompactViewComponent from "./CompactViewComponent";
import DetailedViewComponent from "./DetailedViewComponent";

const SavedTimeTableViewer = ({ timeTableId }) => {
  const { headers, apiDomain, user } = useAuth();

  const [isTeacherView, setIsTeacherView] = useState(true);
  const [isCompactView, setIsCompactView] = useState(true);
  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [isTimetableLoading, setIsTimetableLoading] = useState(false);

  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});
  const [studentTimetableDaySchedules, setStudentTimetableDaySchedules] =
  useState([]);
  const [teacherTimetableDaySchedules, setTeacherTimetableDaySchedules] =
  useState([]);
  const [condensedTimetable, setCondensedTimetable] = useState(
    {}
  );

  const [searchTerm, setSearchTerm] = useState("");




  useEffect(() => {
    fetchTeacherTimetable();
    fetchStudentTimetable();
    fetchCondensedTimetable();

  }, []);
  const fetchTeacherTimetable = async () => {
    setIsTimetableLoading(true);
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-teacher-view-week/`,
        {
          headers,
        }
      );
      setTeacherWeekTimetable(response.data?.week_timetable);
      setTeacherTimetableDaySchedules(response.data?.day_schedules);
    } catch (error) {
      const errorMessage = error.response
        ? `Error fetching teacher timetable: ${error.response.status}. ${
            error.response.data?.message || error.message
          }`
        : `Network error. ${error.message}`;
      console.error(errorMessage);
      toast.error("Failed to load teacher timetable. Please try again.");
    } finally {
      setIsTimetableLoading(false);
    }
  };

  const fetchStudentTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-student-view-week/`,
        {
          headers,
        }
      );
      setStudentWeekTimetable(response.data.week_timetable);
      setStudentTimetableDaySchedules(response?.data?.day_schedules);
    } catch (error) {
      console.error(
        `Error fetching student timetable: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(`Failed to load student timetable. Please try again.`);
    }
  };
  const fetchCondensedTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-student-condensed-view-week/`,
        {
          headers,
        }
      );

      if (response.data && response.data.timetable) {
        setCondensedTimetable(response.data.timetable);
        toast.success(
          response.data.message || "Timetable retrieved successfully"
        );
      } else {
        toast.warning("No timetable data found");
      }
    } catch (error) {
      console.error("Timetable fetch error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to retrieve timetable. Please try again."
      );
    } finally {
    }
  };
  // Usage in a React component
 



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleTeacherOrStudentToggle = () => {
    setIsTeacherView(!isTeacherView);
  };
  const handleCompactOrDetailedToggle = () => {
    setIsCompactView(!isCompactView);
  };


  const handleDownloadStudentTimetable = async (isPdf = false) => {
    try {
      const file_type = isPdf ? "pdf" : "xlsx";
      const response = await axios.get(
        `${apiDomain}/api/time-table/download-whole-classroom-timetable/?file_type=${file_type}`,
        {
          headers,
          responseType: "blob",
          // params: { format },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `student_timetable.${file_type}`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Timetable downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download timetable. Please try again.");
    }
  };
  const handleDownloadTeacherTimetable = async (isPdf = false) => {
    try {
      const file_type = isPdf ? "pdf" : "xlsx";
      const response = await axios.get(
        `${apiDomain}/api/time-table/download-whole-teacher-timetable/?file_type=${file_type}`,
        {
          headers,
          responseType: "blob",
          // params: { format },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `student_timetable.${file_type}`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Timetable downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download timetable. Please try again.");
    }
  };
  return (
    <div className="mt-8">
      <TimetableControlPanel
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        isTeacherView={isTeacherView}
        handleViewToggle={handleCompactOrDetailedToggle}
        timeTableId={timeTableId}
        isCompactView={isCompactView}
        downloadWholeStucdentWeekTimetableExcel={()=>handleDownloadStudentTimetable(false)}
        downloadWholeStudentWeekTimetablePdf={()=>handleDownloadStudentTimetable(true)}
        downloadWholeTeacherWeekTimetableExcel={()=>handleDownloadTeacherTimetable(false)}
        downloadWholeTeacherWeekTimetablePdf={()=>handleDownloadTeacherTimetable(true)}
      />

      { isCompactView ? (
        <CompactViewComponent
        condensedTimetable={condensedTimetable}
          isTeacherView={isTeacherView}
          teacherViewToggle={handleTeacherOrStudentToggle}

        />
      ) : (
        <DetailedViewComponent
          isTeacherView={isTeacherView}
          searchTerm={searchTerm}
          teacherViewToggle={handleTeacherOrStudentToggle}
          studentTimetableDaySchedules={studentTimetableDaySchedules}
          studentWeekTimetable={studentWeekTimetable}
          teacherTimetableDaySchedules={teacherTimetableDaySchedules}
          teacherWeekTimetable={teacherWeekTimetable}
          isTimetableLoading={isTimetableLoading}


        />
      )}

    </div>
  );
};

export default SavedTimeTableViewer;
