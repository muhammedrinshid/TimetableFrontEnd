import React from "react";
import { CustomChip, StyledBadge } from "../../Mui components";
import { Avatar, IconButton } from "@mui/material";
import { RiSwap2Line } from "react-icons/ri";
import { useAuth } from "../../../context/Authcontext";

const FreeTeacherOnaSession = ({
  toggleDrawer,
  selectedSession,
  whoWantSwap,
  teachers,
  setSwapPopup,
  setWhichOnSwap,
}) => {
  const { apiDomain } = useAuth();
  const openSwapConfirmation = (teacherDetails) => {
    // const teacher2=findTaecherById(teacher_id)
    // const teacher1=findTaecherById(whoWantSwap.teacher_id)
    setWhichOnSwap((prev) => ({ ...prev, teacherDetails: teacherDetails }));
    setSwapPopup(true);
  };

  return (
    <div className="relative col-start-3 col-end-4 row-start-3 row-end-4 shadow_box overflow-hidden flex flex-col items-start dark:bg-dark-background1  bg-light-background1  rounded-lg shadow-sm bg-opacity-60">
      {/* heading section */}
      <div className="p-2 shadow-bottom1 dark:shadow-dark-shadow bg-white w-full">
        <p className="text-lg font-medium text-dark-secondary dark:text-dark-text mt-1 ml-2">
          for Session-{selectedSession + 1}
        </p>
        <p className="ml-3 text-xs font-medium font-Inter text-light-highlight dark:text-dark-highlight">
          22-04-2023
        </p>
      </div>

      {/* assignment of each teacher in a specific session */}
      <div className="overflow-x-auto w-full px-4">
        {teachers.map((teacher) => {
          const isEngaged = teacher.sessions[selectedSession].subject;
          const isLeave = !teacher.instructor.present[selectedSession];
          const status = isLeave ? "leave" : isEngaged ? "engaged" : "free";
          const classRoom = teacher.sessions[selectedSession].room;

          return (
            <div className="w-full mb-2 grid grid-cols-[2fr_1fr] gap-1">
              <div className="rounded-sm border-[0.5px] dark:border-dark-border flex flex-row p-1 gap-2 items-center dark:bg-dark-background">
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  status={status}
                >
                  <Avatar
                    sx={{
                      border: "0.1px solid lightgray",
                    }}
                    src={
                      teacher?.instructor?.profile_image
                        ? `${apiDomain}/${teacher?.instructor?.profile_image}`
                        : undefined
                    }
                    variant=""
                  >
                    {teacher.instructor.name.charAt(0)}
                  </Avatar>
                </StyledBadge>

                <div className="pl-2 border-l dark:border-dark-border">
                  <h2 className="text-base font-medium font-Inter dark:text-dark-text">
                    {teacher.instructor.name} {teacher.instructor.surname}
                  </h2>
                  <p className="text-vs font-Inter text-text_2 dark:text-dark-muted">
                    {teacher.instructor.teacher_id}
                  </p>
                </div>
              </div>
              <div className="rounded-sm border dark:border-dark-border p-1 text-center dark:bg-dark-background">
                <CustomChip
                  label={status}
                  status={status}
                  size="small"
                  variant="outlined"
                />
                <h1 className="text-sm mt-1 font-semibold text-dark-accent dark:text-dark-accent">
                  {classRoom?.room_number || "No class"}
                </h1>
              </div>
            </div>
          );
        })}
      </div>

      {/* free teacher picking or swapping for a leave teacher appear here */}
      {whoWantSwap?.isOpen && (
        <div
          className={`absolute p-2 rounded-lg shadow-custom-1 dark:shadow-dark-shadow flex flex-col items-center bottom-0 left-0 w-full bg-white dark:bg-dark-background transition-all duration-500 z-10 ${
            whoWantSwap.isOpen ? "h-full" : "-z-10 h-0"
          }`}
        >
          <div
            onClick={() => toggleDrawer()}
            className="w-8 h-3 rounded-md bg-slate-300 dark:bg-dark-muted cursor-pointer"
          ></div>
          <p className="text-dark-accent dark:text-dark-accent font-normal my-2">
            Teachers are not in session-{whoWantSwap?.session}
          </p>
          <div className="overflow-y-auto w-full">
            {teachers
              ?.filter((teacher) => {
                const sessionType =
                  whoWantSwap.teacherDetails.sessions[whoWantSwap.session]
                    ?.type;
                const sessionSubject =
                  whoWantSwap.teacherDetails.sessions[whoWantSwap.session]
                    ?.subject;
                console.log(sessionType);
                const isCoreSession = sessionType === "Elective";
                const teacherQualifiedSubjects =
                  teacher?.instructor?.qualified_subjects?.map(
                    (sub) => sub.name
                  ) || [];

                // Basic conditions
                const isSubjectNull =
                  teacher?.sessions[whoWantSwap.session]?.subject === null;
                const isTeacherPresent =
                  teacher?.instructor?.present[whoWantSwap.session];

                // Apply additional filter only if it's a "Core" session
                if (isCoreSession) {
                  return (
                    isSubjectNull &&
                    isTeacherPresent &&
                    teacherQualifiedSubjects.includes(sessionSubject)
                  );
                }

                // If not a core session, just apply the basic conditions
                return isSubjectNull && isTeacherPresent;
              })

              ?.sort((a, b) => {
                const aPriority = a?.qualified_subjects?.includes(
                  whoWantSwap?.subject
                )
                  ? 0
                  : 1;
                const bPriority = b?.qualified_subjects?.includes(
                  whoWantSwap?.subject
                )
                  ? 0
                  : 1;
                if (aPriority == 1 && bPriority == 1) {
                  return 0;
                }
                if (aPriority == 1) {
                  return 1;
                }
                if (bPriority == 1) {
                  return -1;
                }
                return 0;
              })
              ?.map((teacher) => {
                const isEngaged = teacher.sessions[whoWantSwap?.session];
                const isLeave =
                  !teacher.instructor.present[whoWantSwap?.session];
                const status = isLeave
                  ? "leave"
                  : isEngaged
                  ? "engaged"
                  : "free";

                return (
                  <div className="w-full mb-2 flex flex-row">
                    <div className="w-full rounded-sm border-[0.5px] dark:border-dark-border flex flex-row p-1 gap-2 items-center dark:bg-dark-background">
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        status={status}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            boxShadow: 1,
                            border: "2px solid #fff",
                          }}
                          src={
                            teacher?.instructor?.profile_image
                              ? `${apiDomain}/${teacher?.instructor?.profile_image}`
                              : undefined
                          }
                          variant=""
                        >
                          {teacher?.instructor?.name?.charAt(0)}
                        </Avatar>
                      </StyledBadge>

                      <div className="pl-2 border-l dark:border-dark-border">
                        <h2 className="text-base font-medium font-Inter dark:text-dark-text">
                          {teacher?.instructor?.name}{" "}
                          {teacher?.instructor?.surname}
                        </h2>
                        <div className="flex flex-wrap flex-row gap-2 items-end">
                          {teacher?.instructor?.qualified_subjects.map(
                            (sub) => (
                              <p
                                className={`${
                                  sub === whoWantSwap.subject
                                    ? "bg-lime-500"
                                    : "bg-gray-500 dark:bg-dark-muted"
                                } text-[10px] p-[2px] w-fit px-2 text-nowrap font-semibold bg-opacity-60 text-white dark:text-dark-text font-sans rounded-lg`}
                              >
                                {sub?.name}
                              </p>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row justify-end flex-1 pr-2">
                        <IconButton
                          onClick={() => openSwapConfirmation(teacher)}
                        >
                          <RiSwap2Line className="text-dark-accent dark:text-dark-accent" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTeacherOnaSession;
