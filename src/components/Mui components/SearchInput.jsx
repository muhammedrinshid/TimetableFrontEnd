import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles({
  input: {
    border: "none",
    height: 38,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        fontSize: "10px",
      },
      "&:hover fieldset": {
        border: "none",
        fontSize: "10px",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
  },
});

const SearchInput = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <div className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg">
      <TextField
        variant="outlined"
        placeholder="Search..."
        size="small"
        fullWidth
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem", // Adjusts the border-radius
          },
          "& fieldset": { border: "none" }, // Removes the border
          fontSize: "12px", // Font size for the input text
        }}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchInput;
