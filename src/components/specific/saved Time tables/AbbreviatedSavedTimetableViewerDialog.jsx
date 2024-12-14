import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const AbbreviatedSavedTimetableViewerDialog = ({ open, onClose, children  }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
        },
      }}
    >
      <DialogContent
        style={{
          height: "100%",
          overflow: "auto", // Enables scrolling if content exceeds height
        }}
      >
        {children }{" "}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbbreviatedSavedTimetableViewerDialog;
