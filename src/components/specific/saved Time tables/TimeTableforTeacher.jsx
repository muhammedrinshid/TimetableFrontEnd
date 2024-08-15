import React, { useContext } from "react";
import { useAuth } from "../../../context/Authcontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDoorOpen, faUsers, faClock } from '@fortawesome/free-solid-svg-icons';

const TeacherTimeTableComponent = ({ teacherTimetable }) => {
  const { NumberOfPeriodsInAday } = useAuth();
  const teacherRow1 = [
    "Instructor",
    ...Array(NumberOfPeriodsInAday)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];

  const getSessionColor = (session) => {
    if (!session.subject) return "bg-green-100 text-green-800"; // Free period
    switch (session.type) {
      case "Core":
        return "bg-blue-100 text-blue-800";
      case "Elective":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-pulse">
        Teacher Timetable
      </h2>
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="w-1/6 p-4 text-left font-semibold">
                {teacherRow1[0]}
              </th>
              {teacherRow1.slice(1).map((header, index) => (
                <th key={index} className="w-1/12 p-4 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teacherTimetable.map((teacher, teacherIndex) => (
              <tr
                key={teacherIndex}
                className="bg-white hover:bg-gray-50 transition-colors duration-300 transform hover:scale-102"
              >
                <td className="border-b p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={teacher.instructor.image}
                      alt={teacher.instructor.name}
                      className="w-10 h-10 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-gray-800 truncate">
                        {teacher.instructor.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {teacher.instructor.teacher_id}
                      </p>
                    </div>
                  </div>
                </td>
                {teacher.sessions
                  .slice(0, NumberOfPeriodsInAday)
                  .map((session, sessionIndex) => (
                    <td key={sessionIndex} className="border-b p-2">
                      <div
                        className={`rounded-lg p-2 h-full ${getSessionColor(
                          session
                        )} transition-all duration-300 hover:shadow-md hover:scale-105`}
                      >
                        {session.subject ? (
                          <div className="session-card">
                            <h3 className="font-semibold text-lg mb-1">
                              <FontAwesomeIcon icon={faBook} className="mr-2" />
                              {session.subject || session.elective_subject_name}
                            </h3>
                            <p className="room text-sm mb-1">
                              <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
                              {session.room}
                            </p>
                            <p className={`session-type ${session.type.toLowerCase()} text-xs font-bold uppercase mb-2`}>
                              {session.type}
                            </p>
                            <div className="class-details text-xs">
                              {session.class_details.map((classDetail, index) => (
                                <div key={index} className="class-info flex justify-between items-center mb-1">
                                  <span className="class-name">
                                    <FontAwesomeIcon icon={faUsers} className="mr-1" />
                                    {classDetail.standard} {classDetail.division}
                                  </span>
                                  {session.type === "Elective" && (
                                    <span className="student-count text-gray-600">
                                      ({classDetail.number_of_students} students)
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="free-period text-center py-4">
                            <FontAwesomeIcon icon={faClock} className="text-2xl mb-2" />
                            <p className="font-semibold">Free Period</p>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTimeTableComponent;