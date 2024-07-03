import React from 'react';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/system';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
const StatusChip = ({status}) => {

    const MuiChipCustom = styled(Chip)(({ theme, status }) => {
        let backgroundColor;
        
        // Set background color based on status
        switch (status) {
          case 'present':
            backgroundColor = '#90EE90';
            break;
          case 'absent':
            backgroundColor = '#FFB6C1';
            break;
          case 'half leave':
            backgroundColor = 'orange';
            break;
          default:
            backgroundColor = 'grey'; // Default color if status is unknown
        }
      
        return {
          width: 100,
          height: 20,
          backgroundColor: backgroundColor,
          borderRadius:10,
          color: 'white',
          
          
      
          '& .MuiChip-label': {
            color: 'white',
            fontSize: 10,
          },
      
          '& .MuiChip-deleteIcon': {
            color: 'white',
            fontSize: 10,
          },
        };
      });


  return (
    <MuiChipCustom
    label={status}
    onDelete={() => console.log('delete')}
    status={status} // Pass status as prop
    deleteIcon={<FiberManualRecordIcon/>}
  />
  )
}

export default StatusChip
