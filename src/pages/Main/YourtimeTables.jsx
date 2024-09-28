import React, { useEffect, useState } from "react";
import { Typography, Button, Chip } from "@mui/material";

import RoundButton from "../../components/common/RoundButton";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";
import SavedTimeTableCard from "../../components/specific/saved Time tables/SavedTimeTableCard";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import SavedTimeTableViewer from "../../components/specific/saved Time tables/SavedTimeTableViewer";
import { SearchInput } from "../../components/Mui components";
import { SortMenu } from "../../components/specific/Teachers";
import TimeTableSortMenu from "../../components/specific/saved Time tables/TimeTableSortMenu";

const SavedTimeTables = () => {
  const { is_ready_for_timetable, apiDomain, headers } = useAuth();
  const [savedTables, setSavedTables] = useState([]);
  const [scheduleErrorList, setScheduleErrorList] = useState([]);
  const [editingTableId, setEditingTableId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [sortType, setSortType] = useState("Date Ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTimeTableDialogOpen, setDeleteTimeTableDialogOpen] =
    useState(false);
  const [visibleTables, setVisibleTables] = useState(4);

  const loadMore = () => {
    setVisibleTables((prevVisible) => prevVisible + 4);
  };

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
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
  const sortTimetables = (a, b) => {
    // Always prioritize the default timetable first
    if (a.is_default && !b.is_default) return -1;
    if (!a.is_default && b.is_default) return 1;

    // Sorting logic based on sortType
    switch (sortType) {
      case "Name A-Z":
        return a.name.localeCompare(b.name);
      case "Name Z-A":
        return b.name.localeCompare(a.name);
      case "Date Ascending":
        return new Date(a.date) - new Date(b.date);
      case "Date Descending":
        return new Date(b.date) - new Date(a.date);
      default:
        return 0;
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
      fetchTimetables();
      // You can add additional logic here, such as updating the UI or state
    } catch (error) {
      console.error("Error updating timetable:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
      throw error;
    }
  };
 const filteredAndSortedTimetables = savedTables
   .filter((table) =>
     table.name.toLowerCase().includes(searchTerm.toLowerCase())
   )
   .sort(sortTimetables);
  return (
    <div className="w-full h-full px-6 pb-6  overflow-auto ">
      <div className="relative">
        <div className=" flex flex-row justify-start items-center gap-10 p-3 mb-5 sticky top-0 bg-dark-background1 shadow-custom-2 rounded-lg z-20">
          <h3 className="text-gray-800 font-semibold text-2xl flex-grow">
            {" "}
            Saved Timetables
          </h3>
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <SearchInput value={searchTerm} onChange={handleSearchChange} />
          </div>
          <div className="p-1 bg-white rounded-2xl  shadow-custom-8">
            <TimeTableSortMenu setSortType={setSortType} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-4 2xl:space-y-0 2xl:grid 2xl:grid-cols-2 2xl:gap-4">
            {filteredAndSortedTimetables
              .slice(0, visibleTables)
              .map((table) => (
                <SavedTimeTableCard
                  key={table.id}
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
          </div>

          {visibleTables < savedTables.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Load More
              </button>
            </div>
          )}

          <div className="col-span-2 flex flex-col items-center space-y-4 mt-4">
            {scheduleErrorList.length > 0 && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2">
                  Available Schedules:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {scheduleErrorList.map((schedule, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                    >
                      {schedule}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
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
