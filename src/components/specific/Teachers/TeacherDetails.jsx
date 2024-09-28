import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LabelDispalyerWithIcon, LabelDisplayer, MeterGaugeChart, PieChartStatsDisplayer, StatsPairDisplayer } from "../../common";
import { Avatar, Button, IconButton } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import { class_data } from "../../../assets/datas";
import { toast } from "react-toastify";
import axios from "axios";
import TeacherWeeklyTimeTableComponent from "./TeacherWeeklyTimeTableComponent";
import { RandomColorChip } from "../../Mui components";
import { CheckCircle, ErrorOutline, WarningAmber } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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



const TeacherDetails = ({ setISelectedTeacher, selectedTeacher ,setIsDeleteTeacherPopupOpen,teachersMap}) => {
  const [scheduledLessons,setScheduledLessons]=useState({free:0,engaged:0})
  const [isAnimating, setIsAnimating] = useState(false);
  const [teacherWeeklyTimetable, setTeacherWeeklyTimetable] = useState([]);

  const { apiDomain, headers, } = useAuth();

const calculateScheduledLessons = (timetableData) => {
  let free = 0;
  let engaged = 0;

  timetableData.forEach((day) => {
    day.sessions.forEach((session) => {
      if (session.subject === null) {
        free++;
      } else {
        engaged++;
      }
    });
  });

  return { free, engaged };
};

const getStatusDetails = (
  minLessonsPerWeek,
  maxLessonsPerWeek,
  freeLessonsPerWeek,
  engagedLessonsPerWeek
) => {
  const averageLessons = (minLessonsPerWeek + maxLessonsPerWeek) / 2;
  let icon = <ErrorOutline style={{ color: "grey" }} />;
  let text = "Unknown";

  // Ensure values are numbers and non-negative
  if (isNaN(minLessonsPerWeek) || isNaN(maxLessonsPerWeek) || isNaN(freeLessonsPerWeek) || isNaN(engagedLessonsPerWeek)) {
    return { status: "error", icon: <ErrorOutline style={{ color: "red" }} />, text: "Invalid values" };
  }

  if (minLessonsPerWeek > maxLessonsPerWeek) {
    return { status: "error", icon: <ErrorOutline style={{ color: "red" }} />, text: "Check ranges" };
  }

  if (engagedLessonsPerWeek < minLessonsPerWeek) {
    icon = <ErrorOutline style={{ color: "red" }} />;
    text = "Below Minimum Lessons";
  } else if (engagedLessonsPerWeek > maxLessonsPerWeek) {
    icon = <WarningAmber style={{ color: "orange" }} />;
    text = "Exceeds Maximum Lessons";
  } else if (engagedLessonsPerWeek === minLessonsPerWeek) {
    icon = <CheckCircle style={{ color: "green" }} />;
    text = "Exactly at Minimum";
  } else if (engagedLessonsPerWeek === maxLessonsPerWeek) {
    icon = <CheckCircle style={{ color: "blue" }} />;
    text = "Exactly at Maximum";
  } else if (
    engagedLessonsPerWeek >= averageLessons - 1 &&
    engagedLessonsPerWeek <= averageLessons + 1
  ) {
    icon = <CheckCircle style={{ color: "purple" }} />;
    text = "Close to Average Lessons";
  } else if (
    engagedLessonsPerWeek > minLessonsPerWeek &&
    engagedLessonsPerWeek < maxLessonsPerWeek
  ) {
    icon = <CheckCircle style={{ color: "green" }} />;
    text = "Optimal Lesson Load";
  } else {
    text = "Unclear Status";
  }


  return { status: text.replace(/ /g, ""), icon, text };
};
  const fetchTeacherWeekTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/teacher-timetable-week/${selectedTeacher.id}/`,
        {
          headers,
        }
      );
      setTeacherWeeklyTimetable(response.data);
      const scheduledLessons = calculateScheduledLessons(response.data);

      setScheduledLessons(scheduledLessons);

    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with an error:",
          error.response.status,
          error.response.data
        );

        if (error.response.status === 422) {
          toast.info(
            "This teacher has not been included in the default timetable optimization"
          );
        } else {
          toast.error(
            `Failed to retrieve timetables: ${
              error.response.data.message || "Server error"
            }`
          );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Failed to retrieve timetables: No response from server");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Failed to retrieve timetables: Network error");
      }
    }
  };
const data = [
  { name: "Group A", value: 400, color: "#0088FE" },
  { name: "Group B", value: 300, color: "#00C49F" },
  { name: "Group C", value: 300, color: "#FFBB28" },
  { name: "Group D", value: 200, color: "#FF8042" },
];
  useEffect(() => {
    if (selectedTeacher.isopen) {
      fetchTeacherWeekTimetable();
    }
  }, [selectedTeacher]);

  const handleDeleteTeacher =()=>{
    setIsDeleteTeacherPopupOpen(selectedTeacher?.id)
   
  }

    const { icon: iconForAsignedLessonEvaluate,text: textForAsignedLessonEvaluate } =
      getStatusDetails(
        selectedTeacher?.min_lessons_per_week,
        selectedTeacher?.max_lessons_per_week,
        scheduledLessons.free,
        scheduledLessons.engaged,
      );
const isPreviousDisabled =  selectedTeacher.index === 0;
const isNextDisabled = 
  selectedTeacher.index === teachersMap.length - 1;
console.log(isPreviousDisabled,isNextDisabled)
const handleTeacherPrevious = (
  currentIndex,
) => {
  // Check if previous is disabled (if current index is 0)
  if (currentIndex === 0) return;

  // Start the animation and reset the timetable
  setIsAnimating(true);
  setTeacherWeeklyTimetable([]);

  // After a delay, update the selected teacher
  setTimeout(() => {
    const newIndex = currentIndex - 1;
    const teacher_obj = teachersMap[newIndex];

    // Set the selected teacher with the updated index and open the teacher view
    setISelectedTeacher({
      ...teacher_obj,
      index: newIndex,
      isopen: true,
    });

    setIsAnimating(false);
  }, 300);
};

const handleTeacherNext = (
  currentIndex,
) => {
  // Check if next is disabled (if current index is the last in the array)
  if (currentIndex === teachersMap.length - 1) return;

  // Start the animation and reset the timetable
  setIsAnimating(true);
  setTeacherWeeklyTimetable([]);

  // After a delay, update the selected teacher
  setTimeout(() => {
    const newIndex = currentIndex + 1;
    const teacher_obj = teachersMap[newIndex];

    // Set the selected teacher with the updated index and open the teacher view
    setISelectedTeacher({
      ...teacher_obj,
      index: newIndex,
      isopen: true,
    });

    setIsAnimating(false);
  }, 300);
};


  const pieChartComponent = (
    <PieChartStatsDisplayer
      title="Sample Data Distribution"
      data={[
        {
          name: "Free / Week",
          value: scheduledLessons.free,
          color: "#00C49F",
        },
        {
          name: "Engaged / Week",
          value: scheduledLessons.engaged,
          color: "#0088FE",
        },
      ]}
      size="small"
    />
  );
  return (
    <div
      className={` w-full h-full relative px-6   rounded-2xl transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col bg-dark-background1 mb-4 p-3 rounded-lg shadow-custom-6">
        <div className=" p-2 flex flex-row justify-between items-center border-b pb-4 sticky top-0 backdrop-blur-lg bg-dark-background1 z-10">
          <div className="flex flex-row items-center gap-4 ">
            <IconButton>
              <KeyboardBackspaceIcon
                fontSize="small"
                sx={{
                  color: "#818181",
                }}
                onClick={() => {
                  setISelectedTeacher((prev) => ({ ...prev, isopen: false }));
                  setTeacherWeeklyTimetable([]);
                }}
              />
            </IconButton>
            <Avatar
              sx={{
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
              }}
              src={
                selectedTeacher?.profile_image
                  ? `${apiDomain}/${selectedTeacher?.profile_image}`
                  : undefined
              }
            >
              {selectedTeacher?.name}
            </Avatar>
            <h1 className="text-base font-semibold ">
              {selectedTeacher?.name}
            </h1>
          </div>

          <div className=" flex flex-row items-center gap-2">
            <p className="text-[10px] text-text_2 font-light mr-4">
              created on 22-06-2026
            </p>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              size="small"
              sx={{
                textTransform: "none",
                border: "none",
                outline: "none",
                borderRadius: 2,
                padding: "8px 12px",
                fontSize: 10,
                backgroundColor: "rgba(255, 182, 193, 0.2)",
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(255, 182, 193, 0.5)",
                  borderColor: "#d32f2f",
                },
              }}
              onClick={() => handleDeleteTeacher()}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className="flex flex-row pt-6 pl-1 border-b pb-5">
          <div className="basis-1/3 flex flex-col px-3">
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2">
              PROFILE IMAGE
            </p>
            <Avatar
              src={
                selectedTeacher?.profile_image
                  ? `${apiDomain}/${selectedTeacher?.profile_image}`
                  : undefined
              }
              sx={{
                width: 160,
                height: 160,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              alt=""
            />
            <p className="text-[11px] font-medium text-text_2 font-Inter mt-6">
              TUTOR DETAILS
            </p>
            <LabelDisplayer data={selectedTeacher.name} label={"Name"} />
            <LabelDisplayer data={selectedTeacher.surname} label={"Surname"} />
          </div>
          <div className="basis-1/3 px-3">
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2 ">
              CONTACT DETAILS
            </p>
            <LabelDispalyerWithIcon
              data={selectedTeacher.email}
              label={"Mail id"}
            />
            <LabelDispalyerWithIcon
              data={selectedTeacher.phone}
              label={"Phone"}
            />
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2 mt-8">
              QUALIFIED SUBJECTS
            </p>
            <div className="flex gap-2 flex-wrap">
              {selectedTeacher?.qualified_subjects_display?.map((subject) => (
                <p className="text-[10px] p-[2px] w-fit px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
                  {subject.name}
                </p>
              ))}
            </div>
            <LabelDisplayer
              data={selectedTeacher.teacher_id}
              label={"Teacher Id"}
            />
          </div>
          <div className="basis-1/3 px-3 ">
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2 ">
              ACADEMIC DETAILS
            </p>
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2 mt-8">
              QUALIFIED GRADES
            </p>
            <div className="flex gap-2 flex-wrap">
              {selectedTeacher?.levels_display?.map((level) => (
                // <p className="text-[10px] p-[2px] w-fit px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
                //   {level.name}
                // </p>
                <RandomColorChip subject={level.name} />
              ))}
            </div>
            <StatsPairDisplayer
              leftLabel="Min Lesson / Week"
              rightLabel="Max Lesson / Week"
              leftValue={selectedTeacher?.min_lessons_per_week}
              rightValue={selectedTeacher?.max_lessons_per_week}
              rightColor={"text-red-600"}
              leftColor={"text-green-600"}
              size="small"
            />{" "}
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2 ">
              LESSON ASSIGNEMTN
            </p>
            <StatsPairDisplayer
              leftLabel="Free/week"
              rightLabel="Engaged/week"
              leftValue={scheduledLessons.free}
              rightValue={scheduledLessons.engaged}
              rightColor={"text-[#0088FE]"}
              leftColor={"text-[#00C49F]"}
              text={textForAsignedLessonEvaluate}
              icon={iconForAsignedLessonEvaluate}
              size="small"
              specialComponents={pieChartComponent}
            />{" "}
          </div>
        </div>
      </div>

      <TeacherWeeklyTimeTableComponent
        teacherWeeklyTimetable={teacherWeeklyTimetable}
      />

      <div className="flex flex-row items-center justify-center gap-2 sticky bottom-6">
        {/* Previous Button */}
        <IconButton
          className="pointer-events-auto transition-all duration-200 ease-in-out"
          sx={{
            backgroundColor: isPreviousDisabled
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(25, 118, 210, 0.1)", // Light background with primary color's very low opacity
            "&:hover": {
              backgroundColor: isPreviousDisabled
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(25, 118, 210, 0.2)", // Slightly stronger background on hover
              transform: isPreviousDisabled
                ? "translateX(-50%)"
                : "scale(1.05) translateX(-35%)",
            },
            transform: "translateX(-40%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          disabled={isPreviousDisabled}
          onClick={() => handleTeacherPrevious(selectedTeacher.index)}
        >
          <ArrowBackIosNewIcon
            sx={{
              fontSize: 14,
              color: (theme) => theme.palette.primary.main,
            }} // Primary color for icon
          />
        </IconButton>

        {/* Next Button */}
        <IconButton
          className="pointer-events-auto transition-all duration-200 ease-in-out"
          sx={{
            backgroundColor: isNextDisabled
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(25, 118, 210, 0.1)", // Light background with primary color's low opacity
            "&:hover": {
              backgroundColor: isNextDisabled
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(25, 118, 210, 0.2)", // Slightly stronger background on hover
              transform: isNextDisabled
                ? "translateX(50%)"
                : "scale(1.05) translateX(35%)",
            },
            transform: "translateX(40%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          disabled={isNextDisabled}
          onClick={() => handleTeacherNext(selectedTeacher.index)}
        >
          <ArrowForwardIosIcon
            sx={{
              fontSize: 14,
              color: (theme) => theme.palette.primary.main,
            }} // Primary color for icon
          />
        </IconButton>
      </div>
    </div>
  );
};

export default TeacherDetails;
