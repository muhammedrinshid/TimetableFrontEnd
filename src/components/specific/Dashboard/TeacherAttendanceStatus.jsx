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
    <div className="overflow-y-auto relative bg-white dark:bg-dark-background text-slate-700 dark:text-dark-text">
      <div className="sticky top-0 left-0 flex flex-col items-start basis-1/4 p-4 font-Inter z-10 bg-white dark:bg-dark-primary shadow-bottom1 dark:shadow-dark-shadow">
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
        <h2 className="font-semibold text-2xl">
          <span className="text-light-primary dark:text-dark-accent opacity-80">
            {countPresentTeachers(teacherWeekTimetable)}{" "}
          </span>{" "}
          teachers are in attendance{" "}
        </h2>
        <p className="text-text_1 dark:text-dark-muted text-sm">
          {" "}
          On April 27, 2024
        </p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {teacherWeekTimetable.map((teacher) => {
          let status = getTeacherStatus(teacher?.instructor?.present);

          return (
            <div className="flex flex-row border-t border-slate-200 dark:border-dark-border odd:bg-slate-50 even:bg-slate-100 dark:odd:bg-dark-secondary dark:even:bg-dark-background1">
              <div className="flex flex-col justify-start items-center py-1 gap-2 px-3 w-1/5">
                <Avatar
                  src={
                    teacher?.instructor?.profile_image
                      ? `${apiDomain}/media/${teacher?.instructor?.profile_image}`
                      : undefined
                  }
                >
                  {teacher.instructor.name.charAt(0)}
                </Avatar>
                <p className="text-xs font-medium font-Inter text-dark-accent dark:text-dark-highlight">
                  {teacher.instructor.teacher_id}
                </p>
              </div>

              <div className="flex flex-row items-between flex-1 py-1">
                <div className="border-x border-slate-200 dark:border-dark-border flex-1 py-1 px-3 flex flex-col justify-center font-Inter">
                  <h2 className="font-medium text-md">
                    {teacher.instructor.name} {teacher.instructor.surname}
                  </h2>
                  <div className="flex flex-wrap flex-row gap-2 items-end">
                    {teacher.instructor.qualified_subjects.map((sub) => (
                      <p className="text-[10px] p-[2px] w-fit px-2 text-nowrap font-semibold font-sans rounded-lg bg-pale_orange bg-opacity-60 text-white dark:bg-dark-secondary dark:text-dark-highlight">
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
                        toggleFullDayLeaveorPresent(
                          teacher.instructor.teacher_id,
                          "leave"
                        )
                      }
                      className="text-sm text-red-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightGreen"
                    >
                      <DoDisturbAltIcon
                        fontSize="small"
                        className="text-red-400 dark:text-dark-error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Mark as full day present">
                    <IconButton
                      size="small"
                      onClick={() => {
                        toggleDrawer("noToggle");
                        toggleFullDayLeaveorPresent(teacher, "present");
                      }}
                      className="text-sm text-green-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightRed"
                    >
                      <CheckIcon
                        fontSize="small"
                        className="text-green-400 dark:text-dark-success"
                      />
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
