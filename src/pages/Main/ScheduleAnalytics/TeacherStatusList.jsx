import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useAuth } from '../../../context/Authcontext';
import { Avatar } from '@mui/material';
import { ChevronRightIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import TeacherTimetableDialog from './TeacherTimetableDialog';

const TeacherStatusList = ({ teachersWeekAnalytics }) => {
  const { apiDomain,headers } = useAuth();

  const [teacherWeeklyTimetable, setTeacherWeeklyTimetable] = useState(null);
  const [timetableDaySchedules, setTimetableDaySchedules] = useState(null);

    const [dialogState, setDialogState] = useState({ isOpen: false, teacherId: null,teacherDetail:null });
    const fetchTeacherWeekTimetable = async (teacherId) => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/time-table/teacher-timetable-week/${teacherId}/`,
          { headers }
        );
        setTeacherWeeklyTimetable(response.data?.day_timetable);
        setTimetableDaySchedules(response.data?.day_schedules);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            toast.info(
              "This teacher has not been included in the default timetable optimization"
            );
          } else {
            toast.error(
              `Failed to retrieve timetables: ${
                error.response.data.message || "Server error"
              }`
            );
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
          toast.error("Failed to retrieve timetables: No response from server");
        } else {
          console.error("Error setting up request:", error.message);
          toast.error("Failed to retrieve timetables: Network error");
        }
      }
    };



    useEffect(()=>{

      if (dialogState?.isOpen && dialogState?.teacherId) {
        fetchTeacherWeekTimetable(dialogState?.teacherId)
      }
    },[dialogState])
    const handleOpen = async (teacherDetail) => {
      setDialogState({ isOpen: true, teacherId:teacherDetail?.id,teacherDetail:teacherDetail });
    };
    const handleClose = () => {
      setDialogState({ isOpen: false, teacherId: null,teacherDetail:null });
      setTeacherWeeklyTimetable(null);
      setTimetableDaySchedules(null);
    };
  

  if (!teachersWeekAnalytics || teachersWeekAnalytics.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 p-2">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-none p-3">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            
            <div className="h-40 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-700 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-1 px-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mx-auto mb-1" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mx-auto" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-1 px-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mx-auto mb-1" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      {teachersWeekAnalytics.map((teacher) => (
        <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-none p-3 hover:shadow-lg dark:hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="flex items-center space-x-2">
              <Avatar
                src={`${apiDomain}${teacher.profile_image}`}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.8rem",
                  bgcolor: "secondary.main",
                  marginRight: "8px",
                }}
              />
              <div>
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                  {teacher.name} {teacher.surname}
                </h3>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer "         onClick={() => handleOpen(teacher)} // Replace with actual teacher ID
            >
              <p className="text-sm font-medium">View week timetable</p>
              <ChevronRightIcon size={16} />
            </div>
          </div>
          
          <div className="h-40 relative">
            <ResponsivePie
              data={[
                {
                  id: 'Working',
                  label: 'Working',
                  value: teacher.working_sessions_in_a_week,
                  color: '#4F46E5',
                },
                {
                  id: 'Free',
                  label: 'Free',
                  value: teacher.free_sessions_in_a_week,
                  color: '#E5E7EB',
                },
              ]}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              innerRadius={0.65}
              padAngle={0.5}
              cornerRadius={4}
              activeOuterRadiusOffset={4}
              colors={{ datum: 'data.color' }}
              borderWidth={0}
              enableArcLinkLabels={false}
              arcLabel={(d) => `${d.value}`}
              arcLabelsRadiusOffset={0.45}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 4]] }}
              motionConfig="gentle"
              transitionMode="centerRadius"
              enableArcLabels={true}
              arcLabelsComponent={({ datum, label, style }) => (
                <g transform={style.transform}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={style.textColor}
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </text>
                </g>
              )}
            />
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Avatar
                src={`${apiDomain}${teacher.profile_image}`}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.8rem",
                  bgcolor: "secondary.main",
                  marginRight: "8px",
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-indigo-50 dark:bg-gray-700 rounded-lg py-1 px-2 text-center">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Working</p>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                {teacher.working_sessions_in_a_week}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-600 rounded-lg py-1 px-2 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Free</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-400">
                {teacher.free_sessions_in_a_week}
              </p>
            </div>
          </div>
        </div>
      ))}


      <TeacherTimetableDialog handleClose={handleClose} open={dialogState.isOpen} teacherWeeklyTimetable={teacherWeeklyTimetable} dialogState={dialogState} timetableDaySchedules={timetableDaySchedules} />
    </div>
  );
};

export default TeacherStatusList;