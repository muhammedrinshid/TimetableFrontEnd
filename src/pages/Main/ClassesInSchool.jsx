import React, { useState } from "react";
import {
  CustomSelect,
  SearchInput,
  stringAvatar,
} from "../../components/Mui components";
import { SortMenu } from "../../components/specific/Teachers";
import { schoolData } from "../../assets/datas";
import SchoolIcon from "@mui/icons-material/School";
import EmptyState from "../../components/common/EmptyState";
import { Avatar } from "@mui/material";
import ClassCard from "../../components/specific/ClassInSchool/ClassCard";
import DivisionCard from "../../components/specific/ClassInSchool/DivisionCard";
import FloatingAddButton from "../../components/common/FloatingAddButton";
import AddButton from "../../components/common/AddButton";
import AddStandardForm from "../../components/forms/AddStandardForm";
const ClassesInSchool = () => {



    const [isAddStandarFormOpen, setIsAddStandarFormOpen] = useState(false);
    const [seletctedGreadeForCreation, setSeletctedGreadeForCreation] = useState("");
    const [classByGrade, setClassByGrade] = useState(schoolData);


    const handleAddButtonClick = (data) => {
        setSeletctedGreadeForCreation(data)
      setIsAddStandarFormOpen(true);
    };
  
    const handleFormClose = () => {
      setIsAddStandarFormOpen(false);
    };
    const addNewDivision = (gradeName, standardName) => {
        setClassByGrade(prevState => {
            console.log(gradeName)
          const newState = JSON.parse(JSON.stringify(prevState));
          
          // Find the grade
          const grade = newState.find(g => g.name === gradeName);
          if (!grade) {
            console.error(`Grade "${gradeName}" not found`);
            return newState;
          }
          
          // Find the standard within the grade
          const standard = grade.standards.find(s => s.name === standardName);
          if (!standard) {
            console.error(`Standard "${standardName}" not found in grade "${gradeName}"`);
            return newState;
          }
      
          // Get existing division names
          const existingDivisions = standard.divisions.map(d => d.name);
      
          // Find the next available division name
          let newDivisionName = '';
          for (let i = 0; i < 26; i++) {
            const divName = String.fromCharCode(65 + i); // A to Z
            if (!existingDivisions.includes(divName)) {
              newDivisionName = divName;
              break;
            }
          }
      
          // If all single letters are used, start with AA, AB, etc.
          if (!newDivisionName) {
            let prefix = 'A';
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
            totalAssingedClassesPerWeek: 0
          };
      
          // Add the new division to the standard
          standard.divisions.push(newDivision);
      
          return newState;
        });
      };
    const handleFormSubmit  = (data) => {
        const { standardName, shortName, numberOfDivisions } = data;
        
        setClassByGrade(prevState => {
          // Create a deep copy of the state
          const newState = JSON.parse(JSON.stringify(prevState));
      
          // Create the new standard object
          const newStandard = {
            name: standardName,
            shortName: shortName,
            divisions: []
          };
      
          // Create divisions based on the number provided
          for (let i = 0; i < parseInt(numberOfDivisions); i++) {
            const divisionName = String.fromCharCode(65 + i); // A, B, C, etc.
            newStandard.divisions.push({
              name: divisionName,
              subjects: [],
              totalAssingedClassesPerWeek: 0
            });
          }
      
          // Find the correct grade
          const targetGrade = newState.find(g => g.name === seletctedGreadeForCreation);
      
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
  return (
    <div className="pl-6 pr-4 pb-6   grid grid-rows-[1fr_4fr] overflow-auto">
      {/* header and contorle  section */}
      <div>
        {/* header */}
        <div className=" flex flex-row justify-between items-center mb-4">
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
            <CustomSelect options={["rinshid", "top", "enter"]} />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl  shadow-custom-8">
            <SortMenu />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full max-h-full ">
        {classByGrade.map((grade) => (
          <div className="w-full min-h-44 my-2 flex items-center justify-start flex-col border-b py-6">
            <p className="text-sm font-medium text-slate-50 font-Inter my-2 p-2 rounded-xl bg-light-primary bg-opacity-75 flex items-center">
              <SchoolIcon className="mr-2" /> {grade.name}
            </p>

            {grade.standards.length == 0 ? (
              <EmptyState grade={grade.name} />
            ) : (
              <div className="flex flex-col w-full max-w-full">
                {grade.standards.map((standard) => (
                  <div className="flex flex-row justify-start my-3 gap-5 items-center flex-wrap">
                    <div className="">
                      <ClassCard
                        addNewDivision={addNewDivision}
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
                          division?.totalAssingedClassesPerWeek
                        }
                        totalNeededLessons={50}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            <AddButton onClick={()=>handleAddButtonClick(grade.name)} label={"Add New Standard"}/>
          </div>
        ))}
      </div>
      <AddStandardForm
        open={isAddStandarFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ClassesInSchool;
