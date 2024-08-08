import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { LabelDispalyerWithIcon, LabelDisplayer } from "../../common";
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
}) => {
  const { apiDomain, headers, logoutUser, totalperiodsInWeek } = useAuth();

  const [classroomData, setClassroomData] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { NumberOfPeriodsInAday } = useAuth();
  const [openAddNewSubjectForm, setOpenAddNewSubjectForm] = useState({
    isOpen: false,
   
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/class-room/classroom/${selectedClassforView.id}/`,
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

  useEffect(() => {
    if (selectedClassforView.isOpen) {
      fetchData();
    }
  }, [selectedClassforView, refetch]);

  const gridClassName = getGridClassName(NumberOfPeriodsInAday);

  const handleReassignGroup = (subjectName, optionSubject) => {
    // Logic to reassign the group
    console.log(`Reassign group for ${subjectName} - ${optionSubject}`);
  };

  const handleDeleteSubject = () => {};

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
      currentLessonsPerWeek:classroomData.lessons_assigned_subjects
    }));
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
            {selectedClassforView?.name}
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
      {/* <div className="overflow-auto py-6">
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

          {selectedClassforView?.time_table?.map((obj, dayIndex) => (
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
                          {selectedClassforView?.qualified_subjects[
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
      </div> */}
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
