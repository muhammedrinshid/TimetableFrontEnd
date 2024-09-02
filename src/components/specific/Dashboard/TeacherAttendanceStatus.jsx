import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { StatusChip, StyledAvatarGroup } from "../../Mui components";
import { useAuth } from "../../../context/Authcontext";

const TeacherAttendanceStatus = ({
  teacherWeekTimetable,
  toggleDrawer,
  countPresentTeachers,
  getTeacherStatus,
  toggleFullDayLeaveorPresent,
}) => {

  const {apiDomain}=useAuth()
  return (
    <div className="overflow-y-auto relative">
      {/* heading section of teachers present status section */}
      <div className="sticky top-0 left-0 flex flex-col items-start basis-1/4 bg-white p-4  font-Inter shadow-bottom1 z-10">
        <StyledAvatarGroup max={4}>
          {teacherWeekTimetable.map((teacher) => (
            <Avatar
              alt={teacher?.instructor.name}
              sx={{ width: 25, height: 25, fontSize: 6 }}
              src={
                teacher?.instructor?.profile_image
                  ? `${apiDomain}/media/${teacher?.instructor?.profile_image}`
                  : undefined
              }
            />
          ))}
        </StyledAvatarGroup>
        <h2 className="  font-semibold text-2xl text-slate-700  ">
          <span className="text-light-primary opacity-80 ">
            {countPresentTeachers(teacherWeekTimetable)}{" "}
          </span>{" "}
          teachers are in attendance{" "}
        </h2>
        <p className="text-text_1 text-sm"> On April 27, 2024</p>
      </div>

      {/* details of teachers present status */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col   ">
        {teacherWeekTimetable.map((teacher) => {
          let status = getTeacherStatus(teacher?.instructor?.present);

          // each element of teachers
          return (
            <div className="flex flex-row border-t border-slate-200  odd:bg-slate-50 even:bg-slate-100 ">
              <div className=" flex flex-col justify-start  items-center py-1 gap-2 px-3 w-1/5">
                <Avatar
                  src={
                    teacher?.instructor?.profile_image
                      ? `${apiDomain}/media/${teacher?.instructor?.profile_image}`
                      : undefined
                  } // alt=""
                  // width={40}
                  // className="rounded-full"
                >
                  {teacher.instructor.name.charAt(0)}
                </Avatar>
                <p className="text-xs font-medium font-Inter text-dark-accent">
                  {teacher.instructor.teacher_id}
                </p>
              </div>

              <div className="flex flex-row  items-between flex-1 py-1">
                <div className="border-x flex-1 py-1 px-3 flex flex-col justify-center font-Inter">
                  <h2 className="font-medium text-md">
                    {teacher.instructor.name} {teacher.instructor.surname}
                  </h2>
                  <div className="flex flex-wrap flex-row gap-2   items-end ">
                    {teacher.instructor.qualified_subjects.map((sub) => (
                      <p className="text-[10px] p-[2px] w-fit px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
                        {sub.name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-1/4 py-3 px-1">
                <StatusChip status={status} />
                {status == "present" ? (
                  <Tooltip title="Mark as full day leave">
                    <IconButton
                      size="small"
                      onClick={() =>
                        toggleFullDayLeaveorPresent(teacher.instructor.teacher_id, "leave")
                      }
                      className="text-sm text-red-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightGreen"
                    >
                      <DoDisturbAltIcon
                        fontSize="small"
                        sx={{ color: "#FFB6C1" }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Mark as full day present">
                    <IconButton
                      size="small"
                      onClick={() => {
                        toggleDrawer("noToggle");
                        toggleFullDayLeaveorPresent(
                          teacher,
                          "present"
                        );
                      }}
                      className="text-sm text-green-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightRed"
                    >
                      <CheckIcon fontSize="small" sx={{ color: "green" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherAttendanceStatus;
