import React, { useState } from "react";

import { availableSubjectsInSchool, schoolData } from "../../../assets/datas";
import SchoolIcon from "@mui/icons-material/School";

import AddButton from "../../common/AddButton";
import SubjectAssignmentForm from "../../forms/SubjectAssignmentForm";
import { SortMenu } from "../Teachers";
import { CustomSelect, SearchInput } from "../../Mui components";
import ClassCard from "../ClassInSchool/ClassCard";
import DivisionCard from "../ClassInSchool/DivisionCard";
import EmptyState from "../../common/EmptyState";
import AddStandardForm from "../../forms/AddStandardForm";

const ClassList = ({ setISelectedClassforView }) => {
  const [isAddStandarFormOpen, setIsAddStandarFormOpen] = useState(false);
  const [seletctedGreadeForCreation, setSeletctedGreadeForCreation] =
    useState("");
  const [classByGrade, setClassByGrade] = useState(schoolData);
  const [availableSubjcts, setcAvailableSubjects] = useState(
    availableSubjectsInSchool
  );
  const [OpenTeacherAssingmentForm, setOpenTeacherAssingmentForm] = useState({
    isOpen: false,
    grade: "",
    standard: "",
    type: "all",
    div: "",
  });
  const [whichGradeToDisplay, setWhichGradeToDisplay] = useState('');

  const options = [
    { value: '', label: 'All Grades' },
    ...classByGrade.map(grade => ({ value: grade.name, label: grade.name }))
  ];
  // handle the function of add button click on classCard
  const handleAddButtonClick = (data) => {
    setSeletctedGreadeForCreation(data);
    setIsAddStandarFormOpen(true);
  };
  // handle the function of add button click on classCard ,for closing

  const handleFormClose = () => {
    setIsAddStandarFormOpen(false);
  };

  // temperary function mock the backend
  function assignSubjectsToStandard(subjects, standardName, gradeName) {
    let tempTotal = subjects.reduce((total, subject) => {
      return total + subject.lessonsPerWeek;
    }, 0);

    let oldGrade = JSON.parse(JSON.stringify(classByGrade));

    return oldGrade.map((grade) =>
      grade.name === gradeName
        ? {
            ...grade,
            standards: grade.standards.map((standard) =>
              standard.name === standardName
                ? {
                    ...standard,
                    divisions: standard.divisions.map((division) => ({
                      ...division,
                      subjects: subjects,
                      totalAssignedClassesPerWeek: tempTotal,
                    })),
                  }
                : standard
            ),
          }
        : grade
    );
  }

  const handleGradeChange = (value) => {
    setWhichGradeToDisplay(value);
    console.log(value)
  };

  // temprary function mock the add new divison
  const addNewDivision = (gradeName, standardName) => {
    setClassByGrade((prevState) => {
      console.log(gradeName);
      const newState = JSON.parse(JSON.stringify(prevState));

      // Find the grade
      const grade = newState.find((g) => g.name === gradeName);
      if (!grade) {
        console.error(`Grade "${gradeName}" not found`);
        return newState;
      }

      // Find the standard within the grade
      const standard = grade.standards.find((s) => s.name === standardName);
      if (!standard) {
        console.error(
          `Standard "${standardName}" not found in grade "${gradeName}"`
        );
        return newState;
      }

      // Get existing division names
      const existingDivisions = standard.divisions.map((d) => d.name);

      // Find the next available division name
      let newDivisionName = "";
      for (let i = 0; i < 26; i++) {
        const divName = String.fromCharCode(65 + i); // A to Z
        if (!existingDivisions.includes(divName)) {
          newDivisionName = divName;
          break;
        }
      }

      // If all single letters are used, start with AA, AB, etc.
      if (!newDivisionName) {
        let prefix = "A";
        while (true) {
          for (let i = 0; i < 26; i++) {
            const divName = prefix + String.fromCharCode(65 + i);
            if (!existingDivisions.includes(divName)) {
              newDivisionName = divName;
              break;
            }
          }
          if (newDivisionName) break;
          prefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
        }
      }

      // Create the new division
      const newDivision = {
        name: newDivisionName,
        subjects: [],
        totalAssignedClassesPerWeek: 0,
      };

      // Add the new division to the standard
      standard.divisions.push(newDivision);

      return newState;
    });
  };

  // temprry function to mock the creation of a standard in a specific grade
  const handleCreateStandardFormSubmit = (data) => {
    const { standardName, shortName, numberOfDivisions } = data;

    setClassByGrade((prevState) => {
      // Create a deep copy of the state
      const newState = JSON.parse(JSON.stringify(prevState));

      // Create the new standard object
      const newStandard = {
        name: standardName,
        shortName: shortName,
        divisions: [],
      };

      // Create divisions based on the number provided
      for (let i = 0; i < parseInt(numberOfDivisions); i++) {
        const divisionName = String.fromCharCode(65 + i); // A, B, C, etc.
        newStandard.divisions.push({
          name: divisionName,
          subjects: [],
          totalAssignedClassesPerWeek: 0,
        });
      }

      // Find the correct grade
      const targetGrade = newState.find(
        (g) => g.name === seletctedGreadeForCreation
      );

      if (targetGrade) {
        // Add the new standard to the found grade
        targetGrade.standards.push(newStandard);
      } else {
        console.error(`Grade "${seletctedGreadeForCreation}" not found`);
        // Optionally, you could create a new grade here if it doesn't exist
      }

      return newState;
    });

    // Close the form and reset it
    handleFormClose();

    setIsAddStandarFormOpen(false);
  };

  // function to open the assign teacher form
  const openAssignTeacherForm = (grade, division, standard, type) => {
    setOpenTeacherAssingmentForm((prev) => ({
      ...prev,
      isOpen: true,
      grade: grade,
      division: division,
      standard: standard,
      type: type,
    }));
  };

  // function to mock the teacher assignment afte the cre
  const handleAssingTeacherSubmit = (subjects) => {
    const newGrade = assignSubjectsToStandard(
      subjects,
      OpenTeacherAssingmentForm.standard,
      OpenTeacherAssingmentForm.grade
    );
    setClassByGrade(newGrade);
    console.log("success", newGrade[0]);
    setOpenTeacherAssingmentForm((prev) => ({ ...prev, isOpen: false }));
    // Process the assigned subjects here
  };



  // filter the grade accroding to the selected grade
const filteredGrades = whichGradeToDisplay ? classByGrade.filter(grade => grade.name === whichGradeToDisplay) : classByGrade;
  return (
    <div className=" relative ">
      {/* header and contorle  section */}
      <div className="">
        {/* header */}
        <div className=" flex flex-row justify-between items-center mb-4  ">
          <h2 className="text-3xl font-Inter font-semibold">
            Classes in School{" "}
          </h2>

          <div className="bg-white rounded-3xl p-2 px-4 shadow-custom-8"></div>
        </div>

        {/* controle */}
        <div className="relative flex flex-row justify-between gap-10 ">
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <SearchInput />
          </div>
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <CustomSelect
              value={whichGradeToDisplay}
              onChange={handleGradeChange}
              options={options}
            />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl  shadow-custom-8">
            <SortMenu />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full max-h-full ">
        {filteredGrades?.map((grade) => (
          <div className="w-full min-h-44 my-2 flex items-center justify-start flex-col border-b py-6">
            <p className="text-sm font-medium text-slate-50 font-Inter my-2 p-2 rounded-xl bg-light-primary bg-opacity-75 flex items-center sticky top-0 z-10">
              <SchoolIcon className="mr-2" /> {grade.name}
            </p>

            {grade.standards.length == 0 ? (
              <EmptyState grade={grade.name} />
            ) : (
              <div className="flex flex-col w-full max-w-full ">
                {grade.standards.map((standard) => (
                  <div className="flex flex-row justify-start my-3 gap-5 items-center flex-wrap">
                    <div className="">
                      <ClassCard
                        addNewDivision={addNewDivision}
                        openAssignTeacherForm={openAssignTeacherForm}
                        grade={grade}
                        numberOfDivisions={grade.standards.length}
                        standardName={standard?.name}
                        shortName={standard?.shortName}
                      />
                    </div>
                    {standard?.divisions?.map((division) => (
                      <DivisionCard
                        divisionName={division.name}
                        totalAssignedLessons={
                          division?.totalAssignedClassesPerWeek
                        }
                        setISelectedClassforView={setISelectedClassforView}
                        totalNeededLessons={50}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            <AddButton
              onClick={() => handleAddButtonClick(grade.name)}
              label={"Add New Standard"}
            />
          </div>
        ))}
      </div>
      <AddStandardForm
        open={isAddStandarFormOpen}
        onClose={handleFormClose}
        onSubmit={handleCreateStandardFormSubmit}
      />
      <SubjectAssignmentForm
        open={OpenTeacherAssingmentForm.isOpen}
        onClose={() =>
          setOpenTeacherAssingmentForm((prev) => ({ ...prev, isOpen: false }))
        }
        onSubmit={handleAssingTeacherSubmit}
        availableSubjects={availableSubjcts}
      />
    </div>
  );
};

export default ClassList;
