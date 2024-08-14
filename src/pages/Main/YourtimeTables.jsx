import React, { useEffect, useState } from "react";
import {

  Typography,
  Button,

  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import TeacherTimeTableComponent from "../../components/specific/saved Time tables/TimeTableforTeacher";
import {
  weeklyTimetableTeacher,
  weeklyTimetablestudent,
} from "../../assets/datas";
import TimeTableforStudentComponent from "../../components/specific/saved Time tables/TimeTableforStudent";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import RoundButton from "../../components/common/RoundButton";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";
import SavedTimeTableCard from "../../components/specific/saved Time tables/SavedTimeTableCard";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";



const SavedTimeTables = () => {
  const { is_ready_for_timetable, apiDomain, headers } = useAuth();
  const [savedTables, setSavedTables] = useState([]);
  const [scheduleErrorList, setScheduleErrorList] = useState([]);
  const [editingTableId, setEditingTableId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTimeTableDialogOpen, setDeleteTimeTableDialogOpen] = useState(false);
  const fetchTimetables = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/timetables/`,
        {
          headers,
        }
      );
      setSavedTables(response.data); // Assuming response.data is an array of timetables
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Server responded with an error:",
          error.response.status,
          error.response.data
        );
        toast.error(
          `Failed to retrieve timetables: ${
            error.response.data.message || "Server error"
          }`
        );
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No response received:", error.request);
        toast.error("Failed to retrieve timetables: No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        toast.error("Failed to retrieve timetables: Network error");
      }
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const handleWhyDisabled = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/check-class-subjects/`,
        { headers }
      );
      setScheduleErrorList(response.data.reasons);
      toast.success("Schedule retrieved successfully");
    } catch (error) {
      toast.error("Failed to retrieve schedule");
    }
  };

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loadingDefault, setLoadingDefault] = useState(null);
  const [isTeacherView, setIsTeacherView] = useState(true);

  const handleSetDefault = async (id) => {
    setLoadingDefault(id);

    try {
      // Call the API to set the timetable as default
      const response = await axios.patch(
        `${apiDomain}/api/time-table/set-default/${id}/`,
        {}, // No body needed if only updating default status
        { headers }
      );

      // Assuming response.data.timetables contains the updated list of timetables
      setSavedTables(response.data.timetables);
      toast.success("Timetable set as default successfully");
    } catch (error) {
      console.error("Error setting default timetable:", error);
      toast.error("Failed to set timetable as default");
    } finally {
      setLoadingDefault(null);
    }
  };

  const handleDelete = async() => {


    let timetable=savedTables.find((table)=>table.id==deleteTimeTableDialogOpen)
    console.log(timetable)
    if (timetable?.is_default){
      toast.info("change the default")

    }else{
      try {
        // Call the API to delete the timetable
        await axios.delete(`${apiDomain}/api/time-table/timetables/${deleteTimeTableDialogOpen}/`, { headers });
    
        // Remove the timetable from the list in the state
        setSavedTables((prevTables) =>
          prevTables.filter((table) => table.id !== deleteTimeTableDialogOpen)
        );
    
        setDeleteTimeTableDialogOpen(false)
        toast.success('Timetable deleted successfully');
      } catch (error) {
        console.error('Error deleting timetable:', error);
        toast.error('Failed to delete timetable');
      
    };
    }
  }

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleViewToggle = () => {
    setIsTeacherView(!isTeacherView);
  };

  return (
    <div className="w-full h-full p-6 bg-gray-100 overflow-auto relative">
      <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
        Saved Timetables
      </Typography>

      <div className="space-y-4 ">
        {savedTables.map((table) => (
          <SavedTimeTableCard
            editingName={editingName}
            editingTableId={editingTableId}
            handleSetDefault={handleSetDefault}
            loadingDefault={loadingDefault}
            setDeleteTimeTableDialogOpen={setDeleteTimeTableDialogOpen}
            setEditingName={setEditingName}
            setEditingTableId={setEditingTableId}
            table={table}
            setSavedTables={setSavedTables}
          />
        ))}
        <div className="flex flex-col items-center space-y-4">
          <RoundButton isDisabled={!is_ready_for_timetable} />

          {!is_ready_for_timetable && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleWhyDisabled}
              className="mt-2"
            >
              Why can't I schedule my table?
            </Button>
          )}

          {scheduleErrorList.length > 0 && (
            <div className="mt-4">
              <Typography variant="h6" className="mb-2">
                Available Schedules:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {scheduleErrorList.map((schedule, index) => (
                  <Chip
                    key={index}
                    label={schedule}
                    color="primary"
                    variant="outlined"
                    className="cursor-pointer hover:bg-primary-100"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="w-full flex justify-between items-center mb-4">
          <Typography variant="h5" className="text-gray-800 font-bold">
            Weekly Timetable
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isTeacherView}
                onChange={handleViewToggle}
                color="primary"
              />
            }
            label={isTeacherView ? "Teacher View" : "Student View"}
          />
        </div>

        <div className="w-full flex justify-center mb-4">
          {Object.keys(weeklyTimetableTeacher).map((day) => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`px-4 py-2 text-sm font-medium border ${
                selectedDay === day
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:text-blue-800"
              } focus:z-10 focus:ring-2 focus:ring-blue-500 focus:bg-blue-500 focus:text-white
              first:rounded-l-lg last:rounded-r-lg
              transition-all duration-300`}
            >
              {day}
            </button>
          ))}
        </div>

        {isTeacherView ? (
          <TeacherTimeTableComponent
            teacherTimetable={weeklyTimetableTeacher[selectedDay]}
          />
        ) : (
          <TimeTableforStudentComponent
            StudentTimeTable={weeklyTimetablestudent[selectedDay]}
          />
        )}
      </div>

      <DeleteConfirmationPopup
            isOpen={deleteTimeTableDialogOpen}
            onClose={() => setDeleteTimeTableDialogOpen(false)}
            onConfirm={handleDelete}
            
          />
    </div>
  );
};

export default SavedTimeTables;
