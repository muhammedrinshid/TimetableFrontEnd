import React from "react";

import { useForm, Controller } from "react-hook-form";
import {
  Autocomplete,
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
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";

function TeacherUpdateForm({
  subjects,
  handleUpdateTeacherClose,
  teacherData,
  grades,
  setRefetch,
}) {

  const {apiDomain,logoutUser,headers}=useAuth()
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
  const onSubmit = async (formData) => {

    try {
      const form = new FormData();
      let hasChanges = false;
  
      // Helper function to check and append changes
      const appendIfChanged = (key, newValue, oldValue) => {
        if (newValue !== oldValue) {
          form.append(key, newValue);
          hasChanges = true;
        }
      };
  
      // Check and append basic fields
      appendIfChanged("name", formData.name, teacherData.name);
      appendIfChanged("surname", formData.surname, teacherData.surname);
      appendIfChanged("email", formData.email, teacherData.email);
      appendIfChanged("phone", formData.phone, teacherData.phone);
      appendIfChanged("min_lessons_per_week", formData.min_lessons_per_week, teacherData.min_lessons_per_week);
      appendIfChanged("max_lessons_per_week", formData.max_lessons_per_week, teacherData.max_lessons_per_week);
      hasChanges&&console.log("change in fgx")

      // Handle qualified subjects
      const oldSubjects = new Set(teacherData.qualified_subjects_display.map(s => s.name));
      const newSubjects = new Set(formData.qualified_subjects.map(s => s.name));
      console.log(oldSubjects,newSubjects)
      if (JSON.stringify([...oldSubjects]) !== JSON.stringify([...newSubjects])) {
        formData.qualified_subjects.forEach((subject, index) => {
          form.append(`qualified_subjects[${index}]`, subject.name);
        });
        hasChanges = true;
        hasChanges&&console.log("change in sub")

      }
  
      // Handle grades
      const oldGrades = new Set(teacherData.grades_display.map(g => g.id));
      const newGrades = new Set(formData.grades.map(g => g.id));
      if (JSON.stringify([...oldGrades]) !== JSON.stringify([...newGrades])) {
        formData.grades.forEach((grade, index) => {
          form.append(`grades[${index}]`, grade.id);
        });
        hasChanges = true;

      }
  
      // Handle image
      if (image instanceof File && image !== teacherData.profile_image) {
        form.append("profile_image", image);
        hasChanges = true;
      }
    

      // Only send request if there are changes
      if (!hasChanges) {
        toast.info("No changes detected");
        return;
      }
  
      const response = await axios.put(
        `${apiDomain}/api/teacher/teacher/${teacherData.id}/`,
        form,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Handle success
      toast.success("Teacher updated successfully");
      setRefetch((prev) => !prev);
      handleUpdateTeacherClose();
      console.log("Teacher updated successfully:", response.data);
  
    } catch (error) {
      // Error handling (same as before)
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        }
        toast.error(
          error.response.data.message ||
            "An error occurred while updating the teacher"
        );
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        toast.error("No response received from the server");
        console.error("Error request:", error.request);
      } else {
        toast.error("An error occurred while setting up the request");
        console.error("Error message:", error.message);
      }
    }
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
          src={preview||`${apiDomain}${teacherData.profile_image}`}
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
            name="qualified_subjects"
            control={control}
            defaultValue={teacherData.qualified_subjects_display}
            errors={errors}
          />
          <p className="error">{errors.qualified_subjects?.message}</p>
        </div>
        <div className="basis-1/2">
          <Controller
            name="grades"
            control={control}
            defaultValue={teacherData?.grades_display}
            render={({ field: { onChange, value, ...rest } }) => (
              <Autocomplete
                {...rest}
                size="small"
                multiple
                id="grades-autocomplete"
                options={grades}
                value={value}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Grades"
                    placeholder="Select Grades"
                    error={!!errors?.grades}
                    helperText={errors?.grades ? errors?.grades.message : ""}
                  />
                )}
              />
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
            name="min_lessons_per_week"
            control={control}
            defaultValue={teacherData.min_lessons_per_week || ""}
            render={({ field }) => (
              <>
                <OutlinedInput
                  {...field}
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors?.min_lessons_per_week}
                  placeholder="Max periods per week"
                />
                {errors?.min_lessons_per_week && (
                  <FormHelperText error>
                    {errors.min_lessons_per_week.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </div>
        <div className="basis-1/2">
          {" "}
          <Controller
            name="max_lessons_per_week"
            control={control}
            defaultValue={teacherData.max_lessons_per_week || ""}
            render={({ field }) => (
              <>
                <OutlinedInput
                  {...field}
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors?.max_lessons_per_week}
                  placeholder="Max periods per week"
                />
                {errors?.max_lessons_per_week && (
                  <FormHelperText error>
                    {errors.max_lessons_per_week.message}
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

        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default TeacherUpdateForm;
