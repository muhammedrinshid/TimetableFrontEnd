import React, { useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import FilterListIcon from "@mui/icons-material/FilterList";

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const TimeTableSortMenu = ({ setSortType }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (value) => {
    setSortType(value);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <FilterListIcon color="primary" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSort("Name A-Z")}>
          <ListItemIcon>
            <PersonIcon />
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Name A-Z" />
        </MenuItem>
        <MenuItem onClick={() => handleSort("Name Z-A")}>
          <ListItemIcon>
            <PersonIcon />
            <ArrowDownwardIcon />
          </ListItemIcon>
          <ListItemText primary="Name Z-A" />
        </MenuItem>
        <MenuItem onClick={() => handleSort("Date Ascending")}>
          <ListItemIcon>
            <EventIcon />
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Date Ascending" />
        </MenuItem>
        <MenuItem onClick={() => handleSort("Date Descending")}>
          <ListItemIcon>
            <EventIcon />
            <ArrowDownwardIcon />
          </ListItemIcon>
          <ListItemText primary="Date Descending" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TimeTableSortMenu;
