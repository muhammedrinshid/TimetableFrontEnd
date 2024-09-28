import React, { useEffect, useState } from "react";

import { availableSubjectsInSchool } from "../../../assets/datas";
import SchoolIcon from "@mui/icons-material/School";

import AddButton from "../../common/AddButton";
import SubjectAssignmentForm from "../../forms/SubjectAssignmentForm";
import {
  CustomSelect,
  SearchInput,
  StyledAvatarGroup,
} from "../../Mui components";
import ClassCard from "../ClassInSchool/ClassCard";
import DivisionCard from "../ClassInSchool/DivisionCard";
import EmptyState from "../../empty state management components/EmptyStateLevels";
import AddGradeForm from "../../forms/AddGradeForm";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/Authcontext";
import { Avatar } from "@mui/material";
import LevelSortMenu from "./LevelSortMenu";

const ClassList = ({
  setISelectedClassforView,
  handleClassroomDelete,
  handleGradeDelete,
  refectClasssroomListdata,
  refetchClassroomList,
  openEditCalssroomForm,
  setClassroomMap,
}) => {
  const { apiDomain, logoutUser, headers } = useAuth();
  const [isAddStandarFormOpen, setIsAddStandarFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortMethod, setSortMethod] = useState("Level Name A-Z"); // Default sort method

  const [seletctedGreadeForCreation, setSeletctedGreadeForCreation] =
    useState("");
  const [classByLevel, setClassByLevel] = useState([]);

  const [availableSubjcts, setcAvailableSubjects] = useState(
    availableSubjectsInSchool
  );
  const [OpenTeacherAssingmentForm, setOpenTeacherAssingmentForm] = useState({
    isOpen: false,
    level_id: "",
    grade_id: "",
    type: "all",
    div: "",
  });

  const [whichLevelToDisplay, setWhichLevelToDisplay] = useState("");
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
    ...classByLevel.map((level) => ({ value: level.name, label: level.name })),
  ];
  function getClassroomIdsByLevelAndGrade(data) {
    const result = {};
    data.forEach((level) => {
      const grades = {};
      level.grades.forEach((grade) => {
        const classroomIds = grade.classrooms.map(
          (classroom) => classroom.id
        );
        grades[grade.id] = classroomIds;
      });
      result[level.id] = grades;
    });
    return result;
  }
  // functjion to refetch the data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/class-room/levels-grades-classrooms/`,
          {
            headers: headers,
          }
        );
        setClassByLevel(response.data);
        const result = getClassroomIdsByLevelAndGrade(response.data);
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
    const fetcLevelSubjecthData = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/class-room/level-subjects/`,
          {
            headers: headers,
          }
        );
        console.log(response.data)
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
    fetcLevelSubjecthData();
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
  const handleLevelChange = (value) => {
    setWhichLevelToDisplay(value);
    console.log(value);
  };

  // temprary function mock the add new divison

  // function to open the assign teacher form
  const openAssignTeacherForm = ({ level_id, division, grade_id, type,grade }) => {
    setOpenTeacherAssingmentForm((prev) => ({
      ...prev,
      isOpen: true,
      level_id: level_id,
      division: division,
      grade_id: grade_id,
      type: type,
      grade:grade||""
    }));
  };

  // filter the level accroding to the selected level
  const filteredLevels = whichLevelToDisplay
    ? classByLevel.filter((level) => level.name === whichLevelToDisplay)
    : classByLevel;
  return (
    <div className=" relative ">
      {/* header and contorle  section */}
      <div className="">
        {/* header */}
        <div className=" flex flex-row justify-between items-center mb-4  ">
          <h2 className="text-3xl font-Inter font-semibold">
            Classes in School{" "}
          </h2>

          <div className="bg-white rounded-3xl p-2 px-4 shadow-custom-8">
            <StyledAvatarGroup max={4}>
              {classByLevel.map((level) => (
                <Avatar
                  sx={{
                    bgcolor: getCharLightColor(level?.name || "c"),
                    color: "text.primary",
                    width: 30,
                    height: 30,
                    fontSize: ".5rem",
                    fontWeight: "bold",
                  }}
                >
                  {level?.short_name}
                </Avatar>
              ))}
            </StyledAvatarGroup>
          </div>
        </div>

        {/* controle */}
        <div className="relative flex flex-row justify-between gap-10 ">
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <SearchInput value={searchQuery} onChange={handleSearchChange} />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <CustomSelect
              value={whichLevelToDisplay}
              onChange={handleLevelChange}
              options={options}
            />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl  shadow-custom-8">
            <LevelSortMenu setSortType={setSortMethod} />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full max-h-full ">
        {filteredLevels?.map((level) => {
          const filteredAndSortedGrades = [...level.grades]
            .filter(
              (grade) =>
                searchQuery === "" ||
                grade.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
              switch (sortMethod) {
                case "Level Name A-Z":
                  return a.short_name.localeCompare(b.short_name);
                case "Level Name Z-A":
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
                <SchoolIcon className="mr-2" /> {level.name}
              </p>

              {filteredAndSortedGrades.length == 0 ? (
                <EmptyState level={level.name} />
              ) : (
                <div className="flex flex-col w-full max-w-full ">
                  {filteredAndSortedGrades.map((grade) => {
                    return (
                      <div className="flex flex-row justify-start my-3 gap-5 items-center flex-wrap border-b last:border-none">
                        <div className="">
                          <ClassCard
                            openAssignTeacherForm={openAssignTeacherForm}
                            level={level}
                            grade={grade}
                            refectClasssroomListdata={refectClasssroomListdata}
                            handleGradeDelete={handleGradeDelete}
                          />
                        </div>
                        {grade?.classrooms?.map((division, index) => (
                          <DivisionCard
                            division={division}
                            classroom_name={grade?.short_name+" "+division?.division}
                            grade_id={grade?.id}
                            handleClassroomDelete={handleClassroomDelete}
                            setISelectedClassforView={setISelectedClassforView}
                            openEditCalssroomForm={openEditCalssroomForm}
                            level={level}
                            index={index}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              <AddButton
                onClick={() => handleAddButtonClick(level.id)}
                label={"Add New Grade"}
              />
            </div>
          );
        })}
      </div>
      <AddGradeForm
        open={isAddStandarFormOpen}
        onClose={handleFormClose}
        seletctedGreadeForCreation={seletctedGreadeForCreation}
        setClassByLevel={setClassByLevel}
      />
      <SubjectAssignmentForm
        open={OpenTeacherAssingmentForm.isOpen}
        onClose={() =>
          setOpenTeacherAssingmentForm((prev) => ({ ...prev, isOpen: false }))
        }
        OpenTeacherAssingmentForm={OpenTeacherAssingmentForm}
      />
    </div>
  );
};

export default ClassList;
