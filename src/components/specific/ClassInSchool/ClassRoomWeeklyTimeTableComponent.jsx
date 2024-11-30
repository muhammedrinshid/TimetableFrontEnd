import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../../../context/Authcontext";
import ClassroomNotIncludedInTimetable from "../../empty state management components/ClassroomNotIncludedInTimetable";
import { DownloadIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { AiOutlineFileExcel } from "react-icons/ai";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFileDownload, FaFilePdf } from "react-icons/fa";

const ClassRoomWeeklyTimeTableComponent = ({
  weeklyTimetable,
  classroomData,
  timetableDaySchedules,
}) => {
  const { apiDomain, headers } = useAuth();

  const maxTeachingSlots = Math.max(
    0, // Fallback value for empty arrays
    ...timetableDaySchedules.map((schedule) => schedule.teaching_slots)
  );

  const studentRow = [
    "Time",
    ...Array(maxTeachingSlots)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];
  const getSessionColor = (session) => {
    switch (session.type) {
      case "Core":
        return "bg-blue-100 text-blue-800";
      case "Elective":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const InfoChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    fontWeight: "bold",
  }));

  const getAvatarColor = (dayName) => {
    const hue = (dayName.charCodeAt(0) * 20) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };
  const handleDownload = async (isPdf = false) => {
    try {
      const file_type = isPdf ? "pdf" : "xlsx";
      const response = await axios.get(
        `${apiDomain}/api/time-table/download-classroom-timetable/${classroomData.id}/?file_type=${file_type}`,
        {
          headers,
          responseType: "blob",
          // params: { format },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${classroomData?.standard_short_name}-${classroomData?.division}_timetable.${file_type}` // Remove the trailing slash
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Timetable downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download timetable. Please try again.");
    }
  };

  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 70,
    height: 70,
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginRight: theme.spacing(2),
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  }));

  if (!weeklyTimetable || weeklyTimetable.length === 0) {
    return <ClassroomNotIncludedInTimetable />;
  }

  return (
    <div className="w-full">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Weekly Timetable
    </h2>

    {/* Download buttons container */}
    <div className="mb-2 flex flex-row gap-3 p-2 justify-center">
      <Tooltip title="Download Time Table excel file">
        <button
          onClick={() => handleDownload(false)}
          className="p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Download Excel"
        >
          <FaFileDownload className="w-4 h-4 text-white" />
        </button>
      </Tooltip>
      <Tooltip title="Download Time Table pdf file">
        <button
          onClick={() => handleDownload(true)}
          className="p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Download PDF"
        >
          <FaFilePdf className="w-4 h-4 text-white" />
        </button>
      </Tooltip>
    </div>

    {/* Table container with both scrolls */}
    <div className="shadow-xl rounded-lg">
      <div className="max-h-[calc(100vh-5rem)] 3xl:max-h-[calc(60rem-5rem)] overflow-auto rounded-lg">
        <table className="w-full min-w-[1200px] bg-white rounded-t-lg">
          <thead className="sticky top-0 z-20">
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="min-w-[200px] p-4 text-left font-semibold">
                {studentRow[0]}
              </th>
              {studentRow.slice(1).map((header, index) => (
                <th
                  key={index}
                  className="min-w-[150px] p-4 text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklyTimetable.map((day, dayIndex) => (
              <tr
                key={dayIndex}
                className="bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="border-b p-4 border-l min-w-[200px]">
                  <Box
                    display="flex"
                    alignItems="center"
                    bgcolor="#ecf3fa"
                    p={2}
                    borderRadius={2}
                  >
                    <StyledAvatar
                      sx={{
                        bgcolor: getAvatarColor(day.day),
                      }}
                    >
                      {day.day.charAt(0)}
                    </StyledAvatar>
                    <Box>
                      <Typography
                        variant="h5"
                        component="div"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {day.day}
                      </Typography>
                      <Box mb={1}>
                        <InfoChip
                          label="Timetable for the day"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                </td>
                {studentRow.slice(1).map((_, sessionIndex) => {
                  const session = day.sessions[sessionIndex];
                  return session ? (
                    <td
                      key={sessionIndex}
                      className="border-b p-2 border-l min-w-[150px]"
                    >
                      <div
                        className={`rounded-lg p-3 h-full ${getSessionColor(
                          session
                        )} transition-all duration-300 hover:shadow-md`}
                      >
                        {/* Session content remains the same */}
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-sm truncate flex-grow">
                            {session.name}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              session?.room_type === "Elective"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {session?.type}
                          </span>
                        </div>
                        {session.class_distribution.map(
                          (distribution, distributionIndex) => (
                            <div
                              key={distributionIndex}
                              className="mt-2 bg-white bg-opacity-50 rounded-md p-2"
                            >
                              <div className="flex items-center mb-1">
                                <Avatar
                                  alt={distribution.teacher.name}
                                  src={
                                    distribution.teacher.profile_image
                                      ? `${apiDomain}/${distribution.teacher.profile_image}`
                                      : undefined
                                  }
                                  className="w-8 h-8 rounded-full mr-2 border-2 border-white"
                                >
                                  {!distribution.teacher.profile_image &&
                                    distribution.teacher.name.charAt(0)}
                                </Avatar>
                                <div>
                                  <p className="text-xs font-medium">
                                    {distribution.teacher.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {distribution.subject}
                                  </p>
                                </div>
                              </div>
                              <div className="text-xs">
                                {session?.type === "Elective" && (
                                  <p className="text-gray-600">
                                    Students:{" "}
                                    {
                                      distribution.number_of_students_from_this_class
                                    }
                                  </p>
                                )}
                                <p className="text-gray-600">
                                  Room: {distribution.room.name} (
                                  {distribution?.room?.room_number})
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  ) : (
                    <td
                      key={sessionIndex}
                      className="border-b p-2 border-l min-w-[150px]"
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default ClassRoomWeeklyTimeTableComponent;
