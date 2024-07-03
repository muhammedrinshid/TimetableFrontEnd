import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LabelDispalyerWithIcon, LabelDisplayer } from "../../common";
import { Avatar, Button, IconButton } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import { class_data } from "../../../assets/datas";

export const row1 = [
  "Instructor",
  "Session1",
  "Session2",
  "Session3",
  "Session4",
  "Session5",
  "Session6",
  "Session7",
  "Session8",
  "Session9",
  "Session10",
  "Session11",
  "Session12",
];

const getGridClassName = (NumberOfPeriodsInAday) => {
  const gridClasses = {
    1: "grid-cols-[minmax(80px,_1.5fr)_repeat(1,_minmax(70px,_1fr))]",
    2: "grid-cols-[minmax(80px,_1.5fr)_repeat(2,_minmax(70px,_1fr))]",
    3: "grid-cols-[minmax(80px,_1.5fr)_repeat(3,_minmax(70px,_1fr))]",
    4: "grid-cols-[minmax(80px,_1.5fr)_repeat(4,_minmax(70px,_1fr))]",
    5: "grid-cols-[minmax(80px,_1.5fr)_repeat(5,_minmax(70px,_1fr))]",
    6: "grid-cols-[minmax(80px,_1.5fr)_repeat(6,_minmax(70px,_1fr))]",
    7: "grid-cols-[minmax(80px,_1.5fr)_repeat(7,_minmax(70px,_1fr))]",
    8: "grid-cols-[minmax(80px,_1.5fr)_repeat(8,_minmax(70px,_1fr))]",
    9: "grid-cols-[minmax(80px,_1.5fr)_repeat(9,_minmax(70px,_1fr))]",
    10: "grid-cols-[minmax(80px,_1.5fr)_repeat(10,_minmax(70px,_1fr))]",
    11: "grid-cols-[minmax(80px,_1.5fr)_repeat(11,_minmax(70px,_1fr))]",
    12: "grid-cols-[minmax(80px,_1.5fr)_repeat(12,_minmax(70px,_1fr))]",
  };

  return (
    gridClasses[NumberOfPeriodsInAday] ||
    "grid-cols-[minmax(80px,_1.5fr)_repeat(1,_minmax(70px,_1fr))]"
  );
};
const TeacherDetails = ({ setISelectedTeacher, selectedTeacher }) => {
  const [classsRomms, setClassRooms] = useState(class_data);

  const { NumberOfPeriodsInAday } = useAuth();

  const findClassById = (id) => {
    return classsRomms.find((cls) => cls.class_id === id) || null;
  };

  const gridClassName = getGridClassName(NumberOfPeriodsInAday);
  return (
    <div className="w-full h-full   rounded-2xl px-6 py-5">
      <div className="flex flex-row justify-between border-b pb-4">
        <div className="flex flex-row items-center gap-4">
          <IconButton>
            <KeyboardBackspaceIcon
              fontSize="small"
              sx={{
                color: "#818181",
              }}
              onClick={() =>
                setISelectedTeacher((prev) => ({ ...prev, isopen: false }))
              }
            />
          </IconButton>
          <Avatar
            sx={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            }}
            src={selectedTeacher?.image}
          >
            {selectedTeacher?.name}
          </Avatar>
          <h1 className="text-xl font-semibold ">{selectedTeacher?.name}</h1>
        </div>
        <div className=" flex flex-row items-center gap-2">
          <p
            className="text-xs text-text_2  font-light mr-4
            "
          >
            created on 22-06-2026
          </p>
          <Button
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            size="small"
            sx={{
              textTransform: "none",
              border: "none",
              outline: "none",
              borderRadius: 2,
              padding: "10px 14px",
              fontSize: 12,
              backgroundColor: "rgba(255, 182, 193, 0.2)", // light red background
              color: "#d32f2f", // red 700 font color
              "&:hover": {
                backgroundColor: "rgba(255, 182, 193, 0.5)", // slightly darker on hover
                borderColor: "#d32f2f", // red 700 border color
              },
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-row pt-6 pl-1 border-b pb-5">
        <div className="basis-1/3 flex flex-col px-3">
          <p className="text-sm font-medium text-text_2 font-Inter my-2">
            PROFILE IMAGE
          </p>
          <img
            src={selectedTeacher.image}
            className="shadow-custom-2 rounded-lg "
            width={180}
            alt=""
          />
          <p className="text-sm font-medium text-text_2 font-Inter mt-6">
            TUTOR DETAILS
          </p>
          <LabelDisplayer data={selectedTeacher.name} label={"Name"} />
          <LabelDisplayer data={selectedTeacher.surname} label={"Surname"} />
        </div>
        <div className="basis-1/3 px-3">
          <p className="text-sm font-medium text-text_2 font-Inter my-2 ">
            CONTACT DETAILS
          </p>
          <LabelDispalyerWithIcon
            data={selectedTeacher.email}
            label={"Mail id"}
          />
          <LabelDispalyerWithIcon
            data={selectedTeacher.phone}
            label={"Phone"}
          />
          <p className="text-sm font-medium text-text_2 font-Inter my-2 mt-8">
            QUALIFIED SUBJECTS
          </p>
          <div className="flex gap-2 flex-wrap">
            {selectedTeacher?.qualified_subjects?.map((subject) => (
              <p className="text-sm p-[2px] w-fit px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
                {subject}
              </p>
            ))}
          </div>
          <LabelDisplayer
            data={selectedTeacher.teacher_id}
            label={"Teacher Id"}
          />
        </div>
        <div className="basis-1/3 px-3 ">
          <p className="text-sm font-medium text-text_2 font-Inter my-2 ">
            ACADEMIC DETAILS
          </p>
          <LabelDisplayer
            data={selectedTeacher?.grade ? selectedTeacher.grade : "no greade"}
            label={"Grade"}
          />
          <LabelDisplayer
            data={selectedTeacher?.minimum_number_periods_per_week}
            label={"Min number of period"}
          />
          <LabelDisplayer
            data={selectedTeacher?.maximum_number_periods_per_week}
            label={"Max number of period"}
          />
        </div>
      </div>
      <div className=" overflow-auto py-6">
        <p className="text-sm font-medium text-text_2 font-Inter my-2 ">
          TIME TABLE FOR A WEEK
        </p>
        <div className={`grid ${gridClassName} `}>
          {row1?.slice(0, NumberOfPeriodsInAday + 1).map((ele, indx) => (
            <div className=" bg-white cursor-pointer  bg-opacity-70 backdrop-blur-sm shadow-bottom1  flex justify-center py-1 max-h-12 first:rounded-tl-lg last:rounded-tr-lg border border-opacity-10 border-gray-300">
              <p className="text-xs font-medium text-text_2 m-2">{ele}</p>
            </div>
          ))}

          {selectedTeacher?.time_table?.map((obj) => (
            <React.Fragment>
              <div className="sticky left-0  bg-white  z-10  border border-gray-300 border-opacity-15  bg-opacity-70 backdrop-blur-sm flex justify-center p-2 items-center">
                <div className="w-full h-full flex flex-col justify-center items-center gap-2 bg-light-secondary bg-opacity-20 rounded-lg p-2 shadow-custom-10 ">
                  {" "}
                  <p className="capitalize font-semibold text-slate-600 text-sm">
                    {obj.day}
                  </p>
                </div>
              </div>
              {obj.class_slots
                ?.slice(0, NumberOfPeriodsInAday)
                .map((class_slot, ind) => {
                  const classRoom = findClassById(class_slot?.class);

                  return (
                    <div
                      className={`border border-gray-300 border-opacity-15  p-2 bg-white  `}
                    >
                      <div
                        className={`bg-white rounded-md pt-1  h-full flex flex-col justify-between overflow-hidden  items-center ${
                          class_slot == null
                            ? "gradient_3"
                            : class_slot?.sub == 0
                            ? "gradient_1"
                            : class_slot?.sub == 1
                            ? "gradient_2"
                            : "gradient_4"
                        } `}
                      >
                        <h1
                          className={` text-nowrap text-center justify-center inline my-1 text-base font-semibold  text-opacity-80
                        
                          
                          `}
                        >
                          {/* <SiGoogleclassroom className="inline" />{" "} */}
                          {classRoom?.standard}
                          {classRoom?.standard && "-"}
                          {classRoom?.division || "Free"}
                        </h1>
                        <h2 className="text-xs font-semibold text-dark-accent text-opacity-90 font-Roboto text-center mb-4">
                          {selectedTeacher.qualified_subjects[
                            class_slot?.sub
                          ] || "Focus Time"}
                        </h2>
                      </div>
                    </div>
                  );
                })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
