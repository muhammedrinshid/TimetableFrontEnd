import { teacher01, teacher02, teacher03, teacher04, teacher05, teacher06 } from "../images";

export const weeklyTimetablestudent = {
  Monday: [
    {
      standard: "10th",
      division: "A",
      sessions: [
        {
          subject: "Mathematics",
          type: "Core",
          room: "101",
          teacher: {
            name: "Dr. Emily Johnson",
            image: teacher01,
          }
        },
        {
          subject: "English Literature",
          type: "Core",
          room: "301",
          teacher: {
            name: "Prof. David Wilson",
            image: teacher04,
          }
        },
        {
          subject: "Biology",
          type: "Core",
          room: "Bio Lab",
          teacher: {
            name: "Dr. Sarah Thompson",
            image: teacher03,
          }
        },
        {
          subject: "World History",
          type: "Core",
          room: "401",
          teacher: {
            name: "Prof. Lisa Martinez",
            image: teacher05,
          }
        },
        {
          subject: "Programming",
          type: "Core",
          room: "CS Lab",
          teacher: {
            name: "Prof. Michael Chen",
            image: teacher02,
          }
        },
        {
          subject: "Advanced Art",
          type: "Elective",
          room: "Art Studio",
          teacher: {
            name: "Ms. Jennifer Lee",
          }
        },
        {
          subject: "Physical Education",
          type: "Core",
          room: "Gym",
          teacher: {
            name: "Mr. Robert Brown",
            image: teacher06,
          }
        }
      ]
    }
  ],
  Tuesday: [
    {
      standard: "10th",
      division: "A",
      sessions: [
        {
          subject: "Physics",
          type: "Core",
          room: "Lab 1",
          teacher: {
            name: "Dr. Emily Johnson",
            image: teacher01,
          }
        },
        {
          subject: "Chemistry",
          type: "Core",
          room: "Chem Lab",
          teacher: {
            name: "Dr. Alex Turner",
            image: teacher06,
          }
        },
        {
          subject: "Computer Science",
          type: "Core",
          room: "CS Lab",
          teacher: {
            name: "Prof. Michael Chen",
            image: teacher02,
          }
        },
        {
          subject: "Geography",
          type: "Core",
          room: "405",
          teacher: {
            name: "Prof. Lisa Martinez",
            image: teacher05,
          }
        },
        {
          subject: "Music Theory",
          type: "Elective",
          room: "Music Room",
          teacher: {
            name: "Mr. Daniel White",
          }
        },
        {
          subject: "English Grammar",
          type: "Core",
          room: "305",
          teacher: {
            name: "Prof. David Wilson",
            image: teacher04,
          }
        },
        {
          subject: "Environmental Science",
          type: "Elective",
          room: "205",
          teacher: {
            name: "Dr. Sarah Thompson",
          }
        }
      ]
    }
  ],
  Wednesday: [
    {
      standard: "10th",
      division: "A",
      sessions: [
        {
          subject: "Mathematics",
          type: "Core",
          room: "101",
          teacher: {
            name: "Dr. Emily Johnson",
            image: teacher01,
          }
        },
        {
          subject: "Biology Lab",
          type: "Core",
          room: "Bio Lab",
          teacher: {
            name: "Dr. Sarah Thompson",
            image: teacher03,
          }
        },
        {
          subject: "World Literature",
          type: "Core",
          room: "307",
          teacher: {
            name: "Prof. David Wilson",
            image: teacher04,
          }
        },
        {
          subject: "Civics",
          type: "Core",
          room: "409",
          teacher: {
            name: "Prof. Lisa Martinez",
            image: teacher05,
          }
        },
        {
          subject: "Programming",
          type: "Core",
          room: "CS Lab",
          teacher: {
            name: "Prof. Michael Chen",
            image: teacher02,
          }
        },
        {
          subject: "Foreign Language",
          type: "Elective",
          room: "Language Lab",
          teacher: {
            name: "Ms. Sophie Garcia",
          }
        },
        {
          subject: "Physical Education",
          type: "Core",
          room: "Gym",
          teacher: {
            name: "Mr. Robert Brown",
            image: teacher06,
          }
        }
      ]
    }
  ]
  // ... You can add more days (Thursday, Friday) following the same pattern
};