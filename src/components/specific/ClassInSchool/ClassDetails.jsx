import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { LabelDispalyerWithIcon, LabelDisplayer } from "../../common";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import { class_data } from "../../../assets/datas";

export const row1 = [
  "Instructor",
  "Session1",
  "Session2",
  "Session3",
  "Session4",
  "Session5",
  "Session6",
  "Session7",
  "Session8",
  "Session9",
  "Session10",
  "Session11",
  "Session12",
];

const getGridClassName = (NumberOfPeriodsInAday) => {
  const gridClasses = {
    1: "grid-cols-[minmax(80px,_1.5fr)_repeat(1,_minmax(70px,_1fr))]",
    2: "grid-cols-[minmax(80px,_1.5fr)_repeat(2,_minmax(70px,_1fr))]",
    3: "grid-cols-[minmax(80px,_1.5fr)_repeat(3,_minmax(70px,_1fr))]",
    4: "grid-cols-[minmax(80px,_1.5fr)_repeat(4,_minmax(70px,_1fr))]",
    5: "grid-cols-[minmax(80px,_1.5fr)_repeat(5,_minmax(70px,_1fr))]",
    6: "grid-cols-[minmax(80px,_1.5fr)_repeat(6,_minmax(70px,_1fr))]",
    7: "grid-cols-[minmax(80px,_1.5fr)_repeat(7,_minmax(70px,_1fr))]",
    8: "grid-cols-[minmax(80px,_1.5fr)_repeat(8,_minmax(70px,_1fr))]",
    9: "grid-cols-[minmax(80px,_1.5fr)_repeat(9,_minmax(70px,_1fr))]",
    10: "grid-cols-[minmax(80px,_1.5fr)_repeat(10,_minmax(70px,_1fr))]",
    11: "grid-cols-[minmax(80px,_1.5fr)_repeat(11,_minmax(70px,_1fr))]",
    12: "grid-cols-[minmax(80px,_1.5fr)_repeat(12,_minmax(70px,_1fr))]",
  };

  return (
    gridClasses[NumberOfPeriodsInAday] ||
    "grid-cols-[minmax(80px,_1.5fr)_repeat(1,_minmax(70px,_1fr))]"
  );
};
const ClassDetails = ({ setISelectedClassforView, SelectedClassforView }) => {
  const [classsRomms, setClassRooms] = useState(class_data); // Ensure class_data is defined or imported
  const { NumberOfPeriodsInAday } = useAuth();

  const findClassById = (id) => {
    return classsRomms.find((cls) => cls.class_id === id) || null;
  };

  const gridClassName = getGridClassName(NumberOfPeriodsInAday);

  // Mock data for subjects and teachers (replace with actual data later)
  const subjectsData = [
    {
      name: "Mathematics",
      lessonsPerWeek: 5,
      is_elective: false,
      teacher: [
        { name: "John Doe", avatar: "JD" },
        { name: "Jane Smith", avatar: "JS" },
      ],
    },
    {
      name: "Science",
      lessonsPerWeek: 4,
      is_elective: false,
      teacher: [{ name: "Emily Brown", avatar: "EB" }],
    },
    {
      name: "Languages",
      lessonsPerWeek: 6,
      is_elective: true,
      elective_group_name: null,

      options: [
        {
          subject: "French",
          number_of_students: 15,
          alotted_teachers: [
            { name: "Michael Johnson", avatar: "MJ" },
            { name: "Lisa Chen", avatar: "LC" },
          ],
        },
        {
          subject: "Spanish",
          number_of_students: 18,
          alotted_teachers: [
            { name: "Sarah Lee", avatar: "SL" },
            { name: "Carlos Rodriguez", avatar: "CR" },
          ],
        },
        {
          subject: "German",
          number_of_students: 12,
          alotted_teachers: [{ name: "Hans Mueller", avatar: "HM" }],
        },
      ],
    },
    {
      name: "Social Studies",
      lessonsPerWeek: 3,
      is_elective: false,
      teacher: [{ name: "Robert Wilson", avatar: "RW" }],
    },
    {
      name: "Arts",
      lessonsPerWeek: 2,
      is_elective: true,
      elective_group_name: "Foreign Languages C",

      options: [
        {
          subject: "Visual Arts",
          number_of_students: 20,
          alotted_teachers: [
            { name: "Alice Thompson", avatar: "AT" },
            { name: "Emma White", avatar: "EW" },
          ],
        },
        {
          subject: "Music",
          number_of_students: 16,
          alotted_teachers: [
            { name: "David Clark", avatar: "DC" },
            { name: "Frank Miller", avatar: "FM" },
          ],
        },
        {
          subject: "Drama",
          number_of_students: 14,
          alotted_teachers: [{ name: "Grace Taylor", avatar: "GT" }],
        },
      ],
    },
  ];


  const handleReassignGroup = (subjectName, optionSubject) => {
    // Logic to reassign the group
    console.log(`Reassign group for ${subjectName} - ${optionSubject}`);
  };
  
  const handleAddGroup = (subjectName, optionSubject) => {
    // Logic to add a new group
    console.log(`Add group for ${subjectName} - ${optionSubject}`);
  };

  return (
    <div className="w-full h-full rounded-2xl px-6 py-5">
      {/* Header Section */}
      <div className="flex flex-row justify-between border-b pb-4">
        <div className="flex flex-row items-center gap-4">
          <IconButton
            onClick={() =>
              setISelectedClassforView((prev) => ({ ...prev, isOpen: false }))
            }
          >
            <KeyboardBackspaceIcon fontSize="small" sx={{ color: "#818181" }} />
          </IconButton>
          <h1 className="text-xl font-semibold">
            {SelectedClassforView?.name}
          </h1>
        </div>
        <div className="flex flex-row gap-3">
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              padding: "10px 14px",
              fontSize: 12,
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              color: "#2196f3",
              borderColor: "#2196f3",
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                borderColor: "#1976d2",
              },
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              padding: "10px 14px",
              fontSize: 12,
              backgroundColor: "rgba(255, 182, 193, 0.2)",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(255, 182, 193, 0.5)",
                borderColor: "#d32f2f",
              },
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Class Overview Section */}
      <div className="flex flex-row pt-6 pl-1 border-b pb-5">
        <div className="basis-1/3 flex flex-col items-center">
          <div className="w-40 h-40 bg-blue-500 flex items-center justify-center text-white text-4xl font-bold rounded-lg shadow-lg">
            {"8-B"}
          </div>
          <Box sx={{ width: "100%", p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Teachers Assigned
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={70}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        backgroundColor: "#3f51b5",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                7 / 10
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Lessons Assigned
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        backgroundColor: "#4caf50",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" noWrap>
                17 / 20
              </Typography>
            </Box>
          </Box>
        </div>
        <div className="basis-2/3 px-6">
          <p className="text-sm font-medium text-text_2 font-Inter mb-4">
            CLASS DETAILS
          </p>
          <div className="grid grid-cols-2 gap-4">
            <LabelDisplayer data={"8th"} label="Standard" />
            <LabelDisplayer data={"B"} label="Division" />
            <LabelDisplayer data="25" label="Number of Students" />
            <LabelDisplayer data="Room 101" label="Classroom" />
          </div>
        </div>
      </div>

      {/* Subjects and Teachers Section */}
      <div className="py-6">
        <p className="text-sm font-medium text-text_2 font-Inter mb-4">
          SUBJECTS AND TEACHERS
        </p>
        <div className="space-y-4">
          {subjectsData.map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-4"
            >
              <div className="flex items-stretch">
                <div className="flex-shrink-0">
                  <div className="h-full w-12 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center rounded-l-lg">
                    <span className="text-xl font-bold text-white">
                      {subject.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-grow p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {subject.lessonsPerWeek} lessons/week •{" "}
                        {subject.is_elective ? "Elective" : "Core"}
                      </p>
                    </div>
                  </div>

                  {!subject.is_elective && (
                    <div className="flex flex-wrap mt-2">
                      {subject.teacher.map((teacher, teacherIndex) => (
                        <div
                          key={teacherIndex}
                          className="flex items-center mr-3 mb-1"
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: "0.75rem",
                              bgcolor: "secondary.main",
                              marginRight: "4px",
                            }}
                          >
                            {teacher.avatar}
                          </Avatar>
                          <span className="text-xs font-medium">
                            {teacher.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {subject.is_elective && subject.options && (
                    <div className="mt-2">
                         <div className="flex justify-between items-center mb-1">
                              {subject.elective_group_name ? (
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-500 mr-2">
                                    {subject.elective_group_name}
                                  </span>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleReassignGroup(
                                        subject.name,
                                        subject
                                      )
                                    }
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </div>
                              ) : (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleAddGroup(subject.name, subject)
                                  }
                                >
                                 add new group <AddIcon fontSize="small" />
                                </IconButton>
                              )}
                            </div>
                      <div className="grid grid-cols-1 gap-2">
                        {subject.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="bg-gray-50 p-2 rounded-md text-sm"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">
                                {option.subject}
                              </span>
                              <span className="text-xs text-gray-500">
                                {option.number_of_students} students
                              </span>
                            </div>
                         
                            <div className="flex flex-wrap">
                              {option.alotted_teachers.map(
                                (teacher, teacherIndex) => (
                                  <div
                                    key={teacherIndex}
                                    className="flex items-center mr-3 mb-1"
                                  >
                                    <Avatar
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        fontSize: "0.625rem",
                                        bgcolor: "secondary.main",
                                        marginRight: "4px",
                                      }}
                                    >
                                      {teacher.avatar}
                                    </Avatar>
                                    <span className="text-xs">
                                      {teacher.name}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timetable Section */}
      <div className="overflow-auto py-6">
        <p className="text-sm font-medium text-text_2 font-Inter my-2">
          TIME TABLE FOR A WEEK
        </p>
        <div className={`grid ${gridClassName}`}>
          {row1?.slice(0, NumberOfPeriodsInAday + 1).map((ele, indx) => (
            <div
              key={indx}
              className="bg-white cursor-pointer bg-opacity-70 backdrop-blur-sm shadow-bottom1 flex justify-center py-1 max-h-12 first:rounded-tl-lg last:rounded-tr-lg border border-opacity-10 border-gray-300"
            >
              <p className="text-xs font-medium text-text_2 m-2">{ele}</p>
            </div>
          ))}

          {SelectedClassforView?.time_table?.map((obj, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <div className="sticky left-0 bg-white z-10 border border-gray-300 border-opacity-15 bg-opacity-70 backdrop-blur-sm flex justify-center p-2 items-center">
                <div className="w-full h-full flex flex-col justify-center items-center gap-2 bg-light-secondary bg-opacity-20 rounded-lg p-2 shadow-custom-10">
                  <p className="capitalize font-semibold text-slate-600 text-sm">
                    {obj.day}
                  </p>
                </div>
              </div>
              {obj.class_slots
                ?.slice(0, NumberOfPeriodsInAday)
                .map((class_slot, ind) => {
                  const classRoom = findClassById(class_slot?.class);

                  return (
                    <div
                      key={ind}
                      className={`border border-gray-300 border-opacity-15 p-2 bg-white`}
                    >
                      <div
                        className={`bg-white rounded-md pt-1 h-full flex flex-col justify-between overflow-hidden items-center ${
                          class_slot == null
                            ? "gradient_3"
                            : class_slot?.sub == 0
                            ? "gradient_1"
                            : class_slot?.sub == 1
                            ? "gradient_2"
                            : "gradient_4"
                        }`}
                      >
                        <h1 className="text-nowrap text-center justify-center inline my-1 text-base font-semibold text-opacity-80">
                          {classRoom?.standard}
                          {classRoom?.standard && "-"}
                          {classRoom?.division || "Free"}
                        </h1>
                        <h2 className="text-xs font-semibold text-dark-accent text-opacity-90 font-Roboto text-center mb-4">
                          {SelectedClassforView?.qualified_subjects[
                            class_slot?.sub
                          ] || "Focus Time"}
                        </h2>
                      </div>
                    </div>
                  );
                })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
