// src/services/toastService.js

import { toast } from 'react-toastify';

export const loginToast = () => {
  const toastId = toast.loading("Logging in...");

  return {
    success: () => {
      toast.update(toastId, {
        render: "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    error: (message = "Login failed. Please check your credentials.") => {
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  };
};  


