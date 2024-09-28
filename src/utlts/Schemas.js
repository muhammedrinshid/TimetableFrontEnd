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
  max_lessons_per_week: yup
    .number()
    .typeError("Maximum Periods must be a number")
    .required("Max Period is required")
    .min(
      yup.ref("min_lessons_per_week"),
      "Max Period must be greater than or equal to Min Periods"
    ),
  min_lessons_per_week: yup
    .number()
    .typeError("Minimum Periods must be a number")
    .required("Minimum Periods per Week is required")
    .positive("Must be a positive number"),
  qualified_subjects: yup
    .array()
    .required("Qualified subjects are required")
    .of(
      yup.object().shape({
        id: yup.string().nullable(), // Allow id to be nullable (null or undefined)
        name: yup.string().required("Subject name is required"),
        // Add more validation rules as needed for other properties
      })
    )
    .min(1, "At least one subject is required"),

  levels: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required("Level ID is required"),
        name: yup.string().required("Level name is required"),
        // Add more validation rules as needed for other properties
      })
    )
    .min(1, "At least one level must be selected")
    .required("Teacher level is a required field"),
});

const AssignSubjectSchema = yup.object().shape({
  selectedSubjects: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Subject name is required"),
        type: yup.string().oneOf(["core", "elective"]).required(),
        lessonsPerWeek: yup
          .number()
          .min(1, "Lessons must be at least 1")
          .required(),
      })
    )
    .min(1, "At least one subject is required"),
});

export { teacherSchema, AssignSubjectSchema };
