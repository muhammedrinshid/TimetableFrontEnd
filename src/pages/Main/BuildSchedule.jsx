import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import { Button, IconButton, Slider } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const BuildSchedule = () => {
  const { apiDomain, logoutUser, headers } = useAuth();
  const [scheduleErrorList, setScheduleErrorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingTime, setGeneratingTime] = useState(30);
  const [canGenerate, setCanGenerate] = useState(false);
  const [generatedTimetableId, setGeneratedTimetableId] = useState(null);

  useEffect(() => {
    handleWhyDisabled();
  }, []);

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
      const response = await axios.get(`${apiDomain}/api/time-table/`, {
        headers,
      });
      setGeneratedTimetableId(response.data.timetable);
      toast.success("Schedule generated successfully");
    } catch (err) {
      if (err.response) {
        console.error(
          "Response error:",
          err.response.status,
          err.response.data
        );
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(
            `Error occurred: ${
              err.response.data?.message || "Unexpected error"
            }`
          );
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("Error occurred: No response from server");
      } else {
        console.error("Error", err.message);
        toast.error(`Error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTimetable = () => {
    toast.success("Schedule accepted and saved");
    setGeneratedTimetableId(null);
  };

  const handleDeclineTimetable = () => {
    toast.info("Schedule declined and deleted");
    setGeneratedTimetableId(null);
  };

  return (
    <div className=" flex items-center justify-center h-full bg-dark-background1  relative">
      <div className="  rounded-lg  flex flex-col  items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6 text-dark-primary">
          Build Schedule
        </h1>

        {scheduleErrorList.length > 0 ? (
          <div className="mb-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-2 text-center text-red-500">
              Unable to Generate Schedule
            </h2>
            <p className="mb-4 text-center text-gray-700">
              Please resolve the following issues:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {scheduleErrorList.map((reason, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="mb-6 text-center text-green-600 font-semibold">
            You are eligible to generate the schedule. All conditions are met!
          </p>
        )}

        <div className="flex flex-col items-center gap-4 mb-6">
          <p className="text-dark-primary">
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
            className="w-64"
          />
        </div>

        <IconButton
          color="primary"
          
          variant="contained"
          onClick={handleGenerateTimetable}
          disabled={!canGenerate || loading}
          className="mb-6 bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
          size="large"
          sx={{
            width: "80px",
            height: "80px",
            backgroundColor:"red"
          }}
        >
          {loading ? (
            <div className="animate-pulse flex space-x-1">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          ) : (
            <AddIcon fontSize="large" sx={{ color: "white" }} />
          )}
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "50%",
            minWidth: "56px",
            width: "56px",
            height: "56px",
          }}
          onClick={handleGenerateTimetable}
          disabled={!canGenerate || loading}
        >
          <AddIcon sx={{ color: "white" }} />
        </Button>

        {generatedTimetableId && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAcceptTimetable}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
            >
              Accept Schedule
            </button>
            <button
              onClick={handleDeclineTimetable}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
            >
              Decline Schedule
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="text-dark-primary font-semibold">
                Generating schedule...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildSchedule;
