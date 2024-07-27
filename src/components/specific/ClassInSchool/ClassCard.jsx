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

const getRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const ClassCard = ({
  standard,
  grade,
  openAssignTeacherForm,
  refectClasssroomListdata,
  handleStandardDelete,
}) => {
  const avatarLetter = standard.short_name;
  const avatarColor = getRandomLightColor();
  const { apiDomain, headers } = useAuth();
  const onClickAddNewDivision = async (standard_id) => {
    console.log(standard_id);

    try {
      const response = await axios.post(
        `${apiDomain}/api/class-room/add-division/`,
        { standard_id: standard_id },
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
          {standard.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {standard?.classrooms?.length}{" "}
          {standard?.classrooms?.length === 1 ? "Division" : "Divisions"}
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
            onClick={() => onClickAddNewDivision(standard.id)}
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
                grade_id: grade.id,
                standard_id: standard?.id,
                type: "all",
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
            onClick={() => handleStandardDelete(standard.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default ClassCard;
