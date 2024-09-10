import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const RandomColorChip2 = ({ subject }) => {
  const theme = useTheme();

  // Alternate between primary and secondary colors
  const isEven = subject.length % 2 === 0;
  const baseColor = isEven ? theme.palette.primary.main : theme.palette.secondary.main;
  const textColor = isEven ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText;

  return (
    <Chip
      label={subject}
      size="small"
      sx={{
        bgcolor: alpha(baseColor, 0.1),
        color: baseColor,
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '0 8px',
        height: '24px',
        '&:hover': {
          bgcolor: alpha(baseColor, 0.2),
        },
        '&:active': {
          bgcolor: alpha(baseColor, 0.3),
        },
        transition: 'background-color 0.3s ease',
        '& .MuiChip-label': {
          padding: '0 4px',
        },
      }}
    />
  );
};

export default RandomColorChip2;