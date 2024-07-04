import React, { useState } from "react";
import { CustomSelect, SearchInput } from "../../components/Mui components";
import { SortMenu } from "../../components/specific/Teachers";
import { schoolData } from "../../assets/datas";

const ClassesInSchool = () => {
  const [classByGrade, setClassByGrade] = useState(schoolData);
  return (
    <div className="pl-6 pr-4 pb-6   grid grid-rows-[1fr_4fr] ">
      {/* header and contorle  section */}
      <div>
        {/* header */}
        <div className=" flex flex-row justify-between items-center mb-4">
          <h2 className="text-3xl font-Inter font-semibold">
            Classes in School{" "}
          </h2>

          <div className="bg-white rounded-3xl p-2 px-4 shadow-custom-8"></div>
        </div>

        {/* controle */}
        <div className="relative flex flex-row justify-between gap-10 ">
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <SearchInput />
          </div>
          <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
            <CustomSelect options={["rinshid", "top", "enter"]} />{" "}
          </div>
          <div className="p-1 bg-white rounded-2xl  shadow-custom-8">
            <SortMenu />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full ">
        {classByGrade.map((grade) => (
          <div className="w-full p-16 bg-slate-200 my-2 flex items-start justify-center">
            <p className="text-sm font-medium text-text_2 font-Inter my-2 ">
              {grade.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesInSchool;
