import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '100%',
  },
  '& .MuiInputBase-input': {
    padding: '0 14px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

const CustomDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="col-start-2 col-end-3 row-start-1 row-end-2 shadow_box flex flex-row justify-be items-center">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledDatePicker
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              fullWidth
            />
          )}
          format="MM/dd/yyyy"
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;