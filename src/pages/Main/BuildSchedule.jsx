import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import { Add as AddIcon, CheckCircle, Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";
import GeneratedTimeTableViewer from "../../components/specific/BuildSchedule/GeneratedTimeTableViewer";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Chip,
  Alert,
} from "@mui/material";
import { ScheduleLoading } from "../../components/common";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const BuildSchedule = () => {
  const { apiDomain, logoutUser, headers } = useAuth();
  const [scheduleErrorList, setScheduleErrorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generatingTime, setGeneratingTime] = useState(30);
  const [canGenerate, setCanGenerate] = useState(false);
  const [generatedTimetableId, setGeneratedTimetableId] = useState(null);
  const [generatedTimetableScore, setGeneratedTimetableScore] = useState({
    soft: 0,
    hard: 0,
    score: 0,
  });
  const [editTimeTableOpen, setEditTimeTableOpen] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    handleWhyDisabled();
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 91);
        });
      }, 500);
    } else {
      setLoadingProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleWhyDisabled = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/check-class-subjects/`,
        { headers }
      );
      setScheduleErrorList(response.data.reasons);
      setCanGenerate(response.data.reasons.length === 0);
      toast.success("Schedule status retrieved successfully");
    } catch (error) {
      toast.error("Failed to retrieve schedule status");
    }
  };

  const handleGenerateTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/build-timetable/${generatingTime}/`,
        {
          headers,
        }
      );
      setGeneratedTimetableId(response.data.timetable);
      setGeneratedTimetableScore(response.data.scores);
      toast.success("Schedule generated successfully");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineTimetable = async () => {
    try {
      await axios.delete(
        `${apiDomain}/api/time-table/timetables/${generatedTimetableId}/`,
        { headers }
      );
      toast.info("Schedule declined and deleted");
      setGeneratedTimetableId(null);
    } catch (error) {
      console.error("Error deleting timetable:", error);
      toast.error("Failed to delete timetable");
    }
  };

  const handleError = (err) => {
    if (err.response) {
      console.error("Response error:", err.response.status, err.response.data);
      if (err.response.status === 401) {
        toast.error("Error occurred: Unauthorized access");
        logoutUser();
      } else {
        toast.error(
          `Error occurred: ${err.response.data?.message || "Unexpected error"}`
        );
      }
    } else if (err.request) {
      console.error("No response received:", err.request);
      toast.error("Error occurred: No response from server");
    } else {
      console.error("Error", err.message);
      toast.error(`Error occurred: ${err.message}`);
    }
  };
  const handleEditTimeTableOpen = () => setEditTimeTableOpen(true);
  const handleEditTimeTableclose = () => setEditTimeTableOpen(false);
  const handleAcceptTimetable = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the timetable");
      return;
    }

    try {
      const response = await axios.put(
        `${apiDomain}/api/time-table/timetables/${generatedTimetableId}/`,
        { name },
        { headers }
      );
      console.log("Timetable updated successfully:", response.data);
      toast.success("Schedule accepted and saved");
      setGeneratedTimetableId(null);
      handleEditTimeTableclose();
      // You can add additional logic here, such as updating the UI or state
    } catch (error) {
      console.error("Error updating timetable:", error);
      toast.error("Failed to update timetable. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className="p-4 overflow-y-auto h-full bg-background1 dark:"
    >
      <div className="flex flex-col justify-between max-w-full mx-auto bg-white dark:bg-dark-primaryShades-700 rounded-xl shadow-lg dark:shadow-dark-shadow overflow-hidden min-h-full flex-grow">
        <div className="p-6 sm:p-10">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-dark-text text-center">
            Build Your Schedule
          </h1>

          {scheduleErrorList.length > 0 ? (<div className="mb-8 bg-red-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center text-red-600">
                Unable to Generate Schedule
              </h2>
              <p className="mb-4 text-center text-gray-700">
                Please resolve the following issues:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {scheduleErrorList.map((reason, index) => (
                  <Chip
                    key={index}
                    label={reason}
                    color="error"
                    variant="outlined"
                    className="text-sm"
                  />
                ))}
              </div>
            </div>
          )  : (
            <div className="mb-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg flex items-center justify-center">
              <CheckCircle
                className="text-green-500 dark:text-green-400 mr-3"
                fontSize="large"
              />
              <p className="text-xl text-green-700 dark:text-green-400 font-semibold">
                You're all set! Ready to generate your schedule.
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-6 mb-8">
            <p className="text-xl text-gray-700 dark:text-dark-text font-medium">
              Generation Time: {generatingTime} seconds
            </p>
            <Slider
              value={generatingTime}
              onChange={(_, newValue) => setGeneratingTime(newValue)}
              min={30}
              max={1200}
              step={30}
              marks={[
                { value: 30, label: "30s" },
                { value: 300, label: "5m" },
                { value: 1200, label: "20m" },
              ]}
              valueLabelDisplay="auto"
              className="w-full max-w-md"
            />
          </div>

          <div className="flex justify-center mb-8">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleGenerateTimetable}
              disabled={!canGenerate || loading}
              className="w-64 h-12 text-lg dark:bg-dark-primary dark:hover:bg-dark-primary-600 dark:disabled:bg-dark-primary-300"
              style={{
                background: canGenerate
                  ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                  : "gray",
                boxShadow: canGenerate
                  ? "0 3px 5px 2px rgba(33, 203, 243, .3)"
                  : "none",
              }}
            >
              {loading ? "Generating..." : "Generate Schedule"}
            </Button>
          </div>

          {loading && (
            <div className="mb-8">
              <ScheduleLoading minDuration={generatingTime} />
            </div>
          )}

          {generatedTimetableId && (
            <div className="flex justify-center gap-6 mb-8">
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleEditTimeTableOpen}
                className="w-48 h-12 text-lg dark:bg-dark-success dark:hover:bg-dark-success-600"
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={handleDeclineTimetable}
                className="w-48 h-12 text-lg dark:bg-dark-error dark:hover:bg-dark-error-600"
              >
                Decline
              </Button>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2">
          <div className="flex items-center bg-yellow-50 text-yellow-800 p-4 border-l-4 border-yellow-400 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-600">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400 dark:text-yellow-500" />
            <p>
              This solution will be automatically saved to your timetable unless
              declined. If this is not your preferred option, please ensure you
              decline it to avoid saving.
            </p>
          </div>
        </div>
      </div>

      {generatedTimetableId && (
        <div className="mt-8 border-t border-gray-200 dark:border-dark-border pt-8 sm:px-10">
          <GeneratedTimeTableViewer
            timeTableId={generatedTimetableId}
            generatedTimetableScore={generatedTimetableScore}
          />
        </div>
      )}

      <Dialog
        open={editTimeTableOpen}
        onClose={handleEditTimeTableclose}
        PaperProps={{
          className: "dark:bg-dark-background dark:text-dark-text",
        }}
      >
        <DialogTitle className="dark:text-dark-text">
          Accept Timetable
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Timetable Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              className: "dark:text-dark-text dark:border-dark-border",
            }}
            InputLabelProps={{
              className: "dark:text-dark-muted",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditTimeTableclose}
            className="dark:text-dark-text"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAcceptTimetable}
            color="primary"
            className="dark:bg-dark-primary dark:hover:bg-dark-primary-600"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default BuildSchedule;
