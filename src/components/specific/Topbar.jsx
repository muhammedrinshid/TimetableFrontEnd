import React from 'react'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { topMenu } from '../../assets/datas'

const Topbar = () => {
  return (
    <div class=" flex flex-row justify-between p-4 ">
    <h2 className="text-base font-semibold">
      Pricing List <FaLongArrowAltRight className="inline font-thin text-base" />{" "} Teacher
    </h2>
    <div className="flex flex-row justify-center gap-2  border-t border-white border-opacity-70 bgre">
    {topMenu.map((ele) => (
      <div
        className="flex  items-center rounded-full   text-dark-primary text-opacity-80 hover:text-white hover:bg-light-primary duration-300 hover:opacity-50">
      
        <span className=" text-xl p-3 text-center    cursor-pointer">
          {ele.icon}
        </span>
        
      </div>))}
  </div>

    {/* top bar menus */}
  </div>
  )
}

export default Topbar
