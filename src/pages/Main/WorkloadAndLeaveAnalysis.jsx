import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import TeacherWorkloadChart from "./WorkloadAndLeaveAnalysis/TeachersActivityStats";
import TeachersActivityStats from "./WorkloadAndLeaveAnalysis/TeachersActivityStats";
import {
  LabelDispalyerWithIcon,
  LabelDisplayer,
  StatsPairDisplayer,
} from "../../components/common";
import { Avatar } from "@mui/material";
import LeavesExtraLoadLineChart from "./WorkloadAndLeaveAnalysis/LeavesExtraLoadLineChart";
import HeatmapCalendar from "./WorkloadAndLeaveAnalysis/HeatmapCalendar";
const WorkloadAndLeaveAnalysis = () => {
  const { apiDomain } = useAuth();

  const [selectedTeacher, setSelectedTeacher] = useState({});
  return (
    <div className="p-4  grid  grid-cols-[6fr_4fr] gap-2 h-full">
      <div className="col-start-1 col-end-2 max-h-full     max-w-full  overflow-y-auto ">
        {/* <TeachersActivityStats setSelectedTeacher={setSelectedTeacher} /> */}
      </div>
      <div className="col-start-2 col-end-3     max-h-full overflow-y-auto ml-6 flex flex-col gap-3">
        <div className="flex flex-row pt-6 pl-1 border-b pb-5 bg-light-background1  rounded-lg shadow-custom-4">
          <div className="basis-1/3 flex flex-col px-3">
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2">
              PROFILE IMAGE
            </p>
            <Avatar
              src={
                selectedTeacher?.teacher?.profile_image
                  ? `${apiDomain}/${ selectedTeacher?.teacher?.profile_image}`
                  : undefined
              }
              sx={{
                width: 160,
                height: 160,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              alt=""
            />
          </div>
          <div className="basis-1/3 px-3">
            <p className="text-[11px] font-medium text-text_2 font-Inter my-2 ">
              CONTACT DETAILS
            </p>
            <LabelDisplayer data={selectedTeacher?.teacher?.full_name} label={"Name"} />

            <LabelDisplayer data={selectedTeacher?.teacher?.teacher_id} label={"Teacher Id"} />

         
     
           
          </div>
          <div className="basis-1/3 px-3 ">
          <p className="text-[11px] font-medium text-text_2 font-Inter my-2 ">
          TUTOR LEAVES</p>
            <LabelDisplayer data={selectedTeacher?.leaves_count} label={"Leaves Count"} />
            <LabelDisplayer data={selectedTeacher?.extra_loads_count} label={"Extra Loads Count"} />
            {/* <LabelDisplayer data={selectedTeacher.surname} label={"Surname"} /> */}
          </div>
        </div>
        {/* <LeavesExtraLoadLineChart /> */}
        <div className="bg-light-background1 w-full h-full shadow-custom-4 rounded-lg">
        {/* <HeatmapCalendar  /> */}

        </div>
      </div>
    </div>
  );
};

export default WorkloadAndLeaveAnalysis;
