import { IconButton } from "@mui/material";
import React from "react";
import { useDrag } from "react-dnd";
import { RiCloseFill } from "react-icons/ri";
const getCharDarkColor = (char, opacity = 1) => {
  // Ensure we're working with a single character
  const singleChar = char.toString().slice(-1);

  // Get the character code
  const charCode = singleChar.charCodeAt(0);

  // Use a more complex hashing method to spread out colors
  const hash = charCode * 1597 + 51;

  // Generate a more distributed hue
  const hue = ((hash % 360) + 360) % 360;

  // Generate HSL color with the given opacity (darker color)
  return `hsla(${hue}, 70%, 40%, ${opacity})`; // Lightness set to 40% for a darker color
};
const ElectiveSubjectBlock = ({
  electiveSubject,
  groupId,
  removeElectiveSubjectFromGroup,
  standardName,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ELECTIVE_SUBJECT",
      item: {
        ...electiveSubject,
        groupId,
        elective_subject_id: electiveSubject.elective_subject_id,
        from: "group",
        // Ensure ID is included
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [electiveSubject, groupId]
  );
  const eSColorbg = getCharDarkColor(
    electiveSubject?.classroom_name || "default",
    0.1
  );
  const eSColortext = getCharDarkColor(
    electiveSubject?.classroom_name || "default"
  );

  return (
    <div
      ref={drag}
      className="flex flex-col items-center rounded-xl shadow-sm bg-white bg-opacity-60 p-3 gap-2 relative"
    >
      {/* Remove Icon */}
      <IconButton
        onClick={() =>
          removeElectiveSubjectFromGroup(
            electiveSubject.standard_id,
            standardName,
            groupId,
            electiveSubject?.elective_subject_id
          )
        } // Add the function to handle removal
        sx={{
          position: "absolute",
          top: "-6px", // Position the icon slightly outside the container (above)
          right: "-6px", // Position the icon slightly outside the container (to the right)
          backgroundColor: "white", // Light background for the icon
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Darker background on hover
          },
          padding: "2px", // Smaller padding for the icon
          borderRadius: "50%",
        }}
      >
        <RiCloseFill size={12} className="text-slate-400" />{" "}
        {/* Smaller close icon */}
      </IconButton>

      <div
        style={{ backgroundColor: eSColorbg }}
        className={`rounded-irregular w-fit h-fit p-3 bg-opacity-40`}
      >
        <h3 className={`text-sm font-bold`} style={{ color: eSColortext }}>
          {electiveSubject?.classroom_name}
        </h3>
      </div>

      <h3 className="text-xs font-bold text-slate-700 truncate text-center w-24 mt-2">
        {electiveSubject?.elective_subject_name}
      </h3>

      <div className="flex flex-row gap-1">
        {electiveSubject?.options?.map((sub) => (
          <p className="text-[8px] font-medium border-l pl-1 text-slate-400 first:border-l-0 capitalize">
            {sub}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ElectiveSubjectBlock;
