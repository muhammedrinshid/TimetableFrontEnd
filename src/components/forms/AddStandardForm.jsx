import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddStandardForm = ({ open, onClose, onSubmit }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      standardName: '',
      shortName: '',
      numberOfDivisions: '',
    }
  });

  const onSubmitForm = (data) => {
    onSubmit({
      ...data,
      numberOfDivisions: parseInt(data.numberOfDivisions)
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Standard</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Controller
            name="standardName"
            control={control}
            rules={{ required: 'Standard name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Standard Name"
                type="text"
                fullWidth
                error={!!errors.standardName}
                helperText={errors.standardName?.message}
              />
            )}
          />
          <Controller
            name="shortName"
            control={control}
            rules={{ required: 'Short name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Short Name"
                type="text"
                fullWidth
                error={!!errors.shortName}
                helperText={errors.shortName?.message}
              />
            )}
          />
          <Controller
            name="numberOfDivisions"
            control={control}
            rules={{ 
              required: 'Number of divisions is required',
              min: { value: 1, message: 'Number of divisions must be greater than 0' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Number of Divisions"
                type="number"
                fullWidth
                error={!!errors.numberOfDivisions}
                helperText={errors.numberOfDivisions?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddStandardForm;