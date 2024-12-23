import React from "react";
import { useDrag } from "react-dnd";
const getCharDarkColor = (char, opacity = 1) => {
  const singleChar = char.toString().slice(-1);
  const charCode = singleChar.charCodeAt(0);
  const hash = charCode * 1597 + 51;
  const hue = ((hash % 360) + 360) % 360;
  return `hsla(${hue}, 70%, 40%, ${opacity})`;
};
const DrawerElectiveSubjectBlock = ({ electiveSubject, standardId }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ELECTIVE_SUBJECT",
      item: {
        ...electiveSubject,
        standardId:electiveSubject.standard_id,
        groupId: null,
        elective_subject_id: electiveSubject.elective_subject_id,
        from:"drawer" // Ensure ID is included
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [electiveSubject, standardId]
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
      className="w-fit bg-light-background1 flex flex-col items-center rounded-xl shadow-sm  bg-opacity-60 p-3 gap-2 relative"
    >
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

export default DrawerElectiveSubjectBlock;
