import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useAuth } from "../../../context/Authcontext";
const getCharLightColor = (char) => {
  const singleChar = char.charAt(0);
  
  // Get the character code
  const charCode = singleChar.charCodeAt(0);
  
  // Use a prime number to create more spread in the color space
  const prime = 31;
  const hash = (charCode * prime) % 360;
  
  // Generate pastel colors by using high lightness and medium saturation
  return `hsl(${hash}, 70%, 80%)`;

};

const DivisionCard = ({
  setISelectedClassforView,
  division,
  handleClassroomDelete,
  standard_id,
  openEditCalssroomForm,
  classroom_name,
  grade,
  index,
}) => {
  const { totalperiodsInWeek } = useAuth();
  const avatarLetter = division.division;
  const avatarColor = getCharLightColor(avatarLetter||"c");
  const progressPercentage =
    (parseInt(division?.lessons_assigned_subjects) / totalperiodsInWeek) * 100;
  const openClassroomEnlargedView = () => {
    setISelectedClassforView({
      isOpen: true,
      id: division?.id,
      standard_id: standard_id,
      gradeId: grade.id,
      index: index,
    });
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        mb: 2,
        boxShadow: 3,
        borderRadius: 4,
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: avatarColor,
          color: "text.primary",
          width: 60,
          height: 60,
          mb: 2,
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        {avatarLetter}
      </Avatar>
      <CardContent
        sx={{ textAlign: "center", p: "0 !important", mb: 2, width: "100%" }}
      >
        <Typography component="div" variant="h6" fontWeight="bold">
          {division.divisionName}
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Typography variant="body2" color="text.secondary" component="div">
            Lessons: {division?.lessons_assigned_subjects}/{totalperiodsInWeek}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{ mt: 1, height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Tooltip title="Edit division" arrow>
          <IconButton
            aria-label="edit division"
            size="small"
            onClick={() =>
              openEditCalssroomForm({
                gradeId: grade?.id,
                classroomId: division?.id,
                type: "all",
                name:classroom_name||""
              })
            }
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add lesson" arrow>
          <IconButton
            aria-label="add lesson"
            size="small"
            onClick={() => openClassroomEnlargedView()}
          >
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete division" arrow>
          <IconButton
            aria-label="delete division"
            size="small"
            onClick={() => handleClassroomDelete(division.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default DivisionCard;
