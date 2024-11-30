import React from "react";
import TeacherWeeklyTimeTableComponent from "../../../components/specific/Teachers/TeacherWeeklyTimeTableComponent";
import { Dialog, DialogContent, DialogActions, Button, Avatar, Typography, Box } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";

const TeacherTimetableDialog = ({ teacherWeeklyTimetable, handleClose, open, timetableDaySchedules, dialogState }) => {
  const { apiDomain } = useAuth();

  const teacher = dialogState?.teacherDetail;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "16px 24px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Avatar
          alt={teacher?.full_name || "Teacher"}
          src={teacher?.profile_image ? `${apiDomain}${teacher.profile_image}` : undefined}
        />
        <Typography variant="h6" component="div">
          {teacher ? `${teacher.name} ${teacher.surname}` : "Teacher Weekly Timetable"}
        </Typography>
      </Box>
      <DialogContent>
        {teacherWeeklyTimetable && timetableDaySchedules ? (
          <TeacherWeeklyTimeTableComponent
            teacherWeeklyTimetable={teacherWeeklyTimetable}
            timetableDaySchedules={timetableDaySchedules}
            TeacherDetails={teacher}
          />
        ) : (
          "Loading timetable..."
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherTimetableDialog;
