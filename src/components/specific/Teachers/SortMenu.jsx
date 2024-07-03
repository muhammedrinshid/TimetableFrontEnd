import React, { useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import FilterListIcon from '@mui/icons-material/FilterList';

import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

const SortMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (sortType) => {
    console.log(`Sorting by ${sortType}`);
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
        <MenuItem onClick={() => handleSort('Name A-Z')}>
          <ListItemIcon>
            <PersonIcon />
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Name A-Z" />
        </MenuItem>
        <MenuItem onClick={() => handleSort('Name Z-A')}>
          <ListItemIcon>
            <PersonIcon />
            <ArrowDownwardIcon />
          </ListItemIcon>
          <ListItemText primary="Name Z-A" />
        </MenuItem>
        <MenuItem onClick={() => handleSort('Teacher ID A-Z')}>
          <ListItemIcon>
            <BadgeIcon />
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Teacher ID A-Z" />
        </MenuItem>
        <MenuItem onClick={() => handleSort('Teacher ID Z-A')}>
          <ListItemIcon>
            <BadgeIcon />
            <ArrowDownwardIcon />
          </ListItemIcon>
          <ListItemText primary="Teacher ID Z-A" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SortMenu;
