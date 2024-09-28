import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSpring, animated } from "react-spring";
import SubjectCard from "./SubjectCard";
import { Tooltip } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";

const SubjectsAndTeachers = ({
  classroomData,
  handleSubjectEditButton,
  handleAddGroup,
  selectedClassforView,
  refresh,
  setOpenAddNewSubjectForm
}) => {
  const [expanded, setExpanded] = useState(false);
  const onClickAddNewSubject = () => {
    setOpenAddNewSubjectForm((prev) => ({
      ...prev,
      isOpen: true,
      classroomId: classroomData?.id,
      selectedSubjects: classroomData.subject_data.map((sub) => sub.subjectId),
      gradeId: selectedClassforView?.grade_id,
      levelId: selectedClassforView?.levelId,
      currentLessonsPerWeek: classroomData.lessons_assigned_subjects,
    }));
  };
  const visibleSubjects = expanded
    ? classroomData?.subject_data
    : classroomData?.subject_data.slice(0, 3);

  const animProps = useSpring({
    height: expanded ? "auto" : 0,
    opacity: expanded ? 1 : 0,
    config: { tension: 300, friction: 20 },
  });

  const toggleAnimation = useSpring({
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  });

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="py-6 relative text-right">
      <p className="text-sm font-medium text-text_2 font-Inter mb-4">
        SUBJECTS AND TEACHERS
      </p>
      <div className="space-y-4">
        {visibleSubjects?.slice(0, 3).map((subject, index) => (
          <SubjectCard
            key={index}
            subject={subject}
            onEdit={handleSubjectEditButton}
            onAddGroup={handleAddGroup}
            selectedClassforView={selectedClassforView}
            refresh={refresh}
          />
        ))}
      </div>

      {classroomData?.subject_data.length > 3 && (
        <>
          <animated.div style={animProps} className="space-y-4 overflow-hidden">
            {visibleSubjects?.slice(3).map((subject, index) => (
              <SubjectCard
                key={index + 3}
                subject={subject}
                onEdit={handleSubjectEditButton}
                onAddGroup={handleAddGroup}
                selectedClassforView={selectedClassforView}
                refresh={refresh}
              />
            ))}
          </animated.div>

          <div className="mt-4 flex justify-center">
            <button
              className="flex items-center text-blue-500 hover:underline cursor-pointer"
              onClick={handleToggle}
            >
              <span className="mr-1">
                {expanded ? "Show Less" : "Show More"}
              </span>
              <animated.div style={toggleAnimation}>
                <ChevronDown size={20} />
              </animated.div>
            </button>
          </div>
        </>
      )}
  
        <button
          onClick={onClickAddNewSubject}
          className=" p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Add new subject"
        >
          <AddIcon className="w-6 h-6 text-white" />
        </button>
    </div>
  );
};

export default SubjectsAndTeachers;
