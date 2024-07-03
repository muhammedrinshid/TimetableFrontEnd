// FileUpload.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const FileUpload = ({handleImageChange}) => {


  

  return (
    <Box>
      <Typography variant="h6" className='text-center'>Upload Teacher Profile</Typography>
    <div className='flex justify-center items-center'>
    <Button
        variant="contained"
        component="label"
        sx={{ marginTop: 2, marginBottom: 2 }}
        color='background'
        
      >
        Choose File
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </Button>
    </div>
      
    </Box>
  );
};

export default FileUpload;
