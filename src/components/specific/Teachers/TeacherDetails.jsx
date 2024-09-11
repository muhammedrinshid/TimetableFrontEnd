import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LabelDispalyerWithIcon, LabelDisplayer } from "../../common";
import { Avatar, Button, IconButton } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import { class_data } from "../../../assets/datas";
import { toast } from "react-toastify";
import axios from "axios";
import TeacherWeeklyTimeTableComponent from "./TeacherWeeklyTimeTableComponent";
import { RandomColorChip } from "../../Mui components";

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



const TeacherDetails = ({ setISelectedTeacher, selectedTeacher ,setIsDeleteTeacherPopupOpen}) => {
  const [classsRomms, setClassRooms] = useState(class_data);
  const [teacherDetails, setTeacherDetails] = useState({});

  const { NumberOfPeriodsInAday } = useAuth();
  const [teacherWeeklyTimetable, setTeacherWeeklyTimetable] = useState([]);

  const { apiDomain, headers, logoutUser, totalperiodsInWeek } = useAuth();


  const fetchTeacherWeekTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/teacher-timetable-week/${selectedTeacher.id}/`,
        {
          headers,
        }
      );
      setTeacherWeeklyTimetable(response.data);
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

  useEffect(() => {
    if (selectedTeacher.isopen) {
      fetchTeacherWeekTimetable();
    }
  }, [selectedTeacher]);

  const handleDeleteTeacher =()=>{
    setIsDeleteTeacherPopupOpen(selectedTeacher?.id)
   
  }
  return (
    <div className="w-full h-full rounded-2xl px-6 py-5">
      <div className="flex flex-row justify-between border-b pb-4">
        <div className="flex flex-row items-center gap-4">
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
          <h1 className="text-base font-semibold ">{selectedTeacher?.name}</h1>
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
            onClick={()=>handleDeleteTeacher()}
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
            {selectedTeacher?.grades_display?.map((grade) => (
              // <p className="text-[10px] p-[2px] w-fit px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
              //   {grade.name}
              // </p>
                            <RandomColorChip subject={grade.name} />

            ))}
          </div>
          <LabelDisplayer
            data={selectedTeacher?.min_lessons_per_week}
            label={"Min number of period"}
          />
          <LabelDisplayer
            data={selectedTeacher?.max_lessons_per_week}
            label={"Max number of period"}
          />
        </div>
      </div>
      <TeacherWeeklyTimeTableComponent
        teacherWeeklyTimetable={teacherWeeklyTimetable}
      />
    </div>
  );
};

export default TeacherDetails;
