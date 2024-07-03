import React from "react";

import { useForm, Controller } from "react-hook-form";
import {
  Avatar,
  Button,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import MultiSelectCreatable from "../Mui components/MultiSelectCreatable";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { teacherSchema } from "../../utlts/Schemas";

function TeacherUpdateForm({
  subjects,
  handleUpdateTeacherClose,
  tempUpdateTeacher,
  teacherData,
}) {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(teacherSchema),
  });
  const [image, setImage] = useState(teacherData.image || null);
  const [preview, setPreview] = useState(teacherData.image || null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    setPreview(URL.createObjectURL(image));
  };


  const onSubmit = async (data) => {
    console.log("jlfjl")

    data.image = image;
    tempUpdateTeacher(data,teacherData.teacher_id); 
    handleUpdateTeacherClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center">
        <Avatar
          sx={{
            width: 65,
            height: 65,
            border: "0.9px solid lightgray",
          }}
          src={preview}
        ></Avatar>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          <Controller
            name="name"
            control={control}
            defaultValue={teacherData.name || ""}
            render={({ field }) => (
              <TextField
                {...field}
                label="Teacher Name"
                fullWidth
                size="small"
                variant="outlined"
                error={!!errors?.name}
                helperText={errors?.name ? errors?.name.message : ""}
              />
            )}
          />
        </div>
        <div className="basis-1/2">
          <Controller
            name="surname"
            control={control}
            defaultValue={teacherData.surname || ""}
            render={({ field }) => (
              <TextField
                fullWidth
                size="small"
                {...field}
                label="Teacher Surname"
                variant="outlined"
                error={!!errors?.surname}
                helperText={errors?.surname ? errors?.surname.message : ""}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          <Controller
            name="email"
            control={control}
            defaultValue={teacherData.email || ""}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                size="small"
                error={!!errors?.email}
                helperText={errors?.email ? errors?.email.message : ""}
              />
            )}
          />
          <p className="error">{errors?.email?.message}</p>
        </div>
        <div className="basis-1/2">
          {" "}
          <Controller
            name="phone"
            control={control}
            defaultValue={teacherData.phone || ""}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label="Phone"
                variant="outlined"
                type="tel"
                error={!!errors?.phone}
                helperText={errors?.phone ? errors?.phone.message : ""}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          <MultiSelectCreatable
            data={subjects}
            name={"qualified_subjects"}
            control={control}
            errors={errors}
            defaultValue={teacherData.qualified_subjects}
          />
          <p className="error">{errors.qualified_subjects?.message}</p>
        </div>
        <div className="basis-1/2">
          <Controller
            name="grade"
            control={control}
            defaultValue={teacherData.grade || ""}
            render={({ field }) => (
              <Select
                {...field}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={(event) => field.onChange(event.target.value)}
                fullWidth
                size="small"
                error={!!errors?.grade}
              >
                <MenuItem value={""}>Grade</MenuItem>
                <MenuItem value={"hss"}>HigerSecondary</MenuItem>
                <MenuItem value={"higschool"}>Hs</MenuItem>
              </Select>
            )}
          />
          {errors?.grade && (
            <FormHelperText error>{errors?.grade?.message}</FormHelperText>
          )}
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          {" "}
          <Controller
            name="minimum_number_periods_per_week"
            control={control}
            defaultValue={teacherData.minimum_number_periods_per_week || ""}
            render={({ field }) => (
              <>
                <OutlinedInput
                  {...field}
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors?.minimum_number_periods_per_week}
                  placeholder="Max periods per week"
                />
                {errors?.minimum_number_periods_per_week && (
                  <FormHelperText error>
                    {errors.minimum_number_periods_per_week.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
          
        </div>
        <div className="basis-1/2">
          {" "}
          <Controller
            name="maximum_number_periods_per_week"
            control={control}
            defaultValue={teacherData.maximum_number_periods_per_week || ""}
            render={({ field }) => (
              <>
                <OutlinedInput
                  {...field}
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors?.maximum_number_periods_per_week}
                  placeholder="Max periods per week"
                />
                {errors?.maximum_number_periods_per_week && (
                  <FormHelperText error>
                    {errors.maximum_number_periods_per_week.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="flex flex-row py-4 gap-2 justify-center items-center">
        <Controller
          name="image"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Button variant="outlined" component="label">
              Upload Image
              <input
                hidden
                accept="image/*"
                {...field}
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          )}
        />
      </div>
      <div className="flex flex-row gap-3 w-full justify-end mt-8">
        <Button variant="outlined" onClick={handleUpdateTeacherClose}>
          Cancel
        </Button>

        <Button   onClick={() => console.log(errors)} variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default TeacherUpdateForm;
