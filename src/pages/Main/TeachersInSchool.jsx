import React, { useState } from "react";
import { subjectData, teachers1 } from "../../assets/datas";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import TeachersTeacherList from "../../components/specific/Teachers/TeachersTeacherList";
import { RandomColorChip } from "../../components/Mui components";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CreateTeacherForm from "../../components/forms/CreateTeacherForm";
import TeacherUpdateForm from "../../components/forms/TeacherUpdateForm";







const TeachersInSchool = () => {
  const [gradeType, setGradeType] = useState("");
  const [teachers, setTeachers] = useState(teachers1);
  const [subjects, setSubjects] = useState(subjectData);
  


  const handleGradeChange = (event) => {
    setGradeType(event.target.value);
  };
  const [createTeacherFormOpen, setCreateTeacherFormOpen] = useState(false);
  const [selectedTeacherForUpdation, setSelectedTeacherForUpdation] = useState({
    isOpen:false
  });

  const handleCreateTeacherOpen = () => {
    setCreateTeacherFormOpen(true);
  };

  const handleCreateTeacherClose = () => {
    setCreateTeacherFormOpen(false);
  };
  const handleUpdateTeacherClose = () => {
    setSelectedTeacherForUpdation({isOpen:false});
  };
  const tempUpdateTeacher = (data,teacher_id) => {

    setTeachers((prev) => prev.map((teacher)=>teacher.teacher_id===teacher_id?{...teacher,...data}:teacher));
    
  };
  const tempCreateNewTeacher = (data) => {
    setTeachers((prev) => [
      ...prev,
      {
        name: data?.name,
        surname: data?.surname,
        teacher_id: "t002",
        email: data?.email,
        image: data?.image,
        maximum_number_periods_per_week: data?.maxPeriods,
        minimum_number_periods_per_week: data?.minPeriods,
        phone: data?.phone,
        qualified_subjects: data.subjects.map((sub) => sub),
        time_table: {},
      },
    ]);
  };

  return (
    <div className=" grid grid-rows-[10fr_4fr] grid-cols-[6fr_2fr] overflow-auto  pl-6 pr-4 pb-6 gap-4 ">

    
      {/* teachers list placed */}

      <TeachersTeacherList
        gradeType={gradeType}
        handleChange={handleGradeChange}
        teachers={teachers}
        setSelectedTeacherForUpdation={setSelectedTeacherForUpdation}
      />

      {/* overall details */}
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 bg-white rounded-2xl">
        <div className="p-4 ">
          <div className="flex flex-row justify-between p-4 items-center rounded-xl bg-light-primary bg-opacity-90 shadow-custom-1">
            <div className="text-right">
              <h3 className="text-base text-slate-300 font-medium mb-1">
                Registred Teachers
              </h3>
              <h1 className="text-2xl font-semibold text-slate-100">124</h1>
            </div>
            <AccountCircleRoundedIcon
              fontSize="large"
              sx={{
                color: "white",
                fontSize: 60,
              }}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-4 items-stretch justify-start mt-5 p-4">
          {subjects.map((subject) => (
            <Badge color="secondary" badgeContent={subject?.count} max={99}>
              <RandomColorChip subject={subject.subject} />
            </Badge>
          ))}
        </div>
      </div>

      {/* addd new teacher */}
      <div className="col-start-2 col-end-3 row-start-2 row-end-3 bg-white rounded-2xl flex justify-center items-center">
        <div>
          <IconButton onClick={handleCreateTeacherOpen}>
            <AddCircleOutlineRoundedIcon
              sx={{
                color: "#312ECB",
                fontSize: 100,
                opacity: 0.8,
              }}
            />
          </IconButton>
        </div>
      </div>



      {/* Create new teacher pop up */}
      <Dialog open={createTeacherFormOpen} onClose={handleCreateTeacherClose}>
        <DialogTitle>Create New Teacher</DialogTitle>
        <DialogContent>
          <CreateTeacherForm
            handleCreateTeacherClose={handleCreateTeacherClose}
            tempCreateNewTeacher={tempCreateNewTeacher}
            subjects={subjects}
          />
        </DialogContent>
      </Dialog>


      {/* update existing teacher */}
      <Dialog open={selectedTeacherForUpdation.isOpen} onClose={handleCreateTeacherClose}>
        <DialogTitle>Edit lisies details</DialogTitle>
        <DialogContent>
          <TeacherUpdateForm
            handleUpdateTeacherClose={handleUpdateTeacherClose}
            tempUpdateTeacher={tempUpdateTeacher}
            subjects={subjects}
            teacherData={selectedTeacherForUpdation}
            
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersInSchool;
