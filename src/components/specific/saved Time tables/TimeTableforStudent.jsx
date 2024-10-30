import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/Authcontext";
import { Avatar, Box, Typography, Chip } from "@mui/material";
import { styled } from "@mui/system";

const StudentTimeTableComponent = ({ StudentTimeTable, searchTerm }) => {
  const { apiDomain, NumberOfPeriodsInAday } = useAuth();
  const [filteredTimetable, setFilteredTimetable] = useState(StudentTimeTable);

  const studentRow = [
    "Time",
    ...Array(NumberOfPeriodsInAday)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];

   useEffect(() => {
     if (searchTerm) {
       const lowercasedSearch = searchTerm.toLowerCase();
       const filtered = StudentTimeTable?.filter((classData) => {
         // Check class and room matches (unchanged)
         const classMatch =
           `${classData?.classroom?.standard}${classData?.classroom?.division}`
             .toLowerCase()
             .includes(lowercasedSearch);

         const roomMatch =
           `${classData?.classroom?.room?.name} (Room ${classData?.classroom?.room?.room_number})`
             .toLowerCase()
             .includes(lowercasedSearch);

         // Check nested sessions structure
         const sessionMatch = classData?.sessions?.some(
           (sessionGrp) =>
             sessionGrp?.session?.name
               ?.toLowerCase()
               .includes(lowercasedSearch) ||
             sessionGrp?.session?.class_distribution?.some(
               (distribution) =>
                 distribution?.subject
                   ?.toLowerCase()
                   .includes(lowercasedSearch) ||
                 distribution?.teacher?.name
                   ?.toLowerCase()
                   .includes(lowercasedSearch)
             )
         );

         return classMatch || roomMatch || sessionMatch;
       });
       setFilteredTimetable(filtered);
     } else {
       setFilteredTimetable(StudentTimeTable);
     }
   }, [searchTerm, StudentTimeTable, setFilteredTimetable]);

  const getSessionColor = (session) => {
    switch (session?.type) {
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

  const getAvatarColor = (standard, division) => {
    const hue =
      ((standard?.charCodeAt(0) ?? 0) * 20 +
        (division?.charCodeAt(0) ?? 0) * 5) %
      360;
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Student Timetable
      </h2>
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full table-fixed">
          <thead>
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
            {filteredTimetable?.map((classData, classIndex) => (
              <tr
                key={classIndex}
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
                        bgcolor: getAvatarColor(
                          classData?.classroom?.standard,
                          classData?.classroom?.division
                        ),
                      }}
                    >
                      {`${classData?.classroom?.standard}${classData?.classroom?.division}`}
                    </StyledAvatar>
                    <Box>
                      <Typography
                        variant="h5"
                        component="div"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {`${classData?.classroom?.standard} ${classData?.classroom?.division}`}
                      </Typography>
                      <Box mb={1}>
                        <InfoChip
                          label={`${classData?.classroom?.total_students} Students`}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                        <InfoChip
                          label={classData?.classroom?.room?.room_type}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {`${classData?.classroom?.room?.name} (Room ${classData?.classroom?.room?.room_number})`}
                      </Typography>
                    </Box>
                  </Box>
                </td>
                {classData?.sessions
                  ?.slice(0, NumberOfPeriodsInAday)
                  ?.map((sessionGrp, sessionGrpIndex) => (
                    <td key={sessionGrpIndex} className="border-b p-2">
                      {sessionGrp?.map((session, sessionIndex) => (
                        <div
                          className={`rounded-lg p-3 h-full ${getSessionColor(
                            session
                          )} transition-all duration-300 hover:shadow-md`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-sm truncate flex-grow">
                              {session?.name}
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
                          {session?.class_distribution?.map(
                            (distribution, distributionIndex) => (
                              <div
                                key={distributionIndex}
                                className="mt-2 bg-white bg-opacity-50 rounded-md p-2"
                              >
                                <div className="flex items-center mb-1">
                                  <Avatar
                                    alt={distribution?.teacher?.name}
                                    src={
                                      distribution?.teacher?.profile_image
                                        ? `${apiDomain}/${distribution?.teacher?.profile_image}`
                                        : undefined
                                    }
                                    className="w-8 h-8 rounded-full mr-2 border-2 border-white"
                                  >
                                    {!distribution?.teacher?.profile_image &&
                                      distribution?.teacher?.name?.charAt(0)}
                                  </Avatar>
                                  <div>
                                    <p className="text-xs font-medium">
                                      {distribution?.teacher?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {distribution?.subject}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-xs">
                                  {session?.type === "Elective" && (
                                    <p className="text-gray-600">
                                      Students:{" "}
                                      {
                                        distribution?.number_of_students_from_this_class
                                      }
                                    </p>
                                  )}
                                  <p className="text-gray-600">
                                    Room: {distribution?.room?.name} (
                                    {distribution?.room?.room_number})
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ))}
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

export default StudentTimeTableComponent;
