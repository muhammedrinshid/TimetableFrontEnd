import React, { useEffect, useState } from "react";

import { availableSubjectsInSchool } from "../../../assets/datas";
import SchoolIcon from "@mui/icons-material/School";
import { motion } from "framer-motion";

import AddButton from "../../common/AddButton";
import SubjectAssignmentForm from "../../forms/SubjectAssignmentForm";
import {
  CustomSelect,
  SearchInput,
  StyledAvatarGroup,
} from "../../Mui components";
import ClassCard from "../ClassInSchool/ClassCard";
import DivisionCard from "../ClassInSchool/DivisionCard";
import EmptyState from "../../empty state management components/EmptyStateGrades";
import AddStandardForm from "../../forms/AddStandardForm";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/Authcontext";
import GradeSortMenu from "./GradeSortMenu";
import { Avatar } from "@mui/material";

const ClassList = ({
  setISelectedClassforView,
  handleClassroomDelete,
  handleStandardDelete,
  refectClasssroomListdata,
  refetchClassroomList,
  openEditCalssroomForm,
  setClassroomMap,
}) => {
  const { apiDomain, logoutUser, headers } = useAuth();
  const [isAddStandarFormOpen, setIsAddStandarFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortMethod, setSortMethod] = useState("Grade Name A-Z"); // Default sort method

  const [seletctedGreadeForCreation, setSeletctedGreadeForCreation] =
    useState("");
  const [classByGrade, setClassByGrade] = useState([]);

  const [availableSubjcts, setcAvailableSubjects] = useState(
    availableSubjectsInSchool
  );
  const [OpenTeacherAssingmentForm, setOpenTeacherAssingmentForm] = useState({
    isOpen: false,
    grade_id: "",
    standard_id: "",
    type: "all",
    div: "",
  });

  const [whichGradeToDisplay, setWhichGradeToDisplay] = useState("");
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
  const options = [
    ...classByGrade.map((grade) => ({ value: grade.name, label: grade.name })),
  ];
  function getClassroomIdsByGradeAndStandard(data) {
    const result = {};
    data.forEach((grade) => {
      const standards = {};
      grade.standards.forEach((standard) => {
        const classroomIds = standard.classrooms.map(
          (classroom) => classroom.id
        );
        standards[standard.id] = classroomIds;
      });
      result[grade.id] = standards;
    });
    return result;
  }
  // functjion to refetch the data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/class-room/grades-standards-classrooms/`,
          {
            headers: headers,
          }
        );
        setClassByGrade(response.data);
        const result = getClassroomIdsByGradeAndStandard(response.data);
        setClassroomMap(result);
      } catch (error) {
        if (error.response) {
          toast.error(
            `Error: ${error.response.data.detail || "An error occurred"}`
          );
        } else if (error.request) {
          toast.error("No response received from server");
        } else {
          toast.error("Error in setting up the request");
        }
        console.error("Error fetching data:", error);
      }
    };
    const fetcGradeSubjecthData = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/class-room/grade-subjects/`,
          {
            headers: headers,
          }
        );
        console.log(response.data);
      } catch (error) {
        if (error.response) {
          toast.error(
            `Error: ${error.response.data.detail || "An error occurred"}`
          );
        } else if (error.request) {
          toast.error("No response received from server");
        } else {
          toast.error("Error in setting up the request");
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetcGradeSubjecthData();
  }, [refetchClassroomList]);

  // handle the function of add button click on classCard
  const handleAddButtonClick = (data) => {
    setSeletctedGreadeForCreation(data);
    setIsAddStandarFormOpen(true);
  };
  // handle the function of add button click on classCard ,for closing

  const handleFormClose = () => {
    setIsAddStandarFormOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleGradeChange = (value) => {
    setWhichGradeToDisplay(value);
    console.log(value);
  };

  // temprary function mock the add new divison

  // function to open the assign teacher form
  const openAssignTeacherForm = ({
    grade_id,
    division,
    standard_id,
    type,
    standard,
  }) => {
    setOpenTeacherAssingmentForm((prev) => ({
      ...prev,
      isOpen: true,
      grade_id: grade_id,
      division: division,
      standard_id: standard_id,
      type: type,
      standard: standard || "",
    }));
  };

  // filter the grade accroding to the selected grade
  const filteredGrades = whichGradeToDisplay
    ? classByGrade.filter((grade) => grade.name === whichGradeToDisplay)
    : classByGrade;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className="relative flex flex-col w-full h-[calc(100vh-5rem)] 3xl:h-[calc(60rem-5rem)] max-h-[calc(100vh-5rem)] 3xl:max-h-[calc(60rem-5rem)]"
    >
      {/* header and control section */}
      <div className="flex-none">
        {/* header */}
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-3xl font-Inter font-semibold">
            Classes in School{" "}
          </h2>

          <div className="bg-white rounded-3xl p-2 px-4 shadow-custom-8">
            <StyledAvatarGroup max={4}>
              {classByGrade.map((grade) => (
                <Avatar
                  sx={{
                    bgcolor: getCharLightColor(grade?.name || "c"),
                    color: "text.primary",
                    width: 30,
                    height: 30,
                    fontSize: ".5rem",
                    fontWeight: "bold",
                  }}
                >
                  {grade?.short_name}
                </Avatar>
              ))}
            </StyledAvatarGroup>
          </div>
        </div>

        {/* controle */}
        <div className="relative flex flex-row justify-between gap-10">
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <SearchInput value={searchQuery} onChange={handleSearchChange} />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <CustomSelect
              value={whichGradeToDisplay}
              onChange={handleGradeChange}
              options={options}
            />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl shadow-custom-8">
            <GradeSortMenu setSortType={setSortMethod} />
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto mt-4">
        {filteredGrades?.map((grade) => {
          const filteredAndSortedStandards = [...grade.standards]
            .filter(
              (standard) =>
                searchQuery === "" ||
                standard.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
              switch (sortMethod) {
                case "Grade Name A-Z":
                  return a.short_name.localeCompare(b.short_name);
                case "Grade Name Z-A":
                  return b.short_name.localeCompare(a.short_name);
                case "Divisions High to Low":
                  return b.classrooms.length - a.classrooms.length;
                case "Divisions Low to High":
                  return a.classrooms.length - b.classrooms.length;
                default:
                  return 0;
              }
            });
          return (
            <div className="w-full min-h-44 my-2 flex items-center justify-start flex-col border-b-2 border-slate-300 py-6">
              <p className="text-sm font-medium text-slate-50 font-Inter my-2 p-2 rounded-xl bg-light-primary bg-opacity-75 flex items-center sticky top-0 z-10">
                <SchoolIcon className="mr-2" /> {grade.name}
              </p>

              {filteredAndSortedStandards.length == 0 ? (
                <EmptyState grade={grade.name} />
              ) : (
                <div className="flex flex-col w-full max-w-full">
                  {filteredAndSortedStandards.map((standard) => {
                    return (
                      <div className="flex flex-row justify-start my-3 gap-5 items-center flex-wrap border-b last:border-none">
                        <div className="">
                          <ClassCard
                            openAssignTeacherForm={openAssignTeacherForm}
                            grade={grade}
                            standard={standard}
                            refectClasssroomListdata={refectClasssroomListdata}
                            handleStandardDelete={handleStandardDelete}
                          />
                        </div>
                        {standard?.classrooms?.map((division, index) => (
                          <DivisionCard
                            division={division}
                            classroom_name={
                              standard?.short_name + " " + division?.division
                            }
                            standard_id={standard?.id}
                            handleClassroomDelete={handleClassroomDelete}
                            setISelectedClassforView={setISelectedClassforView}
                            openEditCalssroomForm={openEditCalssroomForm}
                            grade={grade}
                            index={index}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              <AddButton
                onClick={() => handleAddButtonClick(grade.id)}
                label={"Add New Grade"}
              />
            </div>
          );
        })}
      </div>

      <AddStandardForm
        open={isAddStandarFormOpen}
        onClose={handleFormClose}
        seletctedGreadeForCreation={seletctedGreadeForCreation}
        refectClasssroomListdata={refectClasssroomListdata}
      />
      <SubjectAssignmentForm
        open={OpenTeacherAssingmentForm.isOpen}
        onClose={() =>
          setOpenTeacherAssingmentForm((prev) => ({ ...prev, isOpen: false }))
        }
        OpenTeacherAssingmentForm={OpenTeacherAssingmentForm}
      />
    </motion.div>
  );
};

export default ClassList;
