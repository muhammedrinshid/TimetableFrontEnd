import React from 'react';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const statusStyles = {
  leave: {
    color: '#808080',
    borderColor: '#808080',
  },
  engaged: {
    color: '#0000FF',
    borderColor: '#0000FF',
  },
  free: {
    color: 'green',
    borderColor: 'green',
  },
};

const CustomChip = styled(Chip)(({ status }) => ({
  color: statusStyles[status].color,
  borderColor: statusStyles[status].borderColor,
  textTransform: 'capitalize',
  fontSize:12,
  width:"90%",
  marginTop:3
}));


export default CustomChip;
