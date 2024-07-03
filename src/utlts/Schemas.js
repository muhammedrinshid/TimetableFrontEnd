import * as yup from "yup";

const teacherSchema = yup.object().shape({
  name: yup
    .string()
    .required("Teacher Name is required")
    .max(50, "Teacher Name must be less than 50 characters"),
  surname: yup
    .string()
    .max(50, "Teacher Surname must be less than 50 characters"),
  email: yup.string().email("Invalid email format"),
  phone: yup
    .string()
    .nullable() // Allow null values
    .matches(/^\+?[0-9]{8,}$/i, "Invalid phone number")
    .notRequired(), // Ensure the field is not required,
  maximum_number_periods_per_week: yup
    .number()
    .typeError("Maximum Periods must be a number")
    .required("Max Period is required")
    .min(
      yup.ref("minimum_number_periods_per_week"),
      "Max Period must be greater than or equal to Min Periods"
    ),
  minimum_number_periods_per_week: yup
    .number()
    .typeError("Minimum Periods must be a number")
    .required("Minimum Periods per Week is required")
    .positive("Must be a positive number"),
  qualified_subjects: yup
    .array()
    .required()
    .of(yup.string().required("Subject is required"))
    .min(1, "At least one subject is required"),
  grade: yup.string().required("teacher grade is required field"),
});

export { teacherSchema };
