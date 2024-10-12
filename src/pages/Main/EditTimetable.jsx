import { Navigate, useParams } from "react-router-dom";
import EditTeacherTimetable from "./EditTimetable/EditTeacherTimetable";
import EditStudentTimetable from "./EditTimetable/EditStudentTimetable";

const EditTimetable = () => {
  const { viewType, id:timeTableId } = useParams(); // Get viewType and id from the URL

  // Redirect logic based on the presence of viewType and id
  if (!viewType && !timeTableId) {
    return <Navigate to="/" />; // Redirect to home if neither is available
  }

  if (viewType === "teacher" && !timeTableId) {
    return <Navigate to="/teachers" />; // Redirect to teachers if no id for teacher
  }

  if (viewType === "student" && !timeTableId) {
    return <Navigate to="/classes" />; // Redirect to classes if no id for student
  }

  return (
    <>
      {viewType === "teacher" ? (
        <EditTeacherTimetable timeTableId={timeTableId} />
      ) : viewType === "student" ? (
        <EditStudentTimetable timeTableId={timeTableId} />
      ) : (
        <Navigate to="/" /> // Redirect to home if viewType is neither
      )}
    </>
  );
};

export default EditTimetable;
