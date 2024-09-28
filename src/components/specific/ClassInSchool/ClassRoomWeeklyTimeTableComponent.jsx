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
import { FaFileDownload } from "react-icons/fa";

const ClassRoomWeeklyTimeTableComponent = ({
  weeklyTimetable,
  classroomData,
}) => {
  const { apiDomain, headers } = useAuth();

  const { NumberOfPeriodsInAday } = useAuth();

  const studentRow = [
    "Time",
    ...Array(NumberOfPeriodsInAday)
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
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/download-classroom-timetable/${classroomData.id}/`,
        {
          headers,

          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${classroomData?.grade_short_name}-${classroomData?.division}_timetable.xlsx`
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
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }));

  if (!weeklyTimetable || weeklyTimetable.length === 0) {
    return <ClassroomNotIncludedInTimetable />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Weekly Timetable
      </h2>

      <div className="overflow-x-auto shadow-xl rounded-lg">
        <div className="mb-2">
          <Tooltip title={"Download Time Table File"}>
            <button
              onClick={handleDownload}
              className="  p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label="Add new subject"
            >
              <FaFileDownload className="w-6 h-6 text-white" />
            </button>
          </Tooltip>
        </div>
        <table className=" w-full table-fixed">
          <thead className="">
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="w-1/6 p-4 text-left font-semibold">
                {studentRow[0]}
              </th>
              {studentRow?.slice(1)?.map((header, index) => (
                <th key={index} className="w-1/12 p-4 text-left font-semibold">
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
                <td className="border-b p-4">
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
                          label={`Timetable for the day`}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                </td>
                {day.sessions.map((session, sessionIndex) => (
                  <td key={sessionIndex} className="border-b p-2">
                    <div
                      className={`rounded-lg p-3 h-full ${getSessionColor(
                        session
                      )} transition-all duration-300 hover:shadow-md`}
                    >
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
                              {session?.type == "Elective" && (
                                <p className="text-gray-600">
                                  Students:{" "}
                                  {
                                    distribution.number_of_students_from_this_class
                                  }
                                </p>
                              )}
                              {
                                <p className="text-gray-600">
                                  Room: {distribution.room.name} (
                                  {distribution.room.number})
                                </p>
                              }
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoomWeeklyTimeTableComponent;
