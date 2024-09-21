import React, { useEffect, useState } from "react";
import { Typography, Button, Chip } from "@mui/material";

import RoundButton from "../../components/common/RoundButton";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";
import SavedTimeTableCard from "../../components/specific/saved Time tables/SavedTimeTableCard";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import SavedTimeTableViewer from "../../components/specific/saved Time tables/SavedTimeTableViewer";

const SavedTimeTables = () => {
  const { is_ready_for_timetable, apiDomain, headers } = useAuth();
  const [savedTables, setSavedTables] = useState([]);
  const [scheduleErrorList, setScheduleErrorList] = useState([]);
  const [editingTableId, setEditingTableId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTimeTableDialogOpen, setDeleteTimeTableDialogOpen] =
    useState(false);
  

    
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



  const [loadingDefault, setLoadingDefault] = useState(null);

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

  const handleDelete = async () => {
    let timetable = savedTables.find(
      (table) => table.id == deleteTimeTableDialogOpen
    );
    console.log(timetable);
    if (timetable?.is_default) {
      toast.info("change the default");
    } else {
      try {
        // Call the API to delete the timetable
        await axios.delete(
          `${apiDomain}/api/time-table/timetables/${deleteTimeTableDialogOpen}/`,
          { headers }
        );

        // Remove the timetable from the list in the state
        setSavedTables((prevTables) =>
          prevTables.filter((table) => table.id !== deleteTimeTableDialogOpen)
        );

        setDeleteTimeTableDialogOpen(false);
        toast.success("Timetable deleted successfully");
      } catch (error) {
        console.error("Error deleting timetable:", error);
        toast.error("Failed to delete timetable");
      }
    }
  };

  const onSubmitEdit = async (id, name) => {
    try {
      const response = await axios.put(
        `${apiDomain}/api/time-table/timetables/${id}/`,
        { name },
        { headers }
      );

      console.log("Timetable updated successfully:", response.data);
      fetchTimetables()
      // You can add additional logic here, such as updating the UI or state
    } catch (error) {
      console.error("Error updating timetable:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
      throw error;
    }
  };

  return (
    <div className="w-full h-full p-6  overflow-auto relative">
      <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
        Saved Timetables
      </Typography>

      <div className="space-y-4 ">
        {savedTables.map((table) => (
          <SavedTimeTableCard
            editingName={editingName}
            editingTableId={editingTableId}
            handleSetDefault={handleSetDefault}
            isLoadingDefault={loadingDefault}
            setDeleteTimeTableDialogOpen={setDeleteTimeTableDialogOpen}
            setEditingName={setEditingName}
            setEditingTableId={setEditingTableId}
            table={table}
            setSavedTables={setSavedTables}
            onSubmitEdit={onSubmitEdit}
          />
        ))}
        <div className="flex flex-col items-center space-y-4">
          

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

      <SavedTimeTableViewer />

      <DeleteConfirmationPopup
        isOpen={deleteTimeTableDialogOpen}
        onClose={() => setDeleteTimeTableDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SavedTimeTables;
