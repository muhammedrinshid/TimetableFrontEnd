import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import { useStateManager } from "react-select";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";

const TeachersInSchool = () => {
  const {apiDomain,headers,logoutUser}=useAuth()
  const [isDeleteTeacherPopupOpen,setIsDeleteTeacherPopupOpen]=useState(null)

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjectsTeachersCount,setSubjectsTeachersCount]=useState([])
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingGrades, setIsLoadingGrades] = useState(true);
  const [refetch,setRefetch]=useState(false)

 
  const [createTeacherFormOpen, setCreateTeacherFormOpen] = useState(false);
  const [selectedTeacherForUpdation, setSelectedTeacherForUpdation] = useState({
    isOpen: false,
  });

  // Fetch teachers function
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/teacher/teachers`, {
        headers,
      });
      setTeachers(response.data);
      setIsLoadingTeachers(false);

      // Check if response.data is empty
      if (response.data.length === 0) {
        toast.info("You have no teachers. Create teacher to proceed.");
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Error fetching teachers");
    }
  };
  const fetchSubjectsTeachersCount = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/teacher/school-subject-teacher-count/`, {
        headers,
      });
      setSubjectsTeachersCount(response.data.subjectData);
      

      // Check if response.data is empty
      if (response.data.length === 0) {
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Error fetching teachers");
    }
  };

  // Fetch subjects function
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/user/subjects`, {
        headers,
      });
      setSubjects(response.data);
      setIsLoadingSubjects(false);

      // Check if response.data is empty
      if (response.data.length === 0) {
        toast.info("You have no subject. Create subjects to proceed.");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error fetching subjects");
    }
  };

  // Fetch grades function
  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/user/grades`, {
        headers,
      });
      setGrades(response.data||[]);
      setIsLoadingGrades(false);

      // Check if response.data is empty
      if (response.data.length === 0) {
        toast.info("You have no grades. Create grades to proceed.");
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Error fetching grades");
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
    fetchGrades();
    fetchSubjectsTeachersCount()
  }, [refetch]);



  

  const handleCreateTeacherOpen = () => {
    console.log("hi");
    setCreateTeacherFormOpen(true);
  };

  const handleCreateTeacherClose = () => {
    setCreateTeacherFormOpen(false);
  };
  const handleUpdateTeacherClose = () => {
    setSelectedTeacherForUpdation({ isOpen: false });
  };
  const tempUpdateTeacher = (data, teacher_id) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.teacher_id === teacher_id ? { ...teacher, ...data } : teacher
      )
    );
  };
  const deleteSubmit = async () => {
    let teacherId=isDeleteTeacherPopupOpen
    try {
      const response = await axios.delete(
        `${apiDomain}/api/teacher/teacher/${teacherId}`,
        {
          headers: {
            ...headers,
          },
        }
      );
  
      // Handle success
      toast.success("Teacher deleted successfully");
      setRefetch((prev) => !prev); // Trigger refetching of data if needed
      console.log("Teacher deleted successfully:", response.data);
      setIsDeleteTeacherPopupOpen(null)
  
    } catch (error) {
      // Error handling (similar to the update error handling)
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(
            error.response.data.message ||
              "An error occurred while deleting the teacher"
          );
        }
      } else {
        toast.error("An error occurred: Unable to reach the server");
      }
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <div className=" grid grid-rows-[10fr_4fr] grid-cols-[6fr_2fr] overflow-auto  pl-6 pr-4 pb-6 gap-4 ">
      {/* teachers list placed */}

      <TeachersTeacherList
        teachers={teachers}
        setIsDeleteTeacherPopupOpen={setIsDeleteTeacherPopupOpen}
        setSelectedTeacherForUpdation={setSelectedTeacherForUpdation}
        setRefetch={setRefetch}
        grades={grades}
      />

      {/* overall details */}
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 bg-white rounded-2xl">
        <div className="p-4 ">
          <div className="flex flex-row justify-between p-4 items-center rounded-xl bg-light-primary bg-opacity-90 shadow-custom-1">
            <div className="text-right">
              <h3 className="text-base text-slate-300 font-medium mb-1">
                Registred Teachers
              </h3>
              <h1 className="text-2xl font-semibold text-slate-100">{teachers?.length}</h1>
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
          {subjectsTeachersCount.map((subject) => (
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
        <DialogTitle>Add  Teacher</DialogTitle>
        <DialogContent>
          <CreateTeacherForm
            handleCreateTeacherClose={handleCreateTeacherClose}
            setRefetch={setRefetch}
            subjects={subjects}
            grades={grades}
          />
        </DialogContent>
      </Dialog>

      {/* update existing teacher */}
      <Dialog
        open={selectedTeacherForUpdation.isOpen}
        onClose={handleCreateTeacherClose}
      >
        <DialogTitle>Edit lisies details</DialogTitle>
        <DialogContent>
          <TeacherUpdateForm
            handleUpdateTeacherClose={handleUpdateTeacherClose}
            subjects={subjects}
            grades={grades}
            setRefetch={setRefetch}

            teacherData={selectedTeacherForUpdation}
          />
        </DialogContent>
      </Dialog>
      <DeleteConfirmationPopup
            isOpen={isDeleteTeacherPopupOpen}
            onClose={() => setIsDeleteTeacherPopupOpen(false)}
            onConfirm={deleteSubmit}
          />
    </div>
  );
};

export default TeachersInSchool;
