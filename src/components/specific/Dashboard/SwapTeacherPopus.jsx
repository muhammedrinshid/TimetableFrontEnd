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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SwapTeacherPopus = ({
  whoWantSwap,
  findTaecherById,
  swapPopup,
  setSwapPopup,
  findClassById,
  whichOnSwap,
  setClassRooms,
  setTeachers,
  class_rooms,
  teachers,
  selectedDate,
}) => {
  const { apiDomain } = useAuth();
  const teacher1 = whoWantSwap?.teacherDetails;
  const teacher2 = whichOnSwap?.teacherDetails;
  const classdeatails =
    whoWantSwap?.teacherDetails?.sessions[whoWantSwap?.session]
      ?.class_details[0];

  const [seconTeacherSubject, setseconTeacherSubject] = useState(-1);

  useEffect(() => {}, [whoWantSwap, whichOnSwap]);

  const handleChange = (event) => {
    setseconTeacherSubject(event.target.value);
  };

  const onSwapSubmit = () => {
    // Create a copy of the current state to apply changes temporarily
    const newClassRooms = [...class_rooms];
    const newTeachers = [...teachers];

    // Find the class room and update its periods
    const updatedClassRooms = newClassRooms.map((class_room) =>
      class_room.class_id === whoWantSwap.class_id
        ? {
            ...class_room,
            periods: class_room.periods.map((period, ind) =>
              ind === whoWantSwap.session
                ? {
                    teacher_id: teacher2.teacher_id,
                    subject: teacher2.qualified_subjects[seconTeacherSubject],
                  }
                : period
            ),
          }
        : class_room
    );

    // Update teacher1's class_slot and class_subject
    const updatedTeachersForTeacher1 = newTeachers.map((teacher) =>
      teacher.teacher_id === teacher1.teacher_id
        ? {
            ...teacher,
            class_slot: teacher.class_slot.map((slot, ind) =>
              ind === whoWantSwap.session ? null : slot
            ),
            class_subject: teacher.class_subject.map((sub, ind) =>
              ind === whoWantSwap.session ? null : sub
            ),
          }
        : teacher
    );

    // Update teacher2's class_slot and class_subject
    const updatedTeachersForTeacher2 = updatedTeachersForTeacher1.map(
      (teacher) =>
        teacher.teacher_id === teacher2.teacher_id
          ? {
              ...teacher,
              class_slot: teacher.class_slot.map((slot, ind) =>
                ind === whoWantSwap.session ? whoWantSwap.class_id : slot
              ),
              class_subject: teacher.class_subject.map((sub, ind) =>
                ind === whoWantSwap.session ? seconTeacherSubject : sub
              ),
            }
          : teacher
    );

    // Now apply all the updates if they are successful
    setClassRooms(updatedClassRooms);
    setTeachers(updatedTeachersForTeacher2);

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
          classdeatails?.grade +
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
                    ? `${apiDomain}/media/${teacher1?.instructor?.profile_image}`
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
                    ? `${apiDomain}/media/${teacher2?.instructor?.profile_image}`
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
                value={seconTeacherSubject}
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
          Do you really want to change the {classdeatails?.grade}
          {"-"}
          {classdeatails?.division} grade session- {whoWantSwap?.session + 1}{" "}
          on {selectedDate?.getDate()}{" "}
          {selectedDate?.toLocaleString("default", { month: "long" })}{" "}
          from {whoWantSwap?.subject} with {teacher1?.instructor?.name} to{" "}
          {seconTeacherSubject} with {teacher2?.instructor?.name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSwapPopup(false)}>Cancel</Button>
        <Button
          disabled={seconTeacherSubject === -1 ? true : false}
          onClick={() =>
            onSwapSubmit({
              class_id: whoWantSwap.class_id,
              session: whoWantSwap.session,
              subject_ind: seconTeacherSubject,
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
