import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { LabelDispalyerWithIcon, LabelDisplayer } from "../../common";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateSubjectForm from "../../forms/UpdateSubjectForm";
import SubjectCard from "./SubjectCard";
import AddNewSubjectForm from "../../forms/AddNewSubjectForm";
import ClassRoomWeeklyTimeTableComponent from "./ClassRoomWeeklyTimeTableComponent";

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
const ClassDetails = ({
  setISelectedClassforView,
  selectedClassforView,
  handleAddGroup,
  refetch,
  refresh,
  classroomMap,
}) => {
  const { apiDomain, headers, logoutUser, totalperiodsInWeek } = useAuth();

  const [classroomData, setClassroomData] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [classroomWeeklyTimetable, setClassroomWeeklyTimetable] = useState([]);
  const { NumberOfPeriodsInAday } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [openAddNewSubjectForm, setOpenAddNewSubjectForm] = useState({
    isOpen: false,
  });

  const fetchClassroomData = async () => {
    let idForFetch =
      classroomMap[selectedClassforView?.gradeId][
        selectedClassforView?.standard_id
      ][selectedClassforView?.index];
    try {
      const response = await axios.get(
        `${apiDomain}/api/class-room/classroom/${idForFetch}/`,
        {
          headers,
        }
      );
      setClassroomData(response.data);
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Response error:",
          err.response.status,
          err.response.data
        );
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(
            `Error occurred: ${
              err.response.data?.message || "Unexpected error"
            }`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        toast.error("Error occurred: No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", err.message);
        toast.error(`Error occurred: ${err.message}`);
      }
    }
  };
  const isPreviousDisabled = selectedClassforView?.index === 0;

  const isNextDisabled =
    selectedClassforView?.index + 1 ===
    (classroomMap[selectedClassforView?.gradeId]?.[
      selectedClassforView?.standard_id
    ]?.length || 0);

  const fetchClassroomWeekTimetable = async () => {
    let idForFetch =
      classroomMap[selectedClassforView?.gradeId][
        selectedClassforView?.standard_id
      ][selectedClassforView?.index];

    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/classroom-timetable-week/${idForFetch}/`,
        {
          headers,
        }
      );
      setClassroomWeeklyTimetable(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with an error:",
          error.response.status,
          error.response.data
        );
        toast.error(
          `Failed to retrieve timetables: ${
            error.response.data.message || "Server error"
          }`
        );
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No response received:", error.request);
        toast.error("Failed to retrieve timetables: No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        toast.error("Failed to retrieve timetables: Network error");
      }
    }
  };

  useEffect(() => {
    if (selectedClassforView.isOpen) {
      fetchClassroomData();
      fetchClassroomWeekTimetable();
    }
  }, [selectedClassforView, refetch]);

  const gridClassName = getGridClassName(NumberOfPeriodsInAday);

  const handleReassignGroup = (subjectName, optionSubject) => {
    // Logic to reassign the group
    console.log(`Reassign group for ${subjectName} - ${optionSubject}`);
  };


  const handleSubjectEditButton = (subject) => {
    let newData = { ...subject, gradeId: selectedClassforView.gradeId };
    setSelectedSubject(newData);
    setIsUpdateFormOpen(true);
  };

  const onClickAddNewSubject = () => {
    setOpenAddNewSubjectForm((prev) => ({
      ...prev,
      isOpen: true,
      classroomId: classroomData?.id,
      selectedSubjects: classroomData.subject_data.map((sub) => sub.subjectId),
      standardId: selectedClassforView?.standard_id,
      gradeId: selectedClassforView?.gradeId,
      currentLessonsPerWeek: classroomData.lessons_assigned_subjects,
    }));
  };

  const handlePrevious = () => {
    if (isPreviousDisabled) return;
    setIsAnimating(true);
    setTimeout(() => {
      setISelectedClassforView((prev) => ({...prev, index: prev.index - 1}));
      setIsAnimating(false);
    }, 300); // Match this with your CSS transition duration
  };
  
  const handleNext = () => {
    if (isNextDisabled) return;
    setIsAnimating(true);
    setTimeout(() => {
      setISelectedClassforView((prev) => ({...prev, index: prev.index + 1}));
      setIsAnimating(false);
    }, 300);
  };
  return (
    <div
      className={`w-full h-full rounded-2xl px-6 py-5 transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute top-0 right-0 w-full h-full flex flex-col justify-end  items-center ">
        <div className="flex flex-row items-center gap-4 sticky bottom-0">
          <IconButton
            className="pointer-events-auto transition-all duration-200 ease-in-out"
            sx={{
              backgroundColor: isPreviousDisabled
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.3)",
              color: isPreviousDisabled ? "rgba(255, 255, 255, 0.3)" : "white",
              "&:hover": {
                backgroundColor: isPreviousDisabled
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(0, 0, 0, 0.5)",
                transform: isPreviousDisabled
                  ? "translateX(-50%)"
                  : "scale(1.1) translateX(-45%)",
              },
              transform: "translateX(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
            }}
            onClick={handlePrevious}
            disabled={isPreviousDisabled}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Next button */}
          <IconButton
            className="pointer-events-auto transition-all duration-200 ease-in-out"
            sx={{
              backgroundColor: isNextDisabled
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.3)",
              color: isNextDisabled ? "rgba(255, 255, 255, 0.3)" : "white",
              "&:hover": {
                backgroundColor: isNextDisabled
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(0, 0, 0, 0.5)",
                transform: isNextDisabled
                  ? "translateX(50%)"
                  : "scale(1.1) translateX(45%)",
              },
              transform: "translateX(50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
            }}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </div>
      </div>
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
            {classroomData?.standard_short_name}-{classroomData?.division}
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
            {classroomData?.standard_short_name}-{classroomData?.division}
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
                    value={
                      classroomData?.total_subjects
                        ? (classroomData.subjects_assigned_teacher /
                            classroomData.total_subjects) *
                          100
                        : 0
                    }
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
                {classroomData?.subjects_assigned_teacher} /{" "}
                {classroomData?.total_subjects}
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
                    value={
                      classroomData?.lessons_assigned_subjects
                        ? (classroomData?.lessons_assigned_subjects /
                            totalperiodsInWeek) *
                          100
                        : 0
                    }
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
                {classroomData?.lessons_assigned_subjects} /{" "}
                {totalperiodsInWeek}
              </Typography>
            </Box>
          </Box>
        </div>
        <div className="basis-2/3 px-6">
          <p className="text-sm font-medium text-text_2 font-Inter mb-4">
            CLASS DETAILS
          </p>
          <div className="grid grid-cols-2 gap-4">
            <LabelDisplayer
              data={classroomData?.standard_name}
              label="Standard"
            />
            <LabelDisplayer data={classroomData?.division} label="Division" />
            <LabelDisplayer
              data={classroomData?.number_of_students}
              label="Number of Students"
            />
            <LabelDisplayer
              data={
                classroomData?.room
                  ? classroomData.room?.room_number +
                    " " +
                    classroomData.room?.name
                  : "No room assigned"
              }
              label="Classroom"
            />
          </div>
        </div>
      </div>

      {/* Subjects and Teachers Section */}
      <div className="py-6">
        <p className="text-sm font-medium text-text_2 font-Inter mb-4">
          SUBJECTS AND TEACHERS
        </p>
        <div className="space-y-4">
          {classroomData?.subject_data.map((subject, index) => (
            <SubjectCard
              key={index}
              subject={subject}
              onEdit={handleSubjectEditButton}
              onAddGroup={handleAddGroup}
              selectedClassforView={selectedClassforView}
              refresh={refresh}
            />
          ))}
        </div>
      </div>
      <Tooltip title={"add new subject"}>
        <button
          onClick={onClickAddNewSubject}
          className="fixed  right-6 bottom-6 p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Add new subject"
        >
          <AddIcon className="w-6 h-6 text-white" />
        </button>
      </Tooltip>

      {/* Timetable Section */}
      <div className="overflow-auto py-6">
        <ClassRoomWeeklyTimeTableComponent
          weeklyTimetable={classroomWeeklyTimetable}
        />
      </div>
      <UpdateSubjectForm
        subject={selectedSubject}
        // onUpdate={handleUpdateSubject}
        refresh={refresh}
        open={isUpdateFormOpen}
        onClose={() => setIsUpdateFormOpen(false)}
      />
      <AddNewSubjectForm
        open={openAddNewSubjectForm.isOpen}
        onClose={() =>
          setOpenAddNewSubjectForm((prev) => ({ ...prev, isOpen: false }))
        }
        openAddNewSubjectForm={openAddNewSubjectForm}
        refresh={refresh}
      />
    </div>
  );
};

export default ClassDetails;
