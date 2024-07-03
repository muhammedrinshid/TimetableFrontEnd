// SearchInput.js
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';


const useStyles = makeStyles({
    input: {
      backgroundColor: 'white',
      border: 'none',
      height:38,

      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          border: 'none',fontSize:"10px"
        },
        '&:hover fieldset': {
          border: 'none',fontSize:"10px"
        },
        '&.Mui-focused fieldset': {
          border: 'none',
          
          
        },
      },
    },
  });
  

const SearchInput = () => {
  const classes = useStyles();

  return (
    <TextField
      variant="outlined"
      placeholder="Search..."
      size='small'
      sx={{
        
        "& fieldset": { border: 'none' },
        fontSize:4
      }}      InputProps={{
        className: classes.input,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
