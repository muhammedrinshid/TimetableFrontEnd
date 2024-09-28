
import { teacher01, teacher02, teacher03, teacher04, teacher05, teacher06, teacher07, teacher08, teacher09, teacher010 } from "../images";

export const weeklyTimetableTeacher  = {
    Monday: [
      {
        instructor: {
          name: "Dr. Emily Johnson",
          image: "teacher01.jpg",
          surname: "Johnson",
          teacher_id: "TID001",
        },
        sessions: [
          {
            subject: "Mathematics",
            type: "Core",
            elective_subject_name: null,
            room: "101",
            class_details: [
              {
                grade: "10th",
                division: "A",
                number_of_students: 30,
              },
            ],
          },
          {
            subject: "Physics",
            type: "Core",
            elective_subject_name: null,
            room: "Lab 1",
            class_details: [
              {
                grade: "11th",
                division: "B",
                number_of_students: 28,
              },
            ],
          },
          {
            subject: "Advanced Calculus",
            type: "Elective",
            elective_subject_name: "Advanced Calculus",
            room: "201",
            class_details: [
              {
                grade: "12th",
                division: "A",
                number_of_students: 25,
              },
              {
                grade: "12th",
                division: "B",
                number_of_students: 20,
              },
            ],
          },
          {
            subject: "Physics Lab",
            type: "Core",
            elective_subject_name: null,
            room: "Lab 2",
            class_details: [
              {
                grade: "11th",
                division: "A",
                number_of_students: 30,
              },
            ],
          },
        ],
      },
      {
        instructor: {
          name: "Mr. James Smith",
          image: "teacher02.jpg",
          surname: "Smith",
          teacher_id: "TID002",
        },
        sessions: [
          {
            subject: "English Literature",
            type: "Core",
            elective_subject_name: null,
            room: "102",
            class_details: [
              {
                grade: "10th",
                division: "B",
                number_of_students: 27,
              },
            ],
          },
          {
            subject: "Creative Writing",
            type: "Elective",
            elective_subject_name: "Creative Writing",
            room: "202",
            class_details: [
              {
                grade: "11th",
                division: "A",
                number_of_students: 15,
              },
              {
                grade: "11th",
                division: "C",
                number_of_students: 18,
              },
            ],
          },
          {
            subject: "English Literature",
            type: "Core",
            elective_subject_name: null,
            room: "103",
            class_details: [
              {
                grade: "12th",
                division: "A",
                number_of_students: 22,
              },
            ],
          },
          {
            subject: "Drama",
            type: "Elective",
            elective_subject_name: "Drama",
            room: "301",
            class_details: [
              {
                grade: "10th",
                division: "C",
                number_of_students: 20,
              },
              {
                grade: "12th",
                division: "B",
                number_of_students: 18,
              },
            ],
          },
        ],
      },
      {
        instructor: {
          name: "Ms. Laura Martinez",
          image: "teacher03.jpg",
          surname: "Martinez",
          teacher_id: "TID003",
        },
        sessions: [
          {
            subject: "Biology",
            type: "Core",
            elective_subject_name: null,
            room: "104",
            class_details: [
              {
                grade: "10th",
                division: "A",
                number_of_students: 30,
              },
            ],
          },
          {
            subject: "Environmental Science",
            type: "Elective",
            elective_subject_name: "Environmental Science",
            room: "303",
            class_details: [
              {
                grade: "11th",
                division: "B",
                number_of_students: 18,
              },
              {
                grade: "12th",
                division: "C",
                number_of_students: 17,
              },
            ],
          },
          {
            subject: "Chemistry",
            type: "Core",
            elective_subject_name: null,
            room: "105",
            class_details: [
              {
                grade: "11th",
                division: "C",
                number_of_students: 25,
              },
            ],
          },
          {
            subject: "Biology Lab",
            type: "Core",
            elective_subject_name: null,
            room: "Lab 3",
            class_details: [
              {
                grade: "12th",
                division: "A",
                number_of_students: 28,
              },
            ],
          },
        ],
      },
    ],
    // Repeat similar modifications for other days...
  };
  