import React from "react";
import { IoTimeOutline } from "../../../assets/icons";
import { formatDuration } from "../../../assets/converts";
import Tooltip from "@mui/material/Tooltip";
import { Avatar, IconButton } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { StyledBadge } from "../../Mui components";

import { grey } from "@mui/material/colors";
const StudentrViewClassroomCard = ({
  teacher,
  ind,
  whoWantSwap,
  periodDetails,
  subject,
  status,
  changeTecherStatus,
  toggleDrawer,
  slot,
}) => {
  return (
    <div className={`border border-gray-300 border-opacity-15  p-2  `}>
      <div
        className={`bg-white rounded-md pt-1  h-full flex flex-col justify-between overflow-hidden  items-center ${
          teacher?.present[ind] == false
            ? "gradient_6"
            : teacher?.class_subject[ind] == 0
            ? "gradient_1"
            : teacher?.class_subject[ind] == 1
            ? "gradient_2"
            : teacher?.class_subject[ind] == null
            ? "gradient_3"
            : teacher?.class_subject[ind] == 2
            ? "gradient_5"
            : "gradient_4"
        } 
       ${
         teacher?.present[ind] == false &&
         teacher?.class_slot[ind] !== null &&
         "blinking-top-border "
       } 
      ${
        teacher?.present[ind] == false &&
        teacher?.class_slot[ind] === null &&
        "leave__card"
      } 
      ${
        ind === whoWantSwap.session &&
        teacher?.teacher_id == whoWantSwap.teacher_id &&
        " selector "
      }


                        `}
      >
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
          status={status}
        >
          <Avatar
            sx={{
              border: "0.1px solid lightgray",
            }}
            src={teacher?.image}
            variant=""
            sizes="small"
          >
            {teacher?.name.charAt(0)}
          </Avatar>
        </StyledBadge>
        <h1
          className={` text-nowrap text-center justify-center inline my-1 text-base font-semibold  text-opacity-80
                        
                          
                          `}
        >
          {/* <SiGoogleclassroom className="inline" />{" "} */}
          {teacher?.name}
        </h1>
        <h6 className="text-vs font-light text-text_1 flex justify-center items-center gap-1 text-center">
          <IoTimeOutline className="inline" />{" "}
          {formatDuration(periodDetails.durationMinutes)}
        </h6>
        <h2 className="text-xs font-bold text-dark-secondary text-opacity-90 font-Roboto text-center">
          {subject}
        </h2>
        <p className="text-xs mt-1 font-light text-dark-primary text-opacity-80">
          {periodDetails.startTime.toString()} to {periodDetails.endTime}
        </p>
        <div className=" w-full flex flex-row justify-around  self-end mt-2">
          {/* <FaUserSlash />
                        <FiUserCheck /> */}
          <div className="basis-1/3 flex justify-center items-center p-1 border-t border-r border-black border-opacity-10 text-opacity-40 text-black cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary">
            {teacher.present[ind] === false ? (
              <Tooltip title=" present  this period">
                <IconButton
                  size="small"
                  onClick={() => {
                    toggleDrawer("noToggle");
                    changeTecherStatus(teacher.teacher_id, ind);
                  }}
                >
                  <CheckIcon fontSize="small" sx={{ color: "#90EE90" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Absent this period">
                <IconButton
                  size="small"
                  onClick={() => changeTecherStatus(teacher.teacher_id, ind)}
                >
                  <CancelPresentationIcon
                    fontSize="small"
                    sx={{ color: "#FFB6C1" }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div
            className={`basis-1/3 flex justify-center items-center border-t border-black border-opacity-10 text-opacity-40 text-black cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary ${
              teacher.present[ind] == true && "cursor-not-allowed "
            }`}
          >
            <Tooltip title="Assign a free teacher">
              <IconButton
                size="small"
                onClick={() =>
                  toggleDrawer(
                    "toggle",
                    ind,
                    teacher.qualified_subjects[teacher.class_subject[ind]],
                    teacher.teacher_id,
                    teacher.class_slot[ind]
                  )
                }
                disabled={teacher.present[ind]}
                sx={{
                  "& svg": {
                    color: !teacher.present[ind] ? "#009ee3" : grey[500], // Change color of the icon based on disabled state
                  },
                }}
              >
                <ChangeCircleIcon fontSize="small" sx={{ color: "#009ee3" }} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="basis-1/3 flex justify-center items-center border-t border-l text-opacity-40 text-black border-black border-opacity-10  cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary">
            <Tooltip title="copy data">
              <IconButton size="small">
                <CopyAllIcon fontSize="small" color="inherit" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentrViewClassroomCard;
