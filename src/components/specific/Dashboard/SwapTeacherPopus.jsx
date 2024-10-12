import React, { useEffect, useState } from "react";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import { StyledBadge } from "../../Mui components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useAuth } from "../../../context/Authcontext";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SwapTeacherPopus = ({
  whoWantSwap,
  swapPopup,
  setSwapPopup,
  whichOnSwap,
  setStudentWeekTimetable,
  setTeacherWeekTimetable,
  studentWeekTimetable,
  teacherWeekTimetable,
  selectedDate,
}) => {
  const { apiDomain } = useAuth();
  // the teacher who want swap
  const teacher1 = whoWantSwap?.teacherDetails;
  // the teacher who will place
  const teacher2 = whichOnSwap?.teacherDetails;
  const sessionIndx = whoWantSwap?.session;
  const classdeatails =
    whoWantSwap?.teacherDetails?.sessions[sessionIndx]?.class_details[0];

  const [seconTeacherSubject, setseconTeacherSubject] = useState({
    index: -1,
    name: "",
  });

  useEffect(() => {}, [whoWantSwap, whichOnSwap]);

  const handleChange = (event) => {
    setseconTeacherSubject({
      index: event.target.value,
      name: teacher2?.instructor?.qualified_subjects[event.target.value]?.name ||"",
    });
  };

  const onSwapSubmit = () => {
    // Create a copy of the current state to apply changes temporarily
    const newClassRooms = [...studentWeekTimetable];
    const newTeachers = [...teacherWeekTimetable];

    // // Find the class room and update its periods
    // const updatedClassRooms = newClassRooms.map((class_room) =>
    //   class_room.class_id === whoWantSwap.class_id
    //     ? {
    //         ...class_room,
    //         periods: class_room.periods.map((period, ind) =>
    //           ind === whoWantSwap.session
    //             ? {
    //                 teacher_id: teacher2.teacher_id,
    //                 subject: teacher2.qualified_subjects[seconTeacherSubject],
    //               }
    //             : period
    //         ),
    //       }
    //     : class_room
    // );

    // // Update teacher1's class_slot and class_subject
    //  const updatedTeachers = newTeachers.map((teacher) =>
    //    teacher.teacher_id === teacher1.teacher_id
    //      ? {
    //          ...teacher,
    //          sessions: teacher.sessions.map((session, index) =>
    //            index === sessionIndx
    //              ? {
    //                  ...session,
    //                  subject: null,
    //                  type: null,
    //                  elective_subject_name: null,
    //                  room: null,
    //                  class_details: null,
    //                }
    //              : session
    //          ),
    //        }
    //      : teacher.teacher_id === teacher2.teacher_id
    //      ? {
    //          ...teacher,
    //          sessions: teacher.sessions.map((session, index) =>
    //            index === sessionIndx
    //              ? {
    //                  ...session,
    //                  subject: seconTeacherSubject,
    //                  type: "Core",
    //                  elective_subject_name: seconTeacherSubject,
    //                  room: teacher1.sessions[sessionIndx].class_details,
    //                  class_details: teacher1.sessions[sessionIndx].class_details,
    //                }
    //              : session
    //          ),
    //        }
    //      : teacher
    //  );

    // // Update teacher2's class_slot and class_subject
    // const updatedTeachersForTeacher2 = updatedTeachersForTeacher1.map(
    //   (teacher) =>
    //     teacher.teacher_id === teacher2.teacher_id
    //       ? {
    //           ...teacher,
    //           class_slot: teacher.class_slot.map((slot, ind) =>
    //             ind === whoWantSwap.session ? whoWantSwap.class_id : slot
    //           ),
    //           class_subject: teacher.class_subject.map((sub, ind) =>
    //             ind === whoWantSwap.session ? seconTeacherSubject : sub
    //           ),
    //         }
    //       : teacher
    // );

    if (teacher1.sessions[sessionIndx].type == "Core") {
      const updatedTeachers = newTeachers.map((teacher) => {
        return teacher?.instructor?.teacher_id ===
          teacher1?.instructor?.teacher_id
          ? {
              ...teacher,
              sessions: teacher.sessions.map((session, index) =>
                index === sessionIndx
                  ? {
                      ...session,
                      subject: null,
                      type: null,
                      elective_subject_name: null,
                      room: null,
                      class_details: null,
                    }
                  : session
              ),
            }
          : teacher?.instructor?.teacher_id === teacher2?.instructor?.teacher_id
          ? {
              ...teacher,
              sessions: teacher.sessions.map((session, index) =>
                index === sessionIndx
                  ? {
                      ...teacher1.sessions[sessionIndx],
                      subject: seconTeacherSubject.name,
                      elective_subject_name: seconTeacherSubject.name,
                    }
                  : session
              ),
            }
          : teacher;
      });
      setTeacherWeekTimetable(updatedTeachers);
      setseconTeacherSubject({ index: -1, name: "" });
    } else {
      if (
        teacher1.sessions[sessionIndx].subject !== seconTeacherSubject.name
      ) {
        // If subjects don't match, show a toast notification and return early
    
        toast.info("Subjects don't match for swapping");
        return null;
      }

      // Get all class IDs for the session's class distribution
      const involvedClassIds = teacher1.sessions[sessionIndx].class_details.map(
        (detail) => detail.id
      );

      // Update teacher week timetable
      const updatedTeachers = newTeachers.map((teacher) => {
        if (
          teacher?.instructor?.teacher_id === teacher1?.instructor?.teacher_id
        ) {
          return {
            ...teacher,
            sessions: teacher.sessions.map((session, index) =>
              index === sessionIndx
                ? {
                    subject: null,
                    type: null,
                    elective_subject_name: null,
                    room: null,
                    class_details: null,
                  }
                : session
            ),
          };
        } else if (
          teacher?.instructor?.teacher_id === teacher2?.instructor?.teacher_id
        ) {
          return {
            ...teacher,
            sessions: teacher.sessions.map((session, index) =>
              index === sessionIndx
                ? {
                    ...teacher1.sessions[sessionIndx],
                  }
                : session
            ),
          };
        }
        return teacher;
      });

      // Update student week timetable
      const updatedStudentTimetable = newClassRooms.map((classroom) => {
        if (involvedClassIds.includes(classroom.classroom.id)) {
          return {
            ...classroom,
            sessions: classroom.sessions.map((session, index) => {
              if (index === sessionIndx) {
                return {
                  ...session,
                  class_distribution: session.class_distribution.map(
                    (distribution) => {
           
                      if (
                        distribution.teacher.id === teacher1.instructor.id
                      ) {
                        return {
                          ...distribution,
                          teacher: {
                            name: teacher2.instructor.name,
                            profile_image: teacher2.instructor.profile_image,
                          },
                        };
                      }
                      return distribution;
                    }
                  ),
                };
              }
              return session;
            }),
          };
        }
        return classroom;
      });

      setTeacherWeekTimetable(updatedTeachers)
      setStudentWeekTimetable(updatedStudentTimetable)
    }

    // Now apply all the updates if they are successful
    // setStudentWeekTimetable(updatedClassRooms);

    // Close the swap popup
    setSwapPopup(false);
  };

  return (
    <Dialog
      open={swapPopup}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setSwapPopup(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        {"Move " +
          teacher1?.instructor?.name +
          " from Session-" +
          (whoWantSwap.session + 1) +
          " of Class " +
          classdeatails?.standard +
          classdeatails?.division}
      </DialogTitle>
      <DialogContent>
        <div className=" p-3 w-full border flex justify-center gap-10 items-center">
          <div className="bg-white rounded-md   h-full flex flex-col justify-between overflow-hidden  items-center gradient_4 p-4  ">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              status={"leave"}
            >
              <Avatar
                sx={{
                  border: "0.1px solid lightgray",
                  width: 56,
                  height: 56,
                }}
                src={
                  teacher1?.instructor?.profile_image
                    ? `${apiDomain}/${teacher1?.instructor?.profile_image}`
                    : undefined
                }
                variant=""
              >
                {teacher1?.instructor?.name?.charAt(0)}
              </Avatar>
            </StyledBadge>
            <p className="text-vs font-bold text-text_2 mt-2">
              {teacher1?.instructor?.teacher_id}
            </p>

            <h1
              className={` text-nowrap text-center justify-center inline my-1 text-base font-semibold  text-opacity-80         `}
            >
              {teacher1?.instructor?.name}
            </h1>
            <h2 className="text-xs font-bold text-dark-secondary text-opacity-90 font-Roboto text-center">
              {whoWantSwap?.subject}
            </h2>
          </div>
          <div className="w-1/12 text-center">
            <IconButton>
              <SwapHorizOutlinedIcon fontSize="large" />
            </IconButton>
          </div>

          <div className="bg-white rounded-md pt-1  h-full flex flex-col justify-between overflow-hidden  items-center gradient_3 p-3 ">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              status={"free"}
            >
              <Avatar
                sx={{
                  border: "0.1px solid lightgray",
                  width: 56,
                  height: 56,
                }}
                src={
                  teacher2?.instructor?.profile_image
                    ? `${apiDomain}/${teacher2?.instructor?.profile_image}`
                    : undefined
                }
                variant=""
              >
                {teacher2?.instructor?.name.charAt(0)}
              </Avatar>
            </StyledBadge>
            <p className="text-vs font-bold text-text_2 mt-2">
              {teacher2?.instructor?.teacher_id}
            </p>

            <h1
              className={` text-nowrap text-center justify-center inline my-1 text-base font-semibold  text-opacity-80         `}
            >
              {teacher2?.instructor?.name}
            </h1>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Subject</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={seconTeacherSubject.index}
                label="seconTeacherSubject"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value={-1}>
                  <em>None</em>
                </MenuItem>
                {teacher2?.instructor.qualified_subjects?.map((sub, ind) => (
                  <MenuItem value={ind}>{sub?.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <DialogContentText id="alert-dialog-slide-description">
          Do you really want to change the {classdeatails?.standard}
          {"-"}
          {classdeatails?.division} standard session- {whoWantSwap?.session + 1}{" "}
          on {selectedDate?.getDate()}{" "}
          {selectedDate?.toLocaleString("default", { month: "long" })} from{" "}
          {whoWantSwap?.subject} with {teacher1?.instructor?.name} to{" "}
          {seconTeacherSubject.name} with {teacher2?.instructor?.name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSwapPopup(false)}>Cancel</Button>
        <Button
          disabled={seconTeacherSubject.index === -1 ? true : false}
          onClick={() =>
            onSwapSubmit({
              class_id: whoWantSwap.class_id,
              session: whoWantSwap.session,
              subject_ind: seconTeacherSubject.index,
            })
          }
        >
          Swap
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwapTeacherPopus;
