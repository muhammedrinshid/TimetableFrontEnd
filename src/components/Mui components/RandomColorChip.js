// RandomColorChip.js (Reusable Component)
import { Avatar, Chip } from '@mui/material';
import React from 'react';


function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  function lightenStringToColor(string, ) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Calculate the new color by adding the specified amount
    const lightenedHash = hash + 6;

    // Extract the RGB components
    const r = (lightenedHash >> 16) & 0xff;
    const g = (lightenedHash >> 8) & 0xff;
    const b = lightenedHash & 0xff;

    // Convert to hexadecimal format
    const color = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    return color;
}
const RandomColorChip = ({ subject }) => {

  return (
    <Chip
      size="small"
      avatar={<Avatar style={{ backgroundColor: stringToColor(subject) }} sx={{color:'white'}}>{subject.charAt(0)}</Avatar>}
      label={subject}
      sx={{
        color:"#575555"
        
      }}
    />
  );
};

export default RandomColorChip;
