import React, { useState } from "react";
import ClassDetails from "../../components/specific/ClassInSchool/ClassDetails";
import ReactCardFlip from "react-card-flip";
import ClassList from "../../components/specific/ClassInSchool/ClassList";

const ClassesInSchool = ({}) => {

  const [selectedClassforView, setISelectedClassforView] = useState({
    isOpen: false,
  });
  return (
    <ReactCardFlip
      containerClassName="pl-6 pr-4 pb-6   grid grid-rows-[1fr_4fr] overflow-auto   "
      isFlipped={selectedClassforView.isOpen}
      flipDirection="vertical"
    >
      <ClassList setISelectedClassforView={setISelectedClassforView} />
      <ClassDetails setISelectedClassforView={setISelectedClassforView} />
    </ReactCardFlip>
  );
};
export default ClassesInSchool;
