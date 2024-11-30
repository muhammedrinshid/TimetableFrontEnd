import React from "react";

const TeacherViewHeading = ({ ele, setSelectedSession, indx }) => {
  return (
    <div
      onClick={() => setSelectedSession(() => Number(indx - 1))}
      className=" bg-white cursor-pointer sticky bg-opacity-70 backdrop-blur-sm shadow-bottom1 top-0 z-20 flex justify-center py-1 max-h-12 first:rounded-tl-lg last:rounded-tr-lg border border-opacity-10 border-gray-300"
    >
      <p className="text-xs font-medium text-text_2 m-2">{ele}</p>
    </div>
  );
};

export default TeacherViewHeading;
