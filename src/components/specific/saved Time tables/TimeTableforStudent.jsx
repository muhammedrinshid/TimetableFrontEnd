import React from 'react';
import { useAuth } from '../../../context/Authcontext';

const StudentTimeTableComponent = ({ StudentTimeTable }) => {
  const { NumberOfPeriodsInAday } = useAuth();

  const studentRow = [
    "Time",
    ...Array(NumberOfPeriodsInAday).fill().map((_, i) => `Session${i + 1}`)
  ];

  const getSessionColor = (session) => {
    switch (session.type) {
      case 'Core': return 'bg-blue-100 text-blue-800';
      case 'Elective': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Timetable</h2>
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="w-1/6 p-4 text-left font-semibold">{studentRow[0]}</th>
              {studentRow.slice(1).map((header, index) => (
                <th key={index} className="w-1/12 p-4 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
  {StudentTimeTable.map((dayData, dayIndex) => {
    const [day, sessions] = Object.entries(dayData)[0];
    return (
      <tr key={dayIndex} className="bg-white hover:bg-gray-50 transition-colors duration-300">
        <td className="border-b p-4 font-bold text-gray-800">{day}</td>
        {sessions.sessions.slice(0, NumberOfPeriodsInAday).map((session, sessionIndex) => (
          <td key={sessionIndex} className="border-b p-2">
            <div className={`rounded-lg p-2 h-full ${getSessionColor(session)} transition-all duration-300 hover:shadow-md`}>
              <p className="font-semibold text-xs mb-1 truncate">{session.subject}</p>
              <p className="text-xs mb-1 truncate">{session.room}</p>
              <p className="text-xs truncate">{session.type}</p>
              {session.type === 'Core' && session.teacher && (
                <div className="flex items-center mt-1">
                  <img src={session.teacher.image} alt={session.teacher.name} className="w-6 h-6 rounded-full mr-2"/>
                  <span className="text-xs truncate">{session.teacher.name}</span>
                </div>
              )}
            </div>
          </td>
        ))}
      </tr>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTimeTableComponent;