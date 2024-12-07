import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
} from "@mui/material";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Star,
  ArrowRight,
  Users,
  Repeat,
} from "lucide-react";
import { useAuth } from "../../../../context/Authcontext";
import { Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const InstructorReplacementDialog = ({
  instructorReplacementDialog = {},
  setInstructorReplacementDialog,
  onUpdateInstructorReplacementDialog = () => {},
  teacherWeekTimetable,
  selectedDay,
  selectedDate,
  customTimetableIds,
  refetchStudentsTimetable,
  refetchTeacherTimetable
}) => {
  const { apiDomain ,headers} = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [eligibleInstructors, setEligibleInstructors] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [logOptions, setLogOptions] = useState({
    isExtraWorkloadLogged: true,
    isLeaveMarked: true,
  });
  // Destructure with default empty objects and values

  function getEligibleInstructors(period, currentTeacher, lesson) {
    return teacherWeekTimetable[selectedDay]
      .filter((instructor) => {
        // Check if the instructor is not the current teacher and is present during the specified period
        console.log(instructor.instructor.id !== currentTeacher.id, period);
        return (
          instructor.instructor.id !== currentTeacher.id &&
          instructor.instructor.present[period] && Array.isArray(instructor.sessions[period]) &&
          instructor.sessions[period].some(session => session.subject == null)
        );
      })
      .map((instructorData) => {
        const instructor = instructorData.instructor;

        // Calculate teaching and planning periods based on sessions

        // Calculate free and working periods
        const freePeriods = instructorData.sessions.filter(
          (sessionGrp) => sessionGrp[0].subject === null
        ).length;
        const workingPeriods = instructorData.sessions.filter(
          (sessionGrp) => sessionGrp[0].subject !== null
        ).length;
        
        // Initialize score
        let score = 0;

        // Check if the instructor is qualified for the lesson's subject
        if (
          instructor.qualified_subjects.some(
            (sub) => sub.id === lesson.subject_id
          )
        ) {
          score += 100; // Eligible for subject
        }
        if (
          instructor.qualified_levels?.some(
            (level) => level.id === lesson.lesson_level.id
          )
        ) {
          score += 10; // Eligible for subject
        }

        // Assuming qualified levels will be added later (e.g., check if instructor is qualified for the lesson's level)
        // if (instructor.qualified_levels.includes(lesson.level)) score += 10;

        // Calculate score based on leaves and extra loads
        score -= instructor.academic_year_extra_loads * 1;
        score -= instructor.last_month_extra_loads * 5;
        score -= instructor.last_week_extra_loads * 10;

        // Add leaves to score
        score += instructor.academic_year_leaves * 1;
        score += instructor.last_month_leaves * 5;
        score += instructor.last_week_leaves * 10;

        // Add free periods and subtract working periods for final score calculation
        score += freePeriods * 2;
        score -= workingPeriods;

        return {
          ...instructor,
          extra_free_periods: freePeriods,
          working_periods: workingPeriods,
          score,
        };
      })
      .sort((a, b) => b.score - a.score); // Sort instructors by score in descending order
  }

  useEffect(() => {
    // Check if the dialog is open
    if (instructorReplacementDialog.isOpen) {
      // Assuming `instructorReplacementDialog` contains the necessary `instructor`, `lesson`, `period`, `date`

      // Call the function to fetch eligible instructors
      const fetchedInstructors = getEligibleInstructors(
        instructorReplacementDialog.currentPeriod,
        instructorReplacementDialog.currentInstructor,
        instructorReplacementDialog.currentLesson
      );

      // Save the fetched instructors in the state
      setEligibleInstructors(fetchedInstructors);
    }
  }, [instructorReplacementDialog]);
  const {
    isOpen = false,
    currentInstructor = {},
    currentLesson = {},
    currentPeriod = "N/A",
    currentDate = "N/A",
  } = instructorReplacementDialog;

  const steps = [
    "Choose Replacement Method",
    "Select Teacher",
    "Confirm Replacement",
  ];


  
  const handleAutoReplacement = () => {
    if (!eligibleInstructors?.length) return; // Ensure eligible instructors exist
    setIsAutoProcessing(true);
  
    setTimeout(() => {
      // Select the best teacher from eligible instructors
      const bestTeacher = eligibleInstructors[0];
      setSelectedTeacher(bestTeacher);
  
      // Find the subject related to the current lesson
      const tempSubject = bestTeacher?.qualified_subjects?.find(
        (sub) => sub.id === instructorReplacementDialog?.currentLesson?.subject_id
      ) || bestTeacher?.qualified_subjects?.[0]||{};
  
      setSelectedSubject(tempSubject);
  
      setIsAutoProcessing(false);
      setActiveStep(2);
    }, 700);
  };
  
  const handleLogOptionToggle = (option) => {
    setLogOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handleTeacherReplacement = async () => {
    try {
      const replacementData = {
        day_timetable_id: customTimetableIds.day_timetable_id,
        original_teacher_id: instructorReplacementDialog.currentInstructor.id,
        replacement_teacher_id: selectedTeacher.id,
        day_lesson_id: instructorReplacementDialog.currentLesson.lesson_id,
        subject_id: selectedSubject.id,
        isExtraWorkloadLogged: logOptions.isExtraWorkloadLogged,
        isLeaveMarked: logOptions.isLeaveMarked,
        date: selectedDate,
        period: instructorReplacementDialog.currentPeriod+1
      };
  
      const response = await axios.post(
        `${apiDomain}/api/time-table/teacher-replacement/`, 
        replacementData,
        { headers }
      );
  
      const replacementDetails = {
        originalInstructorId: instructorReplacementDialog.currentInstructor,
        replacementInstructorId: selectedTeacher,
        lessonId: instructorReplacementDialog.currentLesson,
        period: instructorReplacementDialog.currentPeriod
      };
  
    
      setSelectedSubject({})
      setSelectedTeacher({})
      setEligibleInstructors([])
      setInstructorReplacementDialog({
        isOpen: false,
      currentInstructor: null,
      currentLesson: null,
      currentPeriod: null,
      currentDate: null,
      selectedTeacher: null,
      })
      refetchStudentsTimetable()
      refetchTeacherTimetable()
      
      toast.success('Teacher replacement successful');
      // Close dialog or perform additional actions
    } catch (error) {
      toast.error('Failed to replace teacher');
      console.error('Teacher replacement error:', error);
    }
  };  
  

  const handleManualReplacement = () => {
    setActiveStep(1);
  };

  const handleTeacherSelection = (teacher) => {
    setSelectedTeacher(teacher);
    setActiveStep(2);

    onUpdateInstructorReplacementDialog({
      ...instructorReplacementDialog,
      selectedTeacher: teacher,
    });
  };

  const handleCloseDialog = () => {
    onUpdateInstructorReplacementDialog({
      isOpen: false,
      currentInstructor: null,
      currentLesson: null,
      currentPeriod: null,
      currentDate: null,
      selectedTeacher: null,
    });

    setActiveStep(0);
    setSelectedTeacher(null);
  };

  const renderCurrentInstructorDetails = () => {
    // Safely extract values with fallbacks
    const name = currentInstructor?.name || "Unknown";
    const surname = currentInstructor?.surname || "";
    const profileImage =
      currentInstructor?.profile_image || "/api/placeholder/100/100";
    const teacherId = currentInstructor?.teacher_id || "N/A";
    const qualifiedSubjects = currentInstructor?.qualified_subjects || [];

    // Safely extract lesson details
    const subject = currentLesson?.subject || "N/A";
    const lessonType = currentLesson?.type || "N/A";
    const room = currentLesson?.room || {};
    const classDetails = currentLesson?.class_details?.[0] || {};

    return (
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Avatar
              alt={name}
              sx={{
                width: 120,
                height: 120,
                margin: "auto",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "2px solid #e0e0e0",
              }}
              src={profileImage && `${apiDomain}${profileImage}`}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
              {name} {surname}
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item>
                <Chip
                  label={`Teacher ID: ${teacherId}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    fontWeight: 500,
                  }}
                />
              </Grid>
              {qualifiedSubjects.map((subject) => (
                <Grid item key={subject.id || Math.random()}>
                  <Chip
                    label={subject.name || "Unknown Subject"}
                    size="small"
                    color="secondary"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, backgroundColor: "#e0e0e0" }} />
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 600, color: "#333" }}
        >
          Lesson Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              <strong>Subject:</strong> {subject}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              <strong>Type:</strong> {lessonType}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              <strong>Room:</strong> {room.name || "N/A"} (Room{" "}
              {room.room_number || "N/A"})
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              <strong>Class:</strong> {classDetails.standard || "N/A"}{" "}
              {classDetails.division || ""}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAutoReplacement}
              sx={{
                textTransform: "none",
                padding: "10px 16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {isAutoProcessing ? (
                <CircularProgress size={24} />
              ) : (
                "Auto Find Best Teacher"
              )}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleManualReplacement}
              sx={{
                textTransform: "none",
                padding: "10px 16px",
              }}
            >
              Pick Teacher Manually
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    );
  };

  const renderTeacherSelection = () => (
    <DialogContent className=" ">
      {eligibleInstructors.length === 0 ? (
        <div className="text-center text-red-500 dark:text-red-400 py-4">
          No instructors available
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {eligibleInstructors.map((instructor) => (
            <div
              key={instructor.id}
              onClick={() => handleTeacherSelection(instructor)}
              className="
                bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 
                rounded-xl shadow-md 
                cursor-pointer 
                p-4 flex 
                hover:shadow-xl 
                transition-all duration-300
                hover:scale-[1.01]
                relative
              "
            >
              <div className="mr-5">
                <Avatar
                  src={
                    instructor.profile_image &&
                    `${apiDomain}${instructor.profile_image}`
                  }
                  alt={`${instructor.name} ${instructor.surname}`}
                  sx={{ width: 65, height: 65 }}
                  className=" h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {instructor.name} {instructor.surname}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Teacher ID: {instructor.teacher_id}
                    </div>
                  </div>
                  <span
                    className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${
                      instructor.score > 10
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }
                  `}
                  >
                    Score: {instructor.score}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      Subjects
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {instructor.qualified_subjects.map((subject) => (
                        <span
                          key={subject.id}
                          className={`
                            inline-block 
                            bg-blue-100 dark:bg-blue-900 
                            text-blue-800 dark:text-blue-300 
                            text-xs px-2 py-1 rounded-full
                             ${
                                subject.id !==
                              instructorReplacementDialog?.currentLesson
                                ?.subject_id
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            }
                            
                          `}
                        >
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Award className="w-4 h-4 mr-2 text-purple-500" />
                      Levels
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {instructor.qualified_levels.map((level) => (
                        <span
                          key={level.id}
                          className={`
                            inline-block 
                            text-xs px-2 py-1 rounded-full 
                            ${
                              level.id !==
                              instructorReplacementDialog?.currentLesson
                                ?.lesson_level.id
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            }
                            `}
                        >
                          {level.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                    {instructor.extra_free_periods} Free Periods
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-teal-500" />
                    {instructor.academic_year_leaves} Academic Year Leaves
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {instructor.academic_year_extra_loads} Extra Loads
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DialogContent>
  );

  const renderSubjectSelection = () => {
    // Safely extract values
    const selectedName = selectedTeacher?.name || "Unknown";
    const selectedSurname = selectedTeacher?.surname || "";
    const originalName = currentInstructor?.name || "Unknown";
    const originalSurname = currentInstructor?.surname || "";

    return (
      <DialogContent>
        {selectedTeacher ? (
          <div className="space-y-6 p-6">
            {/* Header with Replacement Indication */}
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-2 border-blue-100 dark:border-blue-800">
              <div className="flex items-center space-x-4">
                <Repeat className="text-blue-600 dark:text-blue-400 w-10 h-10 animate-pulse" />
                <div>
                  <Typography
                    variant="h6"
                    className="text-gray-900 dark:text-gray-100 font-bold"
                  >
                    Instructor Replacement
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    Swap instructors for seamless class coverage
                  </Typography>
                  
                </div>
              </div>
            </div>

            {/* Replacement Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Original Instructor Card */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border dark:border-gray-600">
                <div className="flex items-center space-x-4 mb-2">
                  <Avatar
                    alt={originalName}
                    src={
                      instructorReplacementDialog.currentInstructor
                        ?.profile_image &&
                      `${apiDomain}${instructorReplacementDialog.currentInstructor?.profile_image}`
                    }
                    sx={{ width: 60, height: 60 }}
                    className="border-2 border-white dark:border-gray-600"
                  />
                  <div>
                    <Typography
                      variant="subtitle1"
                      className="text-gray-900 dark:text-gray-100 font-semibold"
                    >
                      {originalName} {originalSurname}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      Original Instructor
                    </Typography>
                    <FormControlLabel
                control={
                  <Checkbox
                    checked={logOptions.isLeaveMarked}
                    onChange={() => handleLogOptionToggle("isLeaveMarked")}
                    color="primary"
                  />
                }
                label="Mark as Leave"
              />
                    
                  </div>
                </div>
              </div>

              {/* Replacement Instructor Card */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-2 border-green-100 dark:border-green-800">
                <div className="flex items-center space-x-4 mb-2">
                  <Avatar
                    alt={selectedName}
                    src={
                      selectedTeacher.profile_image &&
                      `${apiDomain}${selectedTeacher.profile_image}`
                    }
                    sx={{ width: 60, height: 60 }}
                    className="border-2 border-white dark:border-gray-600"
                  />
                  <div>
                    <Typography
                      variant="subtitle1"
                      className="text-gray-900 dark:text-gray-100 font-semibold"
                    >
                      {selectedName} {selectedSurname}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-green-600 dark:text-green-400"
                    >
                      Replacement Instructor
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={logOptions.isExtraWorkloadLogged}
                          onChange={() =>
                            handleLogOptionToggle("isExtraWorkloadLogged")
                          }
                          color="primary"
                        />
                      }
                      label="Log as Extra Workload"
                      sx={{
                        fontSize:"12"
                      }}
                    />
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Lesson Details */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <BookOpen className="mr-2 text-purple-500" />
                <strong>Subject:</strong> {currentLesson?.subject || "N/A"}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-orange-500" />
                <strong>Period:</strong>{" "}
                {instructorReplacementDialog.currentPeriod+1}
              </div>
              <div className="flex items-center">
                <Users className="mr-2 text-blue-500" />
                <strong>Date:</strong> {selectedDay}
              </div>
            </div>

            {/* Subject Selection */}
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Replacement Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={handleSubjectChange}
                label="Select Replacement Subject"
                className="bg-white dark:bg-gray-700"
              >
                {qualifiedSubjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Proceed Button */}
           

            {/* Optional: Conditional rendering based on selected options */}
            {(logOptions.isExtraWorkloadLogged || logOptions.isLeaveMarked) && (
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {logOptions.isExtraWorkloadLogged && logOptions.isLeaveMarked
                  ? "Both extra workload and leave will be logged"
                  : logOptions.isExtraWorkloadLogged
                  ? "Extra workload will be logged"
                  : "Leave will be marked"}
              </div>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!selectedSubject || Object.keys(selectedSubject).length === 0}
              onClick={handleTeacherReplacement}
              className="mt-4 flex items-center justify-center space-x-2"
              endIcon={<ArrowRight />}
            >
              Confirm Replacement
            </Button>
          </div>
        ) : (
          <Typography
            color="error"
            className="text-center bg-red-100 dark:bg-red-900 p-4 rounded-xl"
          >
            No teacher selected
          </Typography>
        )}
      </DialogContent>
    );
  };

  const renderDialogContent = () => {
    switch (activeStep) {
      case 0:
        return renderCurrentInstructorDetails();

      case 1:
        return renderTeacherSelection();
      case 2:
        return renderSubjectSelection();
      default:
        return null;
    }
  };
  const qualifiedSubjects = selectedTeacher?.qualified_subjects || [];

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      {renderDialogContent()}

      <DialogActions>
        {activeStep > 0 && (
          <Button
            onClick={() => {
              setActiveStep((prev) => prev - 1);
              setSelectedSubject({});
              setSelectedTeacher(null);
            }}
            color="secondary"
          >
            Back
          </Button>
        )}
        {activeStep === 3 && (
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InstructorReplacementDialog;
