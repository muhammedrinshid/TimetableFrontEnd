import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SubjectIcon from "@mui/icons-material/Subject";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import { toast } from "react-toastify";


const getLightColorFromString = (input) => {
  // Hash the input string to get a consistent number
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to generate a hue (0-360)
  const hue = hash % 360;

  // Return a light color with fixed saturation and lightness
  return `hsl(${hue}, 70%, 80%)`;
};

const ClassCard = ({
  grade,
  level,
  openAssignTeacherForm,
  refectClasssroomListdata,
  handleGradeDelete,
}) => {
  const avatarLetter = grade.short_name;
  const avatarColor = getLightColorFromString(grade?.name);
  const { apiDomain, headers } = useAuth();
  const onClickAddNewDivision = async (grade_id) => {
    console.log(grade_id);

    try {
      const response = await axios.post(
        `${apiDomain}/api/class-room/add-division/`,
        { grade_id: grade_id },
        { headers: headers }
      );

      if (response.status === 201) {
        // Successfully added new division
        refectClasssroomListdata();
        toast.success("New division added successfully");

        // Update the local state with the new division
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          `Error: ${
            error.response.data.detail ||
            "An error occurred while adding new division"
          }`
        );
      } else if (error.request) {
        toast.error("No response received from server");
      } else {
        toast.error("Error in setting up the request");
      }
      console.error("Error adding new division:", error);
    }
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
          width: 80,
          height: 80,
          mb: 2,
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        {avatarLetter}
      </Avatar>
      <CardContent sx={{ textAlign: "center", p: "0 !important", mb: 2 }}>
        <Typography component="div" variant="h6" fontWeight="bold">
          {grade.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {grade?.classrooms?.length}{" "}
          {grade?.classrooms?.length === 1 ? "Division" : "Divisions"}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Tooltip title="Add new division" arrow>
          <IconButton
            aria-label="add division"
            onClick={() => onClickAddNewDivision(grade.id)}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Assign subjects to all sections" arrow>
          <IconButton
            aria-label="assign subjects"
            size="small"
            onClick={() =>
              openAssignTeacherForm({
                level_id: level.id,
                grade_id: grade?.id,
                type: "all",
                grade:grade?.name
              })
            }
          >
            <SubjectIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete class" arrow>
          <IconButton
            aria-label="delete class"
            size="small"
            onClick={() => handleGradeDelete(grade.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default ClassCard;
