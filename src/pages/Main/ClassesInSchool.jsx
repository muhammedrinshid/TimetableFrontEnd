import React, { useState } from "react";
import ClassDetails from "../../components/specific/ClassInSchool/ClassDetails";
import ReactCardFlip from "react-card-flip";
import ClassList from "../../components/specific/ClassInSchool/ClassList";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import ElectiveGroupPopup from "../../components/specific/ClassInSchool/ElectiveGroupPopup";
import EditDivisionForm from "../../components/forms/EditDivisionForm";

const ClassesInSchool = ({}) => {
  const { apiDomain, logoutUser, headers } = useAuth();
  const [classroomMap, setClassroomMap] = useState({});

  const [refetchClassroomList, setRefetchClassroomList] = useState(false);
  const [refetchClassroomdetails, setRefetchClassroomdetails] = useState(false);
  const refreshClassDetails = () => {
    setRefetchClassroomdetails((prev) => !prev);
  };
  const [isClassroomDeletePopupOpen, setIsClassroomDeletePopupOpen] =
    useState(null);
  const [isGradeDeletePopupOpen, setIsGradeDeletePopupOpen] =
    useState(null);

    const [editClassroomForm, setEditClassroomForm] = useState({
      isOpen:false,
      levelId: "",
      classroomId:"",
      type: "all",
    });

  const [selectedClassforView, setISelectedClassforView] = useState({
    isOpen: false,
  });

  const refectClasssroomListdata = () => {
    setRefetchClassroomList((prev) => !prev);
  };
  // handle delete popup for classrom
  const handleClassroomDelete = (delete_id) => {
    setIsClassroomDeletePopupOpen(delete_id);
  };
  // handle delete popup for Grade
  const handleGradeDelete = (delete_id) => {
    setIsGradeDeletePopupOpen(delete_id);
  };

  // function for delete confirmation Grade
  const handleConfirmGradeDelete = async () => {
    if (isGradeDeletePopupOpen) {
      try {
        const response = await axios.delete(
          `${apiDomain}/api/class-room/grade/${isGradeDeletePopupOpen}`,
          {
            headers: headers,
          }
        );
        toast.success("Successfully deleted");
        setIsGradeDeletePopupOpen(null);
        refectClasssroomListdata();
      } catch (error) {
        // Handle errors
        console.error("There was an error deleting the Grade:", error);
        toast.error("error occured");
        // Optionally, handle errors in the UI or state
      }
    }
  };
  const handleConfirmClassroomDelete = async () => {
    if (isClassroomDeletePopupOpen) {
      try {
        const response = await axios.delete(
          `${apiDomain}/api/class-room/classroom/${isClassroomDeletePopupOpen}`,
          {
            headers: headers,
          }
        );
        toast.success("Successfully deleted");
        setIsClassroomDeletePopupOpen(null);
        refectClasssroomListdata();
      } catch (error) {
        // Handle errors
        console.error("There was an error deleting the level:", error);
        toast.error("error occured");
        // Optionally, handle errors in the UI or state
      }
    }
  };
  const [openElectiveGroupPopup, setOpenElectiveGroupPopup] = useState(null);
  const handleAddGroup = ({
    gradeId,
    classroomId,
    electiveSubjectId,
    currenGrpId,
  }) => {
   

    if (gradeId && classroomId && electiveSubjectId) {
      setOpenElectiveGroupPopup({
        gradeId: gradeId,
        classroomId: classroomId,
        electiveSubjectId: electiveSubjectId,
        currenGrpId: currenGrpId,
      });
    } else {
      toast.error("error occured");
    }
  };
  const openEditCalssroomForm = ({levelId, classroomId,name}) => {
    setEditClassroomForm((prev) => ({
      ...prev,
      isOpen: true,
      levelId:levelId,
      classroomId:classroomId,
      name:name
     
      
    }));
  };
  return (
    <>
    
      <ReactCardFlip
        containerClassName="pl-6 pr-4 pb-6   grid grid-rows-[1fr_4fr] overflow-auto   "
        isFlipped={selectedClassforView.isOpen}
        flipDirection="vertical"
      >
        <ClassList
          setISelectedClassforView={setISelectedClassforView}
          handleClassroomDelete={handleClassroomDelete}
          handleGradeDelete={handleGradeDelete}
          refetchClassroomList={refetchClassroomList}
          refectClasssroomListdata={refectClasssroomListdata}
          openEditCalssroomForm={openEditCalssroomForm}
          setClassroomMap={setClassroomMap}
        />
        <ClassDetails
          setISelectedClassforView={setISelectedClassforView}
          selectedClassforView={selectedClassforView}
          handleAddGroup={handleAddGroup}
          refetch={refetchClassroomdetails}
          refresh={refreshClassDetails}
          classroomMap={classroomMap}

          openEditCalssroomForm={openEditCalssroomForm}

        />
      </ReactCardFlip>
      <DeleteConfirmationPopup
        isOpen={isClassroomDeletePopupOpen}
        onClose={() => setIsClassroomDeletePopupOpen(false)}
        onConfirm={handleConfirmClassroomDelete}
      />
      <DeleteConfirmationPopup
        isOpen={isGradeDeletePopupOpen}
        onClose={() => setIsGradeDeletePopupOpen(false)}
        onConfirm={handleConfirmGradeDelete}
      />
      <ElectiveGroupPopup
        open={openElectiveGroupPopup}
        onClose={() => setOpenElectiveGroupPopup(null)}
        openElectiveGroupPopup={openElectiveGroupPopup}
        refresh={refreshClassDetails}
      />
        <EditDivisionForm
        open={editClassroomForm.isOpen}
        onClose={() =>
          setEditClassroomForm((prev) => ({ ...prev, isOpen: false }))
        }
        editClassroomForm={editClassroomForm}
      />
    </>
  );
};
export default ClassesInSchool;
