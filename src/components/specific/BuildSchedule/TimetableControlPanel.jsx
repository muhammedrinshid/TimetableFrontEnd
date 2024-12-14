import React from "react";
import { Search, LayoutGrid } from "lucide-react";
import { TbEditCircle } from "react-icons/tb";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

const TimetableControlPanel = ({
  searchTerm,
  handleSearch,
  isTeacherView,
  handleViewToggle,
  timeTableId,
  isCompactView,
  downloadWholeTeacherWeekTimetablePdf,
  downloadWholeTeacherWeekTimetableExcel,
  downloadWholeStudentWeekTimetablePdf,
  downloadWholeStucdentWeekTimetableExcel,
}) => {
  const editButtonText = isTeacherView
    ? "Edit Teacher Schedule"
    : "Edit Students Schedule";
  const editLinkPath = isTeacherView
    ? `/edit-timetable/teacher/${timeTableId}`
    : `/edit-timetable/student/${timeTableId}`;

  const handleDownloadTimetablePdf = () => {
    console.log("djl")
    if (isTeacherView) {
      downloadWholeTeacherWeekTimetablePdf();
    } else {
      downloadWholeStudentWeekTimetablePdf();
    }
  };
  const handleDownloadTimetableExcel = () => {
    if (isTeacherView) {
      downloadWholeTeacherWeekTimetableExcel();
    } else {
      downloadWholeStucdentWeekTimetableExcel();
    }
  };
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Download Buttons */}
        <div className="flex items-center space-x-4">
          <Tooltip
            title={
              isTeacherView
                ? "Download Teacher Timetable (PDF)"
                : "Download Student Timetable (PDF)"
            }
            
          >
            <button
              onClick={handleDownloadTimetablePdf}
              className="btn btn-icon bg-gradient-to-r from-[#312ECB] cursor-pointer to-[#4A91F2] text-white hover:from-[#4A91F2] hover:to-[#312ECB] focus:ring-2 focus:ring-[#4A91F2] focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            >
              <FaFilePdf className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Download PDF</span>
            </button>
          </Tooltip>
          <Tooltip
            title={
              isTeacherView
                ? "Download Teacher Timetable (Excel)"
                : "Download Student Timetable (Excel)"
            }
            
          >
            <button
              onClick={handleDownloadTimetableExcel}

              className="btn btn-icon bg-gradient-to-r cursor-pointer from-[#28A745] to-[#5BD897] text-white hover:from-[#5BD897] hover:to-[#28A745] focus:ring-2 focus:ring-[#5BD897] focus:outline-none rounded-lg px-3 py-2 transition-all duration-300"
            >
              <FaFileExcel className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Download Excel</span>
            </button>
          </Tooltip>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-auto flex-grow flex items-center space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#312ECB] focus:border-[#312ECB] transition-all duration-300 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>

          {timeTableId !== null ? (
            <Link
              to={editLinkPath}
              className="btn btn-gradient-primary btn-icon btn-icon-left"
            >
              <TbEditCircle className="w-4 h-4" />
              <span>{editButtonText}</span>
            </Link>
          ) : (
            <button
              disabled
              className="btn btn-disabled btn-icon btn-icon-left"
            >
              <TbEditCircle className="w-4 h-4" />
              <span>{editButtonText}</span>
            </button>
          )}
        </div>

        {/* View Toggle Button */}
        <button
          onClick={handleViewToggle}
          className="btn btn-gradient-primary btn-icon btn-icon-left"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{!isCompactView ? "Compact View" : "Detailed View"}</span>
        </button>
      </div>
    </div>
  );
};

export default TimetableControlPanel;
