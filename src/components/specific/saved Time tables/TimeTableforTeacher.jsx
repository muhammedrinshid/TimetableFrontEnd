import React, { useContext } from 'react';
import { useAuth } from '../../../context/Authcontext';


const TeacherTimeTableComponent = ({teacherTimetable}) => {



  const { NumberOfPeriodsInAday } = useAuth()
  const teacherRow1 = [
    "Instructor",
    ...Array(NumberOfPeriodsInAday).fill().map((_, i) => `Session${i + 1}`)
  ];

  const getSessionColor = (session) => {
    if (!session.subject) return 'bg-green-100 text-green-800'; // Free period
    switch (session.type) {
      case 'Core': return 'bg-blue-100 text-blue-800';
      case 'Elective': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Teacher Timetable</h2>
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="w-1/6 p-4 text-left font-semibold">{teacherRow1[0]}</th>
              {teacherRow1.slice(1).map((header, index) => (
                <th key={index} className="w-1/12 p-4 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teacherTimetable.map((teacher, teacherIndex) => (
              <tr key={teacherIndex} className="bg-white hover:bg-gray-50 transition-colors duration-300">
                <td className="border-b p-4">
                  <div className="flex items-center space-x-3">
                    <img src={teacher.instructor.image} alt={teacher.instructor.name} className="w-10 h-10 rounded-full shadow-md"/>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-gray-800 truncate">{teacher.instructor.name}</p>
                      <p className="text-xs text-gray-500 truncate">{teacher.instructor.teacher_id}</p>
                    </div>
                  </div>
                </td>
                {teacher.sessions.slice(0, NumberOfPeriodsInAday).map((session, sessionIndex) => (
                  <td key={sessionIndex} className="border-b p-2">
                    <div className={`rounded-lg p-2 h-full ${getSessionColor(session)} transition-all duration-300 hover:shadow-md`}>
                      {session.subject ? (
                        <>
                          <p className="font-semibold text-xs mb-1 truncate">{session.subject}</p>
                          <p className="text-xs mb-1 truncate">{session.room}</p>
                          <p className="text-xs truncate">
                            {session.type} | {session.standard} {session.division}
                          </p>
                        </>
                      ) : (
                        <span className="font-medium text-xs">Free Period</span>
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