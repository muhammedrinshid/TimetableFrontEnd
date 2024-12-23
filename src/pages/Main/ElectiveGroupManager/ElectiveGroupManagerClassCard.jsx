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
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";


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

const ElectiveGroupManagerClassCard = ({
  standard,
  grade,
  handleOpenCreateNewDialog,
  refectClasssroomListdata,
  handleStandardDelete,
}) => {
  const avatarLetter = standard.standard_short_name;
  const avatarColor = getLightColorFromString(standard?.standard_name||"default");
  const { apiDomain, headers } = useAuth();
  const onClickAddNewElectiveGroup = async (standard_id) => {
    console.log(standard_id);

    // try {
    //   const response = await axios.post(
    //     `${apiDomain}/api/class-room/add-division/`,
    //     { standard_id: standard_id },
    //     { headers: headers }
    //   );

    //   if (response.status === 201) {
    //     // Successfully added new division
    //     refectClasssroomListdata();
    //     toast.success("New division added successfully");

    //     // Update the local state with the new division
    //   }
    // } catch (error) {
    //   if (error.response) {
    //     toast.error(
    //       `Error: ${
    //         error.response.data.detail ||
    //         "An error occurred while adding new division"
    //       }`
    //     );
    //   } else if (error.request) {
    //     toast.error("No response received from server");
    //   } else {
    //     toast.error("Error in setting up the request");
    //   }
    //   console.error("Error adding new division:", error);
    // }
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
          {standard?.standard_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {standard?.electives_groups?.length}{" "}
          {standard?.electives_groups?.length === 1 ? "Group" : "Groups"}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Tooltip title="Add new Group" arrow>
          <IconButton
            aria-label="add Group"
            onClick={() => handleOpenCreateNewDialog(standard.standard_id)}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
  
   
      </Box>
    </Card>
  );
};

export default ElectiveGroupManagerClassCard;
