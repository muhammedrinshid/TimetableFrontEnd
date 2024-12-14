import React from "react";
import { useAuth } from "../../../context/Authcontext";


const AbbreviatedTeacherTimetable = ({ weekTimetable }) => {
  const weeklyscheduleHeader = weekTimetable?.weekly_schedule_header || [];
  const teacherTimetableBody = weekTimetable?.condensed_teacher_timetable || [];
  const {formatTime}=useAuth()

  return (
    <div className=" bg-slate-200 shadow-lg rounded-xl overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden">
        {/* Days Header */}
        <thead>
          <tr>
            <th className="border border-gray-300 bg-blue-600 text-white text-lg font-bold p-3 rounded-tl-xl">
              Teachers
            </th>
            {weeklyscheduleHeader?.map((weekly_schedule, dayIndex) => (
              <React.Fragment key={weekly_schedule.day}>
                <th
                  colSpan={weekly_schedule?.teaching_slots}
                  className="border border-gray-300 bg-blue-600 text-white text-lg font-bold p-3"
                >
                  {weekly_schedule?.day_name}
                </th>
                {/* Separator column */}
                {dayIndex < weeklyscheduleHeader.length - 1 && (
                  <th className="border border-gray-300 bg-gray-100 w-2"></th>
                )}
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <th className="border border-gray-300 bg-blue-100 text-blue-800"></th>
            {weeklyscheduleHeader?.map((weekly_schedule, dayIndex) => (
              <React.Fragment key={`slots-${weekly_schedule.day}`}>
                {Array.from({ length: weekly_schedule?.teaching_slots })?.map(
                  (_, index) => {
                    const period = weekly_schedule.periods?.[index]; // Safe access to periods
                    return (
                      <th
                        key={index}
                        className="border border-gray-300 bg-blue-100 text-blue-800 text-sm font-medium p-2"
                      >
                        {index + 1}
                        <br />
                        {period ? (
                          <span className="text-vs text-gray-600">
                            {formatTime(period.start_time)}
                            <br />
                            <span className="text-vs">-</span>
                            <br />
                            {formatTime(period.end_time)}
                          </span>
                        ) : (
                          <span className="text-vs text-gray-600">
                            No Period
                          </span>
                        )}
                      </th>
                    );
                  }
                )}
                {/* Separator column */}
                {dayIndex < weeklyscheduleHeader.length - 1 && (
                  <th className="border border-gray-300 bg-gray-100 w-2"></th>
                )}
              </React.Fragment>
            ))}
          </tr>
        </thead>

        {/* Timetable Rows */}
        <tbody>
          {teacherTimetableBody.map((teacherData, rowIndex) => (
            <tr key={rowIndex}>
              {/* Classroom identifier with reduced teacher ID */}
              <td className="border border-gray-300 font-semibold bg-blue-50 p-3 text-blue-900 text-sm">
                <div className="text-sm">
                  {teacherData?.teacher_details?.full_name}
                </div>
                <div className="text-[0.6rem] text-blue-700">
                  {teacherData?.teacher_details?.teacher_id}
                </div>
              </td>

              {/* Loop through all days and render sessions */}
              {Object.keys(teacherData?.timetable_rows).map((day, dayIndex) => {
                const dayInfo = weeklyscheduleHeader.find(
                  (item) => item.day === day
                );
                const dayDataSessions = teacherData?.timetable_rows[day] || [];

                const requiredLength = dayInfo?.teaching_slots || 0;

                // Adjust sessions to match teaching slots
                while (dayDataSessions.length < requiredLength) {
                  dayDataSessions.push([]);
                }

                // Render sessions for the day and add separator column
                return (
                  <React.Fragment key={day}>
                    {dayDataSessions.map((sessionGrp, sessionGrpIndx) => (
                      <td
                        key={`${day}-${sessionGrpIndx}`}
                        className="border border-gray-300 p-2 align-top"
                      >
                        <div className="flex flex-col items-center justify-start gap-2 h-full">
                          {sessionGrp.length === 0
                            ? null
                            : sessionGrp.map((session, idx) => (
                                <div
                                  key={idx}
                                  className="w-full text-center relative"
                                >
                                  <span
                                    className={`
                                      w-full block py-1 px-2 rounded 
                                      ${
                                        session?.is_elective
                                          ? "bg-purple-200 text-purple-900"
                                          : "bg-blue-200 text-blue-900"
                                      }
                                      text-xs font-semibold truncate 
                                      relative
                                    `}
                                  >
                                    {session?.subject}
                                    {session?.room_no && (
                                      <span
                                        className="absolute bottom-0 right-0 
                                          text-[0.5rem] text-gray-500 
                                          bg-white/70 px-1 rounded-tl"
                                      >
                                        {session?.room_no}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                        </div>
                      </td>
                    ))}
                    {/* Separator column */}
                    {dayIndex <
                      Object.keys(teacherData?.timetable_rows).length - 1 && (
                      <td className="border border-gray-300 bg-gray-50 w-2"></td>
                    )}
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbbreviatedTeacherTimetable;
