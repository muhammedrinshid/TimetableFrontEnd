import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { PiChalkboardTeacherDuotone, PiStudent } from 'react-icons/pi';

const StyledToggleButton = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  backgroundColor: 'white',
  width: '100%',
  height: '100%', // Match the height of the search input
  borderRadius: '8px', // Rounded corners like the search input
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', // Similar shadow to search input
  overflow: 'hidden', // Ensure the SliderIndicator doesn't overflow
}));

const SliderIndicator = styled(Box)(({ theme, value }) => ({
  position: 'absolute',
  width: '50%',
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  transition: 'transform 0.3s ease',
  transform: value ? 'translateX(0)' : 'translateX(100%)',
}));

const ToggleOption = styled(Button)(({ theme, active }) => ({
  flex: 1,
  zIndex: 1,
  borderRadius: 0,
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  backgroundColor: 'transparent',
  transition: 'color 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:focus': {
    outline: 'none',
  },
}));

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

const ToggleButton = ({ onChange, value }) => {
  const handleViewType = (type) => {
    if (type !== value) {
      onChange(type);
    }
  };

  return (
    <StyledToggleButton>
      <SliderIndicator value={value} />
      <ToggleOption
        active={value}
        onClick={() => handleViewType(true)}
        disableRipple
      >
        <IconWrapper>
          <PiChalkboardTeacherDuotone size={20} />
        </IconWrapper>
        <Typography variant="button" color="inherit" style={{ textTransform: 'capitalize' }}>
          Teacher View
        </Typography>
      </ToggleOption>
      <ToggleOption
        active={!value}
        onClick={() => handleViewType(false)}
        disableRipple
      >
        <IconWrapper>
          <PiStudent size={20} />
        </IconWrapper>
        <Typography variant="button" color="inherit" style={{ textTransform: 'capitalize' }}>
          Class View
        </Typography>
      </ToggleOption>
    </StyledToggleButton>
  );
};

export default ToggleButton;