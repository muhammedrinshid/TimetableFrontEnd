import React, { useEffect, useState } from "react";
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
import { defaultAvatarImage } from "../../../assets/images";

import DeleteConfirmationPopup from "../../common/DeleteConfirmationPopup";
import RandomColorChip2 from "../../Mui components/RandomColorChip2";
import { useAuth } from "../../../context/Authcontext";

const TeachersList = ({
  filteredAndSortedTeachers,
  setISelectedTeacher,
  setSelectedTeacherForUpdation,
  selectedTeacher,
  setIsDeleteTeacherPopupOpen,
  levels,
  setLevelType,
  setSearchTerm,
  levelType,
  searchTerm,
  setSortType,
  
}) => {
  
  const { apiDomain, headers } = useAuth();

  const iconStyle = {
    color: "#555555", // Change this to your desired color
  };
  const options = levels?.map((level) => ({
    value: level.id,
    label: level.short_name,
  }));
  const handleLevelChange = (value) => {
    setLevelType(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const handleSelectedTeacher = (teacher_id, index) => {
    let teacher = filteredAndSortedTeachers.find((teacher) => teacher.teacher_id === teacher_id);
    console.log(selectedTeacher);
    setISelectedTeacher((prev) => ({ ...teacher, isopen: true, index: index }));
  };

  


  const handleUpdataSelection = (teacher) => {
    setSelectedTeacherForUpdation(() => ({
      ...teacher,
      isOpen: true,
    }));
  };

  return (
    <div className="h-full w-full overflow-auto   flex flex-col">
      {/* heading section */}
      <div className=" flex flex-row justify-between items-center my-4 py-4">
        <h2 className="text-3xl font-Inter font-semibold">Teachers Team</h2>

        <div className="bg-white rounded-3xl p-2 px-4 shadow-custom-8">
          <StyledAvatarGroup max={4}>
            {filteredAndSortedTeachers.map((teacher) => (
              <Avatar
                alt={teacher?.name}
                sx={{ width: 30, height: 30, fontSize: 20 }}
                src={
                  teacher.profile_image &&
                  `${apiDomain}${teacher.profile_image}`
                }
              />
            ))}
          </StyledAvatarGroup>
        </div>
      </div>
      {/* controle section */}
      <div className="relative flex flex-row justify-start gap-10 ">
        <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
        </div>
        <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
          <CustomSelect
            value={levelType}
            onChange={handleLevelChange}
            options={options}
          />{" "}
        </div>
        <div className="p-1 bg-white rounded-2xl  shadow-custom-8">
          <SortMenu setSortType={setSortType} />
        </div>
      </div>
      <div className="  grid md:grid-cols-[repeat(2,_minmax(120px,_1fr))] xl:grid-cols-[repeat(4,_minmax(150px,_1fr))] lg:grid-cols-[repeat(3,_minmax(120px,_1fr))] 2xl:grid-cols-[repeat(5,_minmax(170px,_1fr))] gap-6 overflow-auto mt-5 pr-4">
        {filteredAndSortedTeachers?.map((teacher, index) => {
          return (
            <div className="shadow-custom-8 rounded-2xl bg-white p-3  flex flex-col items-center justify-between ">
              <div className="flex flex-row justify-end w-full">
                <div className="py-1 px-2 w-fit bg-gray-200 text-gray-500 text-vs rounded-lg ">
                  {teacher?.teacher_id}
                </div>
              </div>
              <Avatar
                sx={{
                  width: 65,
                  height: 65,
                  border: "0.9px solid lightgray",
                }}
                src={
                  teacher.profile_image
                    ? `${apiDomain}${teacher.profile_image}`
                    : defaultAvatarImage
                }
              ></Avatar>
              <h2 className="text-base mt-2 font-semibold">{teacher.name}</h2>
              <h4 className="text-sm font-medium text-text_1">
                {teacher.surname}
              </h4>
              <div className="flex flex-row gap-1 flex-wrap mt-2">
                {teacher.qualified_subjects_display?.map((subject) => (
                  <RandomColorChip subject={subject.name} />
                ))}
              </div>
              <div className="flex flex-row gap-1 flex-wrap mt-2">
                {teacher.levels_display?.map((level) => (
                  <RandomColorChip2 subject={level.short_name} />
                ))}
              </div>
              <div className="flex flex-row mt-8 justify-between gap-5">
                {/* Expand Button */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-400">Edit</p>

                  <IconButton
                    aria-label="expand"
                    size="small"
                    style={iconStyle}
                    onClick={() => handleUpdataSelection(teacher)}
                  >
                    <CreateIcon fontSize="small" />
                  </IconButton>
                </div>

                {/* Delete Button */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-400">Delete</p>

                  <IconButton
                    aria-label="expand"
                    size="small"
                    style={iconStyle}
                    onClick={() => setIsDeleteTeacherPopupOpen(teacher?.id)}
                  >
                    <PersonRemoveIcon fontSize="small" />
                  </IconButton>
                </div>
                {/* Update Button */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-400">More</p>

                  <IconButton
                    aria-label="expand"
                    size="small"
                    style={iconStyle}
                    onClick={() =>
                      handleSelectedTeacher(teacher.teacher_id, index)
                    }
                  >
                    <AspectRatioIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeachersList;
