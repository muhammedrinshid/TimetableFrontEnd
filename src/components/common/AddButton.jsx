import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ label, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onClick}
      style={{
        margin: '20px 0',
        padding: '10px 20px',
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {label}
    </Button>
  );
};
export default AddButton