import React, { useEffect, useState } from "react";

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
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/Authcontext";
import DeleteConfirmationPopup from "../../common/DeleteConfirmationPopup";
import gradient from "@material-tailwind/react/theme/components/timeline/timelineIconColors/gradient";

const ClassList = ({
  setISelectedClassforView,
  handleClassroomDelete,
  handleStandardDelete,
  refectClasssroomListdata,
  refetchClassroomList,
  openEditCalssroomForm,
  setClassroomMap
}) => {
  const { apiDomain, logoutUser, headers } = useAuth();
  const [isAddStandarFormOpen, setIsAddStandarFormOpen] = useState(false);
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

  const options = [
    { value: "", label: "All Levels" },
    ...classByGrade.map((grade) => ({ value: grade.name, label: grade.name })),
  ];
  function getClassroomIdsByGradeAndStandard(data) {
    const result = {};
    data.forEach(grade => {
        const standards = {};
        grade.standards.forEach(standard => {
            const classroomIds = standard.classrooms.map(classroom => classroom.id);
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

    fetchData();
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



  const handleGradeChange = (value) => {
    setWhichGradeToDisplay(value);
    console.log(value);
  };

  // temprary function mock the add new divison

  // function to open the assign teacher form
  const openAssignTeacherForm = ({grade_id, division, standard_id, type}) => {
    setOpenTeacherAssingmentForm((prev) => ({
      ...prev,
      isOpen: true,
      grade_id: grade_id,
      division: division,
      standard_id: standard_id,
      type: type,
    }));
  };



  // filter the grade accroding to the selected grade
  const filteredGrades = whichGradeToDisplay
    ? classByGrade.filter((grade) => grade.name === whichGradeToDisplay)
    : classByGrade;
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
          <div className="w-full min-h-44 my-2 flex items-center justify-start flex-col border-b-2 border-slate-300 py-6">
            <p className="text-sm font-medium text-slate-50 font-Inter my-2 p-2 rounded-xl bg-light-primary bg-opacity-75 flex items-center sticky top-0 z-10">
              <SchoolIcon className="mr-2" /> {grade.name}
            </p>

            {grade.standards.length == 0 ? (
              <EmptyState grade={grade.name} />
            ) : (
              <div className="flex flex-col w-full max-w-full ">
                {grade.standards.map((standard) => (
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
                    {standard?.classrooms?.map((division,index) => (
                      <DivisionCard
                        division={division}
                        standard_id={standard?.id}
                        handleClassroomDelete={handleClassroomDelete}
                        setISelectedClassforView={setISelectedClassforView}
                        openEditCalssroomForm={openEditCalssroomForm}
                        grade={grade}
                        index={index}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            <AddButton
              onClick={() => handleAddButtonClick(grade.id)}
              label={"Add New Grade"}
            />
          </div>
        ))}
      </div>
      <AddStandardForm
        open={isAddStandarFormOpen}
        onClose={handleFormClose}
        seletctedGreadeForCreation={seletctedGreadeForCreation}
        setClassByGrade={setClassByGrade}
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
