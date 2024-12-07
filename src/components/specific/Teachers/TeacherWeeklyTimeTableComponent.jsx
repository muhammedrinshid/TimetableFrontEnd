import { useAuth } from "../../../context/Authcontext";
import { Avatar, Box, Typography, Chip, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import TeacherNotIncludedInTimetable from "../../empty state management components/TeacherNotIncludedInTimetable";
import { FaFileDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { X } from "lucide-react";

const TeacherWeeklyTimeTableComponent = ({
  teacherWeeklyTimetable,
  TeacherDetails,
  timetableDaySchedules,
}) => {
  const { apiDomain, headers } = useAuth();
  console.log(teacherWeeklyTimetable);
  const { NumberOfPeriodsInAday } = useAuth();
  const maxTeachingSlots = Math.max(
    0, // Fallback value for empty arrays
    ...timetableDaySchedules.map((schedule) => schedule.teaching_slots)
  );
  const teacherRow1 = [
    "Instructor",
    ...Array(maxTeachingSlots)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];

  const getSessionColor = (session) => {
    if (!session.subject) return "bg-green-100 text-green-800"; // Free period
    switch (session.type) {
      case "Core":
        return "bg-blue-100 text-blue-800";
      case "Elective":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSessionBorderColor = (session) => {
    switch (session.type) {
      case "Core":
        return "#1976d2"; // MUI primary color
      case "Elective":
        return "#9c27b0"; // MUI secondary color
      default:
        return "#f0f0f0"; // Light gray for free periods
    }
  };

  const InfoChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    fontWeight: "bold",
  }));
  const handleDownloadTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/download-teacher-timetable/${TeacherDetails?.id}/`,
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
        `${TeacherDetails?.name}-${TeacherDetails?.surname}_timetable.xlsx`
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

  const getAvatarColor = (dayName) => {
    const hue = (dayName.charCodeAt(0) * 20) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 70,
    height: 70,
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginRight: theme.spacing(2),
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  }));

  if (!teacherWeeklyTimetable || teacherWeeklyTimetable.length === 0) {
    return <TeacherNotIncludedInTimetable />;
  }

  return (
    <div className="">
      <div className="container mx-auto  ">
        {/* <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-pulse">
        Teacher Timetable
      </h2> */}
        <div
          className=" shadow-xl rounded-lg"
          style={{ minWidth: `${150 + NumberOfPeriodsInAday * 180}px` }}
        >
          <div className="mb-2">
            <Tooltip title={"Download Time Table File"}>
              <button
                onClick={handleDownloadTimetable}
                className="  p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Add new subject"
              >
                <FaFileDownload className="w-6 h-6 text-white" />
              </button>
            </Tooltip>
          </div>
          <table className="min-w-full table-fixed  rounded-t-lg overflow-clip">
            <thead className="sticky top-0 left-0 z-20 backdrop-blur-[6.4px]">
              <tr className="bg-gradient-to-r from-light-primary to-light-secondary text-white ">
                <th className=" w-[150px] p-4 text-left font-semibold border border-r">
                  {teacherRow1[0]}
                </th>
                {teacherRow1.slice(1).map((header, index) => (
                  <th key={index} className=" p-4 text-left font-semibold border-l">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teacherWeeklyTimetable?.map((day, dayIndex) => (
                <tr
                  key={dayIndex}
                  className="bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="border-b border-l p-4 w-[120px]">
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
                      </Box>
                    </Box>
                  </td>
                  {teacherRow1.slice(1).map((_, sessionIndex) => {
                    const session = day.sessions[sessionIndex]; // Access session by index

                    return session ? (
                      <td key={sessionIndex} className="border-b border-l p-2 w-[120px]">
                        <div
                          className={`rounded-lg p-4 h-full ${getSessionColor(
                            session
                          )} transition-all duration-300 hover:shadow-lg hover:scale-102 relative overflow-hidden`}
                          style={{
                            borderTop: `4px solid ${getSessionBorderColor(
                              session
                            )}`,
                          }}
                        >
                          {session.subject ? (
                            <div className="session-card flex flex-col h-full">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-sm text-gray-800 leading-tight">
                                  {session.subject ||
                                    session.elective_subject_name}
                                </h3>
                                <div
                                  className={`${
                                    session.type === "Core"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-pink-100 text-pink-700"
                                  } text-vs font-semibold uppercase  rounded-full tracking-wider`}
                                >
                                  {session.type.charAt(0)}
                                </div>
                              </div>

                              <p className="room text-xs mb-3 flex justify-between items-center text-gray-600">
                                <span className="font-medium">
                                  Room {session?.room?.room_number}
                                </span>
                              </p>
                              <div className="class-details text-sm flex-grow">
                                {session.class_details.map(
                                  (classDetail, index) => (
                                    <div
                                      key={index}
                                      className="class-info flex justify-between items-center mb-2 bg-white bg-opacity-50 rounded-md p-2"
                                    >
                                      <span className="class-name font-semibold text-gray-700 text-sm text-nowrap">
                                        {classDetail.standard}{" "}
                                        {classDetail.division}
                                      </span>
                                      {session.type === "Elective" && (
                                        <span className="student-count text-gray-500 text-vs text-nowrap justify-self-end">
                                          {classDetail.number_of_students} cadet
                                        </span>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="free-period text-center py-8">
                              <p className="font-semibold text-xl text-gray-600">
                                Free Period
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                Time to recharge!
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    ) : (
                      <td
                      key={sessionIndex}
                      className="p-3 border-l border-b"
                    >
                       <div
                          className={`rounded-lg p-4 h-full ${getSessionColor(
                            ""
                          )} transition-all duration-300 hover:shadow-lg hover:scale-102 relative overflow-hidden flex justify-center items-center w-full h-full`}
                          style={{
                            borderTop: `4px solid ${getSessionBorderColor(
                              ""
                            )}`,
                          }}
                        >
                                                <X className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors duration-200" />

                        </div>
                    </td>                    );
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

export default TeacherWeeklyTimeTableComponent;
