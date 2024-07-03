import { Avatar } from '@mui/material'
import React from 'react'
import { stringAvatar } from '../../Mui components'

const ClassListDashboard = ({ele}) => {
  return (
    <div className='sticky left-0  bg-white  z-10  border border-gray-300 border-opacity-15  bg-opacity-70 backdrop-blur-sm flex justify-center p-2 items-center'>
         <div className="w-full h-full flex flex-col justify-center items-center gap-2 bg-light-secondary bg-opacity-20 rounded-lg p-2 shadow-custom-10 ">
         
         <Avatar       sx={{
                        //   height: "100%",
                          border: "0.1px solid lightgray",
                        }}
                        variant=""
                        {...stringAvatar(ele.standard+" "+ele.standard+"df")}
                      >
                        {ele.standard}{ele.division}
                        
                      </Avatar>
          <p className="text-vs font-bold text-text_2">C00{ele.class_id}</p>
          <div>
            {/* {!fullDayPresent ? (
              <Tooltip title="Mark as present">
                <IconButton
                  size="small"
                //   onClick={() =>
                //    { toggleFullDayLeaveorPresent(ele.teacher_id, "present")
                //     toggleDrawer("noToggle")}
                //   }
                  className="text-sm text-green-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightRed"
                >
                  <CheckIcon fontSize="small" sx={{color:"green"}} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Mark as full day leave">
                <IconButton
                  size="small"
                //   onClick={() =>
                //     toggleFullDayLeaveorPresent(ele.teacher_id, "leave")
                //   }
                  className="text-sm text-red-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightGreen"
                >
                  <DoDisturbAltIcon
                    fontSize="small"
                    sx={{ color: "#FFB6C1" }}
                  />
                </IconButton>
              </Tooltip>
            )} */}
          </div>
       
         </div>
      
    </div>
  )
}

export default ClassListDashboard
