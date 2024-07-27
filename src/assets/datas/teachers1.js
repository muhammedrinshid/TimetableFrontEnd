import { teacher010, teacher02, teacher03, teacher04, teacher06, teacher07, teacher08 } from "../images";

export const teachers1 = [
  {
      "name": "Emily",
      "surname": "Clark",
      "teacher_id": "T020",
      "email": "emily.clark@example.com",
      "phone": "555-1122",
      "qualified_subjects": ["Math", "Physics"],
      "time_table": [
          {
            day: "mon",
            class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 6, "sub": 0 }, null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "tue",
            class_slots: [null, { "class": 1, "sub": 0 }, null, { "class": 4, "sub": 1 }, null, { "class": 7, "sub": 0 }, null, { "class": 8, "sub": 1 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "wed",
            class_slots: [null, { "class": 5, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 3, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "thu",
            class_slots: [null, { "class": 8, "sub": 1 }, null, { "class": 1, "sub": 0 }, null, { "class": 4, "sub": 1 }, null, { "class": 7, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "fri",
            class_slots: [null, { "class": 2, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 3, "sub": 0 }, null, { "class": 6, "sub": 1 }],
            present: [true, true, true, true, true, true, true, true]
          }
      ],
      "image": teacher010,
      "minimum_number_periods_per_week": 22,
      "maximum_number_periods_per_week": 18
  },
  {
      "name": "Robert",
      "surname": "Green",
      "teacher_id": "T021",
      "email": "robert.green@example.com",
      "phone": "555-3344",
      "qualified_subjects": ["Chemistry", "Biology"],
      "time_table": [
          {
            day: "mon",
            class_slots: [null, { "class": 4, "sub": 1 }, null, { "class": 7, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 8, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "tue",
            class_slots: [null, { "class": 2, "sub": 0 }, null, { "class": 5, "sub": 1 }, null, { "class": 8, "sub": 0 }, null, { "class": 3, "sub": 1 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "wed",
            class_slots: [null, { "class": 6, "sub": 1 }, null, { "class": 1, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "thu",
            class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 6, "sub": 0 }, null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "fri",
            class_slots: [null, { "class": 8, "sub": 0 }, null, { "class": 3, "sub": 1 }, null, { "class": 5, "sub": 0 }, null, { "class": 1, "sub": 1 }],
            present: [true, true, true, true, true, true, true, true]
          }
      ],
      "image": teacher02,
      "minimum_number_periods_per_week": 24,
      "maximum_number_periods_per_week": 20
  },
  {
      "name": "Sophia",
      "surname": "Lee",
      "teacher_id": "T022",
      "email": "sophia.lee@example.com",
      "phone": "555-5566",
      "qualified_subjects": ["English", "Literature"],
      "time_table": [
          {
            day: "mon",
            class_slots: [null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }, null, { "class": 8, "sub": 1 }, null, { "class": 3, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "tue",
            class_slots: [null, { "class": 7, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 4, "sub": 0 }, null, { "class": 6, "sub": 1 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "wed",
            class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 8, "sub": 0 }, null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "thu",
            class_slots: [null, { "class": 6, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 1, "sub": 0 }],
            present: [true, true, true, true, true, true, true, true]
          },
          {
            day: "fri",
            class_slots: [null, { "class": 4, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 1, "sub": 0 }, null, { "class": 8, "sub": 1 }],
            present: [true, true, true, true, true, true, true, true]
          }
      ],
      "image": teacher03,
      "minimum_number_periods_per_week": 20,
      "maximum_number_periods_per_week": 16
  },

    {
        "name": "Emily",
        "surname": "Thompson",
        "teacher_id": "T020",
        "email": "emily.thompson@example.com",
        "phone": "555-1122",
        "qualified_subjects": ["English", "Drama"],
        "time_table": [
            {
              day: "mon",
              class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 6, "sub": 0 }, null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "tue",
              class_slots: [null, { "class": 1, "sub": 0 }, null, { "class": 4, "sub": 1 }, null, { "class": 7, "sub": 0 }, null, { "class": 8, "sub": 1 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "wed",
              class_slots: [null, { "class": 5, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 3, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "thu",
              class_slots: [null, { "class": 8, "sub": 1 }, null, { "class": 1, "sub": 0 }, null, { "class": 4, "sub": 1 }, null, { "class": 7, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "fri",
              class_slots: [null, { "class": 2, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 3, "sub": 0 }, null, { "class": 6, "sub": 1 }],
              present: [true, true, true, true, true, true, true, true]
            }
        ],
        "image": teacher010,
        "minimum_number_periods_per_week": 24,
        "maximum_number_periods_per_week": 18
    },
    {
        "name": "Robert",
        "surname": "Chen",
        "teacher_id": "T021",
        "email": "robert.chen@example.com",
        "phone": "555-3344",
        "qualified_subjects": ["Physics", "Math"],
        "time_table": [
            {
              day: "mon",
              class_slots: [null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 8, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "tue",
              class_slots: [null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }, null, { "class": 8, "sub": 1 }, null, { "class": 3, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "wed",
              class_slots: [null, { "class": 6, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 4, "sub": 0 }, null, { "class": 7, "sub": 1 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "thu",
              class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 8, "sub": 0 }, null, { "class": 5, "sub": 1 }, null, { "class": 2, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "fri",
              class_slots: [null, { "class": 1, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 3, "sub": 0 }, null, { "class": 8, "sub": 1 }],
              present: [true, true, true, true, true, true, true, true]
            }
        ],
        "image": teacher02,
        "minimum_number_periods_per_week": 22,
        "maximum_number_periods_per_week": 20
    },
    {
        "name": "Sophia",
        "surname": "Garcia",
        "teacher_id": "T022",
        "email": "sophia.garcia@example.com",
        "phone": "555-5566",
        "qualified_subjects": ["Biology", "Environmental Science"],
        "time_table": [
            {
              day: "mon",
              class_slots: [null, { "class": 5, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "tue",
              class_slots: [null, { "class": 8, "sub": 1 }, null, { "class": 3, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 1, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "wed",
              class_slots: [null, { "class": 4, "sub": 1 }, null, { "class": 7, "sub": 0 }, null, { "class": 2, "sub": 1 }, null, { "class": 5, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "thu",
              class_slots: [null, { "class": 1, "sub": 1 }, null, { "class": 6, "sub": 0 }, null, { "class": 3, "sub": 1 }, null, { "class": 8, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "fri",
              class_slots: [null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 5, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            }
        ],
        "image": teacher04,
        "minimum_number_periods_per_week": 25,
        "maximum_number_periods_per_week": 16
    },
    {
        "name": "Daniel",
        "surname": "Kim",
        "teacher_id": "T023",
        "email": "daniel.kim@example.com",
        "phone": "555-7788",
        "qualified_subjects": ["Chemistry", "Computer Science"],
        "time_table": [
            {
              day: "mon",
              class_slots: [null, { "class": 2, "sub": 0 }, null, { "class": 8, "sub": 1 }, null, { "class": 5, "sub": 0 }, null, { "class": 1, "sub": 1 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "tue",
              class_slots: [null, { "class": 6, "sub": 1 }, null, { "class": 3, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "wed",
              class_slots: [null, { "class": 1, "sub": 1 }, null, { "class": 5, "sub": 0 }, null, { "class": 8, "sub": 1 }, null, { "class": 2, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "thu",
              class_slots: [null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 6, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "fri",
              class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 8, "sub": 0 }, null, { "class": 5, "sub": 1 }, null, { "class": 2, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            }
        ],
        "image": teacher08,
        "minimum_number_periods_per_week": 23,
        "maximum_number_periods_per_week": 19
    },
    {
        "name": "Olivia",
        "surname": "Patel",
        "teacher_id": "T024",
        "email": "olivia.patel@example.com",
        "phone": "555-9900",
        "qualified_subjects": ["History", "Political Science"],
        "time_table": [
            {
              day: "mon",
              class_slots: [null, { "class": 4, "sub": 1 }, null, { "class": 1, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 3, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "tue",
              class_slots: [null, { "class": 7, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 5, "sub": 1 }, null, { "class": 8, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "wed",
              class_slots: [null, { "class": 3, "sub": 1 }, null, { "class": 8, "sub": 0 }, null, { "class": 1, "sub": 1 }, null, { "class": 6, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "thu",
              class_slots: [null, { "class": 5, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 7, "sub": 1 }, null, { "class": 4, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "fri",
              class_slots: [null, { "class": 8, "sub": 1 }, null, { "class": 3, "sub": 0 }, null, { "class": 6, "sub": 1 }, null, { "class": 1, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            }
        ],
        "image": teacher07,
        "minimum_number_periods_per_week": 26,
        "maximum_number_periods_per_week": 17
    },
    {
        "name": "Ethan",
        "surname": "Nguyen",
        "teacher_id": "T025",
        "email": "ethan.nguyen@example.com",
        "phone": "555-1133",
        "qualified_subjects": ["Physical Education", "Health"],
        "time_table": [
            {
              day: "mon",
              class_slots: [null, { "class": 6, "sub": 0 }, null, { "class": 3, "sub": 1 }, null, { "class": 8, "sub": 0 }, null, { "class": 2, "sub": 1 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "tue",
              class_slots: [null, { "class": 1, "sub": 1 }, null, { "class": 7, "sub": 0 }, null, { "class": 4, "sub": 1 }, null, { "class": 5, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "wed",
              class_slots: [{ "class": 4, "sub": 1 }, { "class": 8, "sub": 1 }, null, { "class": 2, "sub": 0 }, null, { "class": 5, "sub": 1 }, { "class": 4, "sub": 1 }, { "class": 1, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "thu",
              class_slots: [null, { "class": 4, "sub": 1 }, { "class": 4, "sub": 1 }, { "class": 6, "sub": 0 }, null, { "class": 3, "sub": 1 }, null, { "class": 7, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            },
            {
              day: "fri",
              class_slots: [null, { "class": 5, "sub": 1 }, { "class": 4, "sub": 1 }, { "class": 1, "sub": 0 }, null, { "class": 8, "sub": 1 }, { "class": 4, "sub": 1 }, { "class": 3, "sub": 0 }],
              present: [true, true, true, true, true, true, true, true]
            }
        ],
        "image": teacher06,
        "minimum_number_periods_per_week": 21,
        "maximum_number_periods_per_week": 18
    },
   
];







