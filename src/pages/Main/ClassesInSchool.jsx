import React, { useState } from "react";
import ClassDetails from "../../components/specific/ClassInSchool/ClassDetails";
import ReactCardFlip from "react-card-flip";
import ClassList from "../../components/specific/ClassInSchool/ClassList";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";

const ClassesInSchool = ({}) => {
  const { apiDomain, logoutUser, headers } = useAuth();

  const [refetchClassroomList, setRefetchClassroomList] = useState(false);
  const [isClassroomDeletePopupOpen, setIsClassroomDeletePopupOpen] =
    useState(null);
  const [isStandardDeletePopupOpen, setIsStandardDeletePopupOpen] =
    useState(null);

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
  // handle delete popup for Standard
  const handleStandardDelete = (delete_id) => {
    setIsStandardDeletePopupOpen(delete_id);
  };

  // function for delete confirmation Standard
  const handleConfirmStandardDelete = async () => {
    if (isStandardDeletePopupOpen) {
      try {
        const response = await axios.delete(
          `${apiDomain}/api/class-room/standard/${isStandardDeletePopupOpen}`,
          {
            headers: headers,
          }
        );
        toast.success("Successfully deleted");
        setIsStandardDeletePopupOpen(null);
        refectClasssroomListdata();
      } catch (error) {
        // Handle errors
        console.error("There was an error deleting the Standard:", error);
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
        console.error("There was an error deleting the grade:", error);
        toast.error("error occured");
        // Optionally, handle errors in the UI or state
      }
    }
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
          
          handleStandardDelete={handleStandardDelete}
          refetchClassroomList={refetchClassroomList}
          refectClasssroomListdata={refectClasssroomListdata}


        />
        <ClassDetails setISelectedClassforView={setISelectedClassforView} selectedClassforView={selectedClassforView}/>
      </ReactCardFlip>
      <DeleteConfirmationPopup
        isOpen={isClassroomDeletePopupOpen}
        onClose={() => setIsClassroomDeletePopupOpen(false)}
        onConfirm={handleConfirmClassroomDelete}
      />
      <DeleteConfirmationPopup
        isOpen={isStandardDeletePopupOpen}
        onClose={() => setIsStandardDeletePopupOpen(false)}
        onConfirm={handleConfirmStandardDelete}
      />
    </>
  );
};
export default ClassesInSchool;
