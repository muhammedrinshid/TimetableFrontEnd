import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import { Avatar, IconButton, Tooltip ,Skeleton} from "@mui/material";
import { StatusChip, StyledAvatarGroup } from "../../Mui components";
import { useAuth } from "../../../context/Authcontext";
import EmptyTeacherAttendanceState from "../../empty state management components/EmptyTeacherAttendanceState";

const TeacherAttendanceSkeletonLoader = () => {
  return (
    <div className="overflow-y-auto relative bg-white dark:bg-dark-background text-slate-700 dark:text-dark-text h-full rounded-lg">
      {/* Skeleton Header */}
      <div className="sticky top-0 left-0 flex items-center justify-between p-3 font-Inter z-10 bg-white dark:bg-dark-primary shadow-bottom1 dark:shadow-dark-shadow">
        <div className="flex items-center space-x-4 w-full">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton 
                key={index} 
                variant="circular" 
                width={30} 
                height={30} 
                className="mr-1"
              />
            ))}
          </div>
          <div className="flex-1">
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={15} />
          </div>
        </div>
      </div>

      {/* Skeleton List Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex flex-row border-t border-slate-200 dark:border-dark-border odd:bg-slate-50 even:bg-slate-100 dark:odd:bg-dark-secondary dark:even:bg-dark-background1 py-2"
          >
            {/* Avatar and ID */}
            <div className="flex flex-col justify-start items-center py-2 gap-1 px-3 w-1/5">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="60%" height={15} />
            </div>

            {/* Teacher Name and Subjects */}
            <div className="flex flex-row items-between flex-1 py-2">
              <div className="border-x border-slate-200 dark:border-dark-border flex-1 py-1 px-3 flex flex-col justify-center">
                <Skeleton variant="text" width="50%" height={20} />
                <div className="flex flex-wrap flex-row gap-1 items-end mt-1">
                  {[1, 2].map((subject) => (
                    <Skeleton 
                      key={subject} 
                      variant="rectangular" 
                      width={50} 
                      height={15} 
                      className="rounded-lg mr-1"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Status and Action */}
            <div className="w-1/4 py-3 px-2 flex flex-col items-center">
              <Skeleton variant="rectangular" width={80} height={24} className="rounded-full mb-2" />
              <Skeleton variant="circular" width={30} height={30} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeacherAttendanceStatus = ({
  teacherWeekTimetable,

  teachersLoading,
  countPresentTeachers,
  getTeacherStatus,
  toggleFullDayLeaveorPresent,
}) => {
  const { apiDomain } = useAuth();
  if (teachersLoading) {
    return <TeacherAttendanceSkeletonLoader />;
  }
  return (
    <div className="overflow-y-auto relative bg-white dark:bg-dark-background text-slate-700 dark:text-dark-text h-full rounded-lg">
      {/* Redesigned Compact Header */}
      <div className="sticky top-0 left-0 flex items-center justify-between p-3 font-Inter z-10 bg-white dark:bg-dark-primary shadow-bottom1 dark:shadow-dark-shadow">
        <div className="flex items-center space-x-4">
          <StyledAvatarGroup max={4} className="mr-2">
            {teacherWeekTimetable.map((teacher) => (
              <Avatar
                key={teacher?.instructor.teacher_id}
                alt={teacher?.instructor.name}
                sx={{ width: 30, height: 30, fontSize: 10 }}
                src={
                  teacher?.instructor?.profile_image
                    ? `${apiDomain}/${teacher?.instructor?.profile_image}`
                    : undefined
                }
              />
            ))}
          </StyledAvatarGroup>
          <div>
            <div className="text-sm font-medium">
              <span className="text-light-primary dark:text-dark-accent">
                {countPresentTeachers(teacherWeekTimetable)}
              </span>{" "}
              teachers present
            </div>
            <div className="text-xs text-gray-500 dark:text-dark-muted">
              April 27, 2024
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {teacherWeekTimetable.length === 0 ? (
          <EmptyTeacherAttendanceState />
        ) : (
          teacherWeekTimetable.map((teacher) => {
            let status = getTeacherStatus(teacher?.instructor?.present);

            return (
              <div
                className="flex flex-row border-t border-slate-200 dark:border-dark-border odd:bg-slate-50 even:bg-slate-100 dark:odd:bg-dark-secondary dark:even:bg-dark-background1"
                key={teacher.instructor.teacher_id}
              >
                <div className="flex flex-col justify-start items-center py-2 gap-1 px-3 w-1/5">
                  <Avatar
                    sx={{ width: 40, height: 40 }}
                    src={
                      teacher?.instructor?.profile_image
                        ? `${apiDomain}/${teacher?.instructor?.profile_image}`
                        : undefined
                    }
                  >
                    {teacher.instructor.name.charAt(0)}
                  </Avatar>
                  <p className="text-xs font-medium font-Inter text-dark-accent dark:text-dark-highlight">
                    {teacher.instructor.teacher_id}
                  </p>
                </div>

                <div className="flex flex-row items-between flex-1 py-2">
                  <div className="border-x border-slate-200 dark:border-dark-border flex-1 py-1 px-3 flex flex-col justify-center font-Inter">
                    <h2 className="font-medium text-md">
                      {teacher.instructor.name} {teacher.instructor.surname}
                    </h2>
                    <div className="flex flex-wrap flex-row gap-1 items-end">
                      {teacher.instructor.qualified_subjects.map((sub) => (
                        <p
                          className="text-[9px] p-[1px] w-fit px-1 text-nowrap font-semibold font-sans rounded-lg bg-pale_orange bg-opacity-60 text-white dark:bg-dark-secondary dark:text-dark-highlight"
                          key={sub.id}
                        >
                          {sub.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-1/4 py-3 px-2 flex flex-col items-center">
                  <StatusChip status={status} />
                  {status === "present" ? (
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
                          toggleFullDayLeaveorPresent( teacher.instructor.teacher_id, "present");
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
          })
        )}
      </div>
    </div>
  );
};

export default TeacherAttendanceStatus;