<Autocomplete
multiple
clearOnBlur
selectOnFocus={true}
onChange={(event, newValue) => CreateNewOption (event, newValue))
filterOptions={(options, params) => {
}}
id="tags-outlined"
options={optionList}
filterSelectedOptions
getOptionLabel={(option) => {
// Value selected with enter, right from the input
if (typeof option === "string") {
return option;
}
// Add "xxx" option created dynamically
if (option.inputValue) {
return option.inputValue;
}
// Regular option
return option.label;
}}
freeSolo
renderoption= {(props, option) => <li {...props}>{option.label}</li>}
renderInput={(params) =>
<TextField (...params) label="Add new option" placeholder="Add New Option"









  import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MultiSelectCreatable from "./MultiSelectCreatable";
import NumberInputBasic from "./NumberInput";
import { makeStyles } from "@mui/styles";
import FileUpload from "./Fileupload";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { teacherSchema } from "../../utlts/Schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { Title } from "@mui/icons-material";

const subjectOptions = [
  { value: "math", label: "Math" },
  { value: "english", label: "English" },
  // Add more options as needed
];
// Add more predefined subjects here
const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "600px",
    margin: "auto",
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
  },
}));
const FormComponent = ({
  handleCreateTeacherClose,
  tempCreateNewTeacher,
  subjects,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [minimumNumberofPeriodPerWeek, setMinimumNumberofPeriodPerWeek] =
    useState(0);
  const [maximumNumberofPeriodPerWeek, setMaximumrofPeriodPerWeek] =
    useState(0);

  const [formValues, setFormValues] = useState({
    teacherName: "",
    teacherSurName: "",
    email: "",
    phone: "",
    notes: "",
    maxPeriods: "",
    minPeriods: "",
    subjects: [],
    level: "",
    image: null,
  });
  const handleSelectChange = (newValue) => {
    setFormValues({
      ...formValues,
      subjects: newValue || [],
    });
  };
  const [imagePreview, setImagePreview] = useState(null);


  const handleSubjectsChange = (newValu) => {
    setFormValues((prev) => ({ ...prev, subjects: newValu }));
    console.log(newValu);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({
        ...formValues,
        image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    console.log( data);

    tempCreateNewTeacher(formValues);
    handleCreateTeacherClose();
  };
  const { register,errors, handleSubmit } = useForm({

    resolver:yupResolver(teacherSchema)
  });
  const levelsOptions = ["HSS", "HS", "UP"];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center">
        <Avatar
          sx={{
            width: 65,
            height: 65,
            border: "0.9px solid lightgray",
          }}
          src={imagePreview}
        ></Avatar>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          {" "}
          <Controller
        name="teacherName"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField {...field} label="Teacher Name" variant="outlined" />
        )}
      />
        </div>
        <div className="basis-1/2">
        <Controller
        name="teacherSurName"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField {...field} label="Teacher Surname" variant="outlined" />
        )}
      />
          {/* {/* <p className="error">{errors.teacherSurName?.message}</p> */}
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          {" "}
          <TextField
        label="Email"
        name="email"
        type="email"
        inputRef={register}
        fullWidth
      />
          {/* <p className="error">{errors.email?.message}</p> */}
        </div>
        <div className="basis-1/2">
        <TextField
        label="Phone"
        name="phone"
        inputRef={register}
        fullWidth
      />
        </div>
      </div>

      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          {" "}
          <TextField
        label="Max Periods"
        name="maxPeriods"
        type="number"
        inputRef={register}
        fullWidth
      />
          {/* <p className="error">{errors.maxPeriods?.message}</p> */}
        </div>
        <div className="basis-1/2">
        <TextField
        label="Min Periods"
        name="minPeriods"
        type="number"
        inputRef={register}
        fullWidth
      />
          {/* <p className="error">{errors.minPeriods?.message}</p> */}
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          {" "}
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              label="Level"
              size="small"
              value={formValues.level}
              onChange={handleInputChange}
              error={errors.}
              inputProps={{
                name: "level",
              }}
            >
              {levelsOptions.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="basis-1/2">
          <MultiSelectCreatable
            data={subjects}
            value={formValues.subjects}
            onChange={handleSubjectsChange}
            errors={errors}
          />
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2 justify-center items-center">
        <FileUpload handleImageChange={handleImageChange} />
      </div>

      {/* Other form fields (Image Upload, Notes, Weekly Periods, Subjects, Level, Image Preview) */}

      <div className="flex flex-row gap-3 w-full justify-end mt-8">
        <Button variant="outlined" onClick={handleCreateTeacherClose}>
          Cancel
        </Button>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default FormComponent;
