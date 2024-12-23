import { Opacity } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdEdit, MdLibraryAdd } from "react-icons/md";

import ElectiveSubjectBlock from "./ElectiveSubjectBlock";
import { useDrop } from "react-dnd";
import CompactElectiveGroupErrorDisplay from "./CompactElectiveGroupErrorDisplay";

const ElectiveGroupCard = ({
  groupErrors,
  electiveGroup,
  toggleDrawer,
  standardId,
  standardName,
  moveElectiveSubject,
  handleOpenDelateDialog,
  removeElectiveSubjectFromGroup,
  handleOpenCreateNewDialog,
}) => {
  groupErrors?.length > 0 && console.log(groupErrors);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "ELECTIVE_SUBJECT",
      canDrop: (item) => {
        // Don't allow dropping in same group
        // if (item.groupId === electiveGroup.group_id) {
        //   return false;
        // }
        // Verify standardId matches
        return item.standard_id === standardId;
      },
      drop: (item) => {
        moveElectiveSubject(item, electiveGroup, standardId);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [electiveGroup, standardId]
  );

  // Add dynamic styles for drop target
  const dropStyle = {
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.05)" : "transparent",
    transition: "background-color 0.2s ease",
  };
  return (
    <div
      ref={drop}
      // style={dropStyle}
      className={`flex flex-col h-full shadow-custom-8 rounded-lg p-5 ${
        isOver
          ? "bg-[rgba(0,0,0,0.05)]"
          : "backdrop-filter backdrop-blur-[20%] bg-white bg-opacity-30"
      } transition-all`}
    >
      {/* Header Section */}
      <div className="flex flex-row justify-between p">
        <div className="flex items-center gap-2">
          {/* Conditional Rendering for Editing */}

          <h2 className="text-lg font-semibold text-slate-600">
            {electiveGroup?.group_name}
          </h2>
        </div>
        <p className="text-slate-500">
          {electiveGroup?.elective_subjects?.length}
        </p>
      </div>
      {/* Elective block listing */}
      <div className="grid grid-cols-3 gap-4  p-3">
        {electiveGroup?.elective_subjects.map((electiveSubject) => (
          <ElectiveSubjectBlock
            electiveSubject={electiveSubject}
            groupId={electiveGroup?.group_id}
            removeElectiveSubjectFromGroup={removeElectiveSubjectFromGroup}
            standardName={standardName}
          />
        ))}
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        {/* First div for error message */}
        <div className="flex items-center text-sm text-red-500 gap-2">
          <CompactElectiveGroupErrorDisplay groupErrors={groupErrors} />
        </div>

        {/* Second div for the icons */}
        <div className="flex gap-4">
          {/* First Icon: Tick Icon */}
          {/* Assuming you may want a tick icon here later */}

          {/* Second Icon: Delete Icon */}
          <IconButton
            onClick={() => handleOpenDelateDialog(electiveGroup?.group_id)}
            className="bg-red-100 hover:bg-red-200 text-red-500 p-2 rounded-full transition-all"
          >
            <FaDeleteLeft size={18} />
          </IconButton>

          {/* Third Icon: Add Icon (larger) */}
          <IconButton
            onClick={() => toggleDrawer(standardId, standardName)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-500 p-2 rounded-full transition-all"
          >
            <MdLibraryAdd size={22} />
          </IconButton>

          {/* Fourth Icon: Edit Icon */}
          <IconButton
            onClick={() =>
              handleOpenCreateNewDialog(standardId, electiveGroup, "update")
            }
            className="bg-green-100 hover:bg-green-200 text-green-500 p-2 rounded-full transition-all"
          >
            <MdEdit size={22} />
          </IconButton>
        </div>

        {/* Add the blink animation */}
        <style jsx>{`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ElectiveGroupCard;
