import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete, Star, StarBorder } from "@mui/icons-material";
import TeacherTimeTableComponent from "../../components/specific/saved Time tables/TimeTableforTeacher";
import { weeklyTimetableTeacher, weeklyTimetablestudent,  } from "../../assets/datas";
import TimeTableforStudentComponent from "../../components/specific/saved Time tables/TimeTableforStudent";

const CustomChip = ({ label, color, icon }) => (
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color} transition-all duration-300 hover:shadow-md`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
  </div>
);

const SavedTimeTables = () => {
  const [savedTables, setSavedTables] = useState([
    {
      id: 1,
      name: "Summer Semester",
      date: "2024-07-01",
      score: 85,
      feasible: true,
      optimal: true,
      isDefault: true,
    },
    {
      id: 2,
      name: "Fall Semester",
      date: "2024-09-01",
      score: 75,
      feasible: true,
      optimal: false,
      isDefault: false,
    },
    {
      id: 3,
      name: "Winter Semester",
      date: "2025-01-01",
      score: 90,
      feasible: true,
      optimal: true,
      isDefault: false,
    },
  ]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loadingDefault, setLoadingDefault] = useState(null);
  const [isTeacherView, setIsTeacherView] = useState(true);

  const handleSetDefault = (id) => {
    setLoadingDefault(id);
    setTimeout(() => {
      setSavedTables(
        savedTables.map((table) => ({
          ...table,
          isDefault: table.id === id,
        }))
      );
      setLoadingDefault(null);
    }, 1500);
  };

  const handleDelete = (id) => {
    setSavedTables(savedTables.filter((table) => table.id !== id));
  };

  const getScoreChip = (score) => {
    let color, icon;
    if (score >= 90) {
      color = "bg-gradient-to-r from-green-400 to-green-600 text-white";
      icon = "🏆";
    } else if (score >= 70) {
      color = "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      icon = "⭐";
    } else {
      color = "bg-gradient-to-r from-red-400 to-red-600 text-white";
      icon = "❗";
    }
    return <CustomChip label={`Score: ${score}`} color={color} icon={icon} />;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleViewToggle = () => {
    setIsTeacherView(!isTeacherView);
  };

  return (
    <div className="w-full h-full p-6 bg-gray-100 overflow-auto">
      <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
        Saved Timetables
      </Typography>

      <div className="space-y-4">
        {savedTables.map((table) => (
          <Card
            key={table.id}
            className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 overflow-hidden"
          >
            <CardContent className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-blue-50">
              <div className="flex-grow">
                <Typography
                  variant="h6"
                  className="font-bold text-gray-800 mb-2"
                >
                  {table.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-3">
                  Created on {new Date(table.date).toLocaleDateString()}
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {getScoreChip(table.score)}
                  <CustomChip
                    label={table.feasible ? "Feasible" : "Not Feasible"}
                    color={
                      table.feasible
                        ? "bg-gradient-to-r from-green-200 to-green-300 text-green-800"
                        : "bg-gradient-to-r from-red-200 to-red-300 text-red-800"
                    }
                    icon={table.feasible ? "✅" : "❌"}
                  />
                  <CustomChip
                    label={table.optimal ? "Optimal" : "Not Optimal"}
                    color={
                      table.optimal
                        ? "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800"
                        : "bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800"
                    }
                    icon={table.optimal ? "🎯" : "🔄"}
                  />
                </Box>
              </div>
              <div className="flex items-center space-x-2">
                <IconButton
                  color="primary"
                  size="small"
                  className="bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(table.id)}
                  className="bg-red-100 hover:bg-red-200 transition-colors duration-300"
                >
                  <Delete />
                </IconButton>
                <Button
                  variant={table.isDefault ? "contained" : "outlined"}
                  color="primary"
                  startIcon={
                    loadingDefault === table.id ? (
                      <CircularProgress size={20} />
                    ) : table.isDefault ? (
                      <Star />
                    ) : (
                      <StarBorder />
                    )
                  }
                  onClick={() => handleSetDefault(table.id)}
                  size="small"
                  disabled={loadingDefault !== null}
                  className={
                    table.isDefault
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "border-green-500 text-green-500 hover:bg-green-50"
                  }
                >
                  {table.isDefault ? "Default" : "Set as Default"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
          <TimeTableforStudentComponent StudentTimeTable={weeklyTimetablestudent[selectedDay]}
           
          />
        )}
      </div>
    </div>
  );
};

export default SavedTimeTables;