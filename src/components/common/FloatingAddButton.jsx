import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FloatingAddButton = () => {
  return (
    <Fab 
      color="primary" 
      aria-label="add" 
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
      }}
    >
      <AddIcon />
    </Fab>
  );
};

export default FloatingAddButton;