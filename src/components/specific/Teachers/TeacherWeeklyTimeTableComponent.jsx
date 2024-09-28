
import { useAuth } from "../../../context/Authcontext";
import { Avatar, Box, Typography, Chip } from "@mui/material";
import { styled } from "@mui/system";
import TeacherNotIncludedInTimetable from "../../empty state management components/TeacherNotIncludedInTimetable";

const TeacherWeeklyTimeTableComponent = ({ teacherWeeklyTimetable }) => {
  const { apiDomain } = useAuth();
  console.log(teacherWeeklyTimetable)
  const { NumberOfPeriodsInAday } = useAuth();
  const teacherRow1 = [
    "Instructor",
    ...Array(NumberOfPeriodsInAday)
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
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }));

  if (!teacherWeeklyTimetable || teacherWeeklyTimetable.length === 0) {

    return (<TeacherNotIncludedInTimetable/>)
  }
  
  return (
    <div className="container mx-auto ">
      {/* <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-pulse">
        Teacher Timetable
      </h2> */}
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-light-primary to-light-secondary text-white">
              <th className="w-1/6 p-4 text-left font-semibold">
                {teacherRow1[0]}
              </th>
              {teacherRow1.slice(1).map((header, index) => (
                <th key={index} className="w-1/12 p-4 text-left font-semibold">
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
                    </Box>
                  </Box>
                </td>
                {day.sessions
                  .slice(0, NumberOfPeriodsInAday)
                  .map((session, sessionIndex) => (
                    <td key={sessionIndex} className="border-b p-2">
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
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherWeeklyTimeTableComponent;
