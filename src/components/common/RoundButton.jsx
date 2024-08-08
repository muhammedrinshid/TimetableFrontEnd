import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/Authcontext';

const RoundButton = ({ 

}) => {
  const {apiDomain,logoutUser,headers}=useAuth()
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/`,
        { headers }
      );
      console.log(response.data)
      toast.success("Classroom data loaded successfully");
    } catch (err) {
      if (err.response) {
        console.error("Response error:", err.response.status, err.response.data);
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(`Error occurred: ${err.response.data?.message || "Unexpected error"}`);
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("Error occurred: No response from server");
      } else {
        console.error("Error", err.message);
        toast.error(`Error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        borderRadius: '50%',
        minWidth: '56px',
        width: '56px',
        height: '56px',
      }}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <AddIcon sx={{ color: 'white' }} />
      )}
    </Button>
  );
};

export default RoundButton;