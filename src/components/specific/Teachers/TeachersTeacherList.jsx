import React, { useState } from "react";
import {
  CustomSelect,
  RandomColorChip,
  SearchInput,
  StyledAvatarGroup,
} from "../../Mui components";
import { SortMenu } from "../../specific/Teachers";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CreateIcon from "@mui/icons-material/Create";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ReactCardFlip from "react-card-flip";

import { useAuth } from "../../../context/Authcontext";
import TeacherDetails from "./TeacherDetails";
import TeachersList from "./TeachersList";

const TeachersTeacherList = ({
  teachers,
  handleChange,
  setSelectedTeacherForUpdation,
  setIsDeleteTeacherPopupOpen,
  grades
}) => {
  const [selectedTeacher, setISelectedTeacher] = useState({
    isopen: false,
  });

  return (
    <ReactCardFlip
      containerClassName="col-start-1 col-end-2 row-start-1 row-end-3 overflow-auto "
      isFlipped={selectedTeacher.isopen}
      flipDirection="vertical"
    >
      <TeachersList
        selectedTeacher={selectedTeacher}
        setISelectedTeacher={setISelectedTeacher}
        teachers={teachers}
        handleChange={handleChange}
        setSelectedTeacherForUpdation={setSelectedTeacherForUpdation}
        setIsDeleteTeacherPopupOpen={setIsDeleteTeacherPopupOpen}
        grades={grades}

      />
      <TeacherDetails
        selectedTeacher={selectedTeacher}
        setISelectedTeacher={setISelectedTeacher}
      />
    </ReactCardFlip>
  );
};

export default TeachersTeacherList;
