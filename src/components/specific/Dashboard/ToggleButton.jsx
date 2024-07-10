import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { PiChalkboardTeacherDuotone, PiStudent } from 'react-icons/pi';

const StyledToggleButton = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  backgroundColor: 'transparent',
  width: '100%',
  height: '48px',
  padding: '4px',
}));

const SliderIndicator = styled(Box)(({ theme, value }) => ({
  position: 'absolute',
  width: 'calc(50% - 4px)',
  height: 'calc(100% - 8px)',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '24px',
  transition: 'transform 0.3s cubic-bezier(0.85, 0.05, 0.18, 1.35)',
  transform: value ? 'translateX(4px)' : 'translateX(calc(100% + 4px))',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const ToggleOption = styled(Button)(({ theme, active }) => ({
  flex: 1,
  zIndex: 1,
  borderRadius: '24px',
  color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
  transition: 'color 0.3s',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
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
      console.log(type);
      onChange(type);
    }
  };

  return (
    <StyledToggleButton>
      <SliderIndicator value={value} />
      <ToggleOption
        active={value}
        onClick={() => handleViewType(true)}
      >
        <IconWrapper>
          <PiChalkboardTeacherDuotone size={20} />
        </IconWrapper>
        <Typography variant="button" color="inherit">Teacher View</Typography>
      </ToggleOption>
      <ToggleOption
        active={!value}
        onClick={() => handleViewType(false)}
      >
        <IconWrapper>
          <PiStudent size={20} />
        </IconWrapper>
        <Typography variant="button" color="inherit">Class View</Typography>
      </ToggleOption>
    </StyledToggleButton>
  );
};

export default ToggleButton;