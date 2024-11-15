import React, { useEffect, useState } from "react";
import { Typography, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";

import RoundButton from "../../components/common/RoundButton";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";
import SavedTimeTableCard from "../../components/specific/saved Time tables/SavedTimeTableCard";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import SavedTimeTableViewer from "../../components/specific/saved Time tables/SavedTimeTableViewer";
import { SearchInput } from "../../components/Mui components";
import TimeTableSortMenu from "../../components/specific/saved Time tables/TimeTableSortMenu";
import NoSavedTimetables from "../../components/empty state management components/NoSavedTimetables";

const SavedTimeTables = () => {
  const { apiDomain, headers } = useAuth();
  const [savedTables, setSavedTables] = useState([]);
  const [scheduleErrorList, setScheduleErrorList] = useState([]);
  const [editingTableId, setEditingTableId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [sortType, setSortType] = useState("Date Ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTimeTableDialogOpen, setDeleteTimeTableDialogOpen] =
    useState(false);
  const [defaultTableId, setDefaultTableId] = useState(null);
  const [visibleTables, setVisibleTables] = useState(4);
  const [loadingDefault, setLoadingDefault] = useState(null);

  const loadMore = () => {
    setVisibleTables((prevVisible) => prevVisible + 4);
  };

  const fetchTimetables = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/timetables/`,
        { headers }
      );
      setSavedTables(response.data);
      const defaultTable = response.data.find((table) => table.is_default);
      if (defaultTable) {
        setDefaultTableId(defaultTable.id);
      }
    } catch (error) {
      if (error.response) {
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
        console.error("No response received:", error.request);
        toast.error("Failed to retrieve timetables: No response from server");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Failed to retrieve timetables: Network error");
      }
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const handleSetDefault = async (id) => {
    setLoadingDefault(id);
    try {
      const response = await axios.patch(
        `${apiDomain}/api/time-table/set-default/${id}/`,
        {},
        { headers }
      );
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
    if (timetable?.is_default) {
      toast.info("Change the default timetable first");
    } else {
      try {
        await axios.delete(
          `${apiDomain}/api/time-table/timetables/${deleteTimeTableDialogOpen}/`,
          { headers }
        );
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
    if (a.is_default && !b.is_default) return -1;
    if (!a.is_default && b.is_default) return 1;

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
    } catch (error) {
      console.error("Error updating timetable:", error);
      throw error;
    }
  };

  const filteredAndSortedTimetables = savedTables
    .filter((table) =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortTimetables);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className="w-full h-full px-6 pb-6 overflow-auto"
    >
      <div className="relative">
        <div className="flex flex-row justify-start items-center gap-10 p-3 mb-5 sticky top-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300  z-20">
          <h3 className="text-gray-800 dark:text-dark-text font-semibold text-2xl flex-grow">
            Saved Timetables
          </h3>
          <div className="p-1 rounded-2xl basis-2/5 h-fit shadow-custom-8 ">
            <SearchInput value={searchTerm} onChange={handleSearchChange} />
          </div>
          <div className="p-1 bg-white dark:bg-gray-700 rounded-2xl ">
            <TimeTableSortMenu setSortType={setSortType} />
          </div>
        </div>

        <div className="space-y-4">
           {
           (!savedTables?.length&&(<NoSavedTimetables/>))
          }
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
                className="px-4 py-2 bg-blue-500 dark:bg-dark-accent text-white rounded hover:bg-blue-600 dark:hover:bg-dark-accent/90 transition duration-300"
              >
                Load More
              </button>
            </div>
          )}

          <div className="col-span-2 flex flex-col items-center space-y-4 mt-4">
            {scheduleErrorList.length > 0 && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2 dark:text-dark-text">
                  Available Schedules:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {scheduleErrorList.map((schedule, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-dark-accent/20 text-blue-800 dark:text-dark-accent cursor-pointer hover:bg-blue-200 dark:hover:bg-dark-accent/30"
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

      <SavedTimeTableViewer timeTableId={defaultTableId} />

      <DeleteConfirmationPopup
        isOpen={deleteTimeTableDialogOpen}
        onClose={() => setDeleteTimeTableDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
};

export default SavedTimeTables;
