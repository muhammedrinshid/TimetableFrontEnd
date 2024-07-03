import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { makeStyles } from '@mui/styles';
import { Padding } from '@mui/icons-material';

const useStyles = makeStyles({
  select: {

    height:24,
    width:"100%",
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },'&.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':{
      Padding:0
    }
    ,'&.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper ':{
      borderRadius:12,
    
    }
  },
});

const CustomSelect = ({ value, onChange, options }) => {
  const classes = useStyles();

  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        className={classes.select}
        size='small'
        fullWidth={true}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
