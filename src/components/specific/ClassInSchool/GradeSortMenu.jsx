import React, { useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';
import GradeIcon from '@mui/icons-material/Grade';
import GroupIcon from '@mui/icons-material/Group';

import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

const GradeSortMenu = ({ setSortType }) => {
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
        <FilterListIcon color='primary' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSort('Grade Name A-Z')}>
          <ListItemIcon>
            <GradeIcon />
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Grade Name A-Z" />
        </MenuItem>
        <MenuItem onClick={() => handleSort('Grade Name Z-A')}>
          <ListItemIcon>
            <GradeIcon />
            <ArrowDownwardIcon />
          </ListItemIcon>
          <ListItemText primary="Grade Name Z-A" />
        </MenuItem>
        <MenuItem onClick={() => handleSort('Divisions High to Low')}>
          <ListItemIcon>
            <GroupIcon />
            <ArrowDownwardIcon />
          </ListItemIcon>
          <ListItemText primary="Divisions High to Low" />
        </MenuItem>
        <MenuItem onClick={() => handleSort('Divisions Low to High')}>
          <ListItemIcon>
            <GroupIcon />
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Divisions Low to High" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default GradeSortMenu;
