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
import { toast } from "react-toastify";
import { useAuth } from "../../context/Authcontext";
import axios from "axios";

function TeacherForm({
  subjects,
  handleCreateTeacherClose,
  tempCreateNewTeacher,
  grades,
  setRefetch,
}) {
  const { apiDomain, headers, logoutUser } = useAuth();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(teacherSchema),
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   setImage(file);
  //   setPreview(URL.createObjectURL(file));
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (formData) => {
    try {
      const form = new FormData();

      // Append basic fields
      form.append("name", formData.name);
      form.append("surname", formData.surname);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append(
        "min_lessons_per_week",
        formData.min_lessons_per_week
      );
      form.append(
        "max_lessons_per_week",
        formData.max_lessons_per_week
      );

      // Handle qualified subjects as a list of names only
      formData.qualified_subjects.forEach((subject, index) => {
        form.append(`qualified_subjects[${index}]`, subject.name);
      });

      // Handle grades as a list of grade IDs
      formData.grades.forEach((grade, index) => {
        form.append(`grades[${index}]`, grade.id);
      });

      // Handle image
      if (image instanceof File) {
        form.append("profile_image", image);
      }

      const response = await axios.post(
        `${apiDomain}/api/teacher/teacher/`,
        form,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      toast.success("Teacher created/updated successfully");
      setRefetch((prev) => !prev);
      handleCreateTeacherClose();
      console.log("Teacher created/updated successfully:", response.data);

      // Error handling...
    } catch (error) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        }
        toast.error(
          error.response.data.message ||
            "An error occurred while submitting the form"
        );
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response received from the server");
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
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
          src={preview}
        ></Avatar>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          <Controller
            name="name"
            control={control}
            defaultValue=""
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
            defaultValue=""
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
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                size="small"
                error={!!errors?.email}
                helperText={errors?.email ? errors?.email?.message : ""}
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
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label="Phone"
                variant="outlined"
                type="tel"
                error={!!errors?.phone}
                helperText={errors?.phone ? errors?.phone?.message : ""}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          <Controller
            name="grades"
            control={control}
            defaultValue={[]}
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
        </div>
        <div className="basis-1/2">
          <MultiSelectCreatable
            data={subjects}
            name="qualified_subjects"
            control={control}
            defaultValue={[]}
          />
          <p className="error">{errors?.qualified_subjects?.message}</p>
        </div>
      </div>
      <div className="flex flex-row py-4 gap-2">
        <div className="basis-1/2">
          {" "}
          <Controller
            name="min_lessons_per_week"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <OutlinedInput
                fullWidth
                error={!!errors?.minPeriods}
                helperText={
                  errors?.minPeriods ? errors?.minPeriods?.message : ""
                }
                placeholder="max period per week"
                size="small"
                {...field}
                type="number"
              />
            )}
          />
          <FormHelperText error>{errors?.minPeriods?.message}</FormHelperText>
        </div>
        <div className="basis-1/2">
          {" "}
          <Controller
            name="max_lessons_per_week"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <OutlinedInput
                {...field}
                fullWidth
                size="small"
                type="number"
                error={!!errors?.maxPeriods}
                placeholder="max period per week"
                helperText={
                  errors?.maxPeriods ? errors?.maxPeriods?.message : ""
                }
              />
            )}
          />
          <FormHelperText error>{errors?.maxPeriods?.message}</FormHelperText>
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
        <Button variant="outlined" onClick={handleCreateTeacherClose}>
          Cancel
        </Button>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default TeacherForm;
