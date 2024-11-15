import React, { useMemo, useState } from "react";

import ReactCardFlip from "react-card-flip";

import TeacherDetails from "./TeacherDetails";
import TeachersList from "./TeachersList";

const TeachersTeacherList = ({
  teachers,
  handleChange,
  setSelectedTeacherForUpdation,
  setIsDeleteTeacherPopupOpen,
  grades,
  handleCreateTeacherOpen
}) => {
  const [selectedTeacher, setISelectedTeacher] = useState({
    isopen: false,
  });

const [teachersMap,setTeachersMap]=useState([])
const [gradeType, setGradeType] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [sortType, setSortType] = useState("Name A-Z");

const filteredAndSortedTeachers = useMemo(() => {
  return teachers
    ?.filter(
      (teacher) =>
        gradeType === "" ||
        teacher.grades_display.some((grade) => grade.id === gradeType)
    )
    .filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm) ||
        teacher.surname.toLowerCase().includes(searchTerm) ||
        teacher.email.toLowerCase().includes(searchTerm) ||
        teacher.teacher_id.toLowerCase().includes(searchTerm) ||
        teacher.qualified_subjects_display.some((subject) =>
          subject.name.toLowerCase().includes(searchTerm)
        )
    )
    .sort((a, b) => {
      switch (sortType) {
        case "Name A-Z":
          return a.name.localeCompare(b.name);
        case "Name Z-A":
          return b.name.localeCompare(a.name);
        case "Teacher ID A-Z":
          return a.teacher_id.localeCompare(b.teacher_id);
        case "Teacher ID Z-A":
          return b.teacher_id.localeCompare(a.teacher_id);
        default:
          return 0;
      }
    });
}, [teachers, gradeType, searchTerm, sortType]);
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
        filteredAndSortedTeachers={filteredAndSortedTeachers}
        gradeType={gradeType}
        searchTerm={searchTerm}
        setGradeType={setGradeType}
        setSearchTerm={setSearchTerm}
        setSortType={setSortType}
        handleCreateTeacherOpen={handleCreateTeacherOpen}
      />
      <TeacherDetails
        selectedTeacher={selectedTeacher}
        setISelectedTeacher={setISelectedTeacher}
        setIsDeleteTeacherPopupOpen={setIsDeleteTeacherPopupOpen}
        teachersMap={filteredAndSortedTeachers}
      />
    </ReactCardFlip>
  );
};

export default TeachersTeacherList;
