classroomdata=[


    name:"class room name ",
    standard name:"name of the class_room standard",
    division:"classroom division",
    room no:"class_room.room.number",
    lessons_assinged_subjects:"which will calculate the total number of lessons per week of each class subject of a class room either you can create a new property in class_room or calculate in each query",
    subjects_assigned_teacher:"this will give a intiger ,how this get, from all class_subject of class room itrete each subjects is this has_assigned_teacher you can alter the model by creating a new property"
    total_subject:"total number of subjects in each class_subject of a classs room you can alter the model by creating a new property"
    subject data= [
        {
          name: "Mathematics", 
        //   "name of the class_subject"
          lessonsPerWeek: 5,
          is_elective: false,
        //   a core subject has only on subject in subjects of class_subject so create a list of assighed teachers with classsubjectsubject model
          teacher: [
            { name: "John Doe", avatar: "JD" },
            { name: "Jane Smith", avatar: "JS" },

          ],

        },
        {
          name: "Science",
          lessonsPerWeek: 4,
          is_elective: false,
          teacher: [{ name: "Emily Brown", avatar: "EB" }],
        },
        {
          name: "Languages", 
        //   "name of the class_subject"

          lessonsPerWeek: 6,
          is_elective: true,
          elective_grou: null,
    
          options: [
            {
              subject: "French",
              number_of_students: 15,
              alotted_teachers: [
                { name: "Michael Johnson", avatar: "MJ" },
                { name: "Lisa Chen", avatar: "LC" },
              ],
            },
            {
              subject: "Spanish",
              number_of_students: 18,
              alotted_teachers: [
                { name: "Sarah Lee", avatar: "SL" },
                { name: "Carlos Rodriguez", avatar: "CR" },
              ],
            },
            {
              subject: "German",
              number_of_students: 12,
              alotted_teachers: [{ name: "Hans Mueller", avatar: "HM" }],
            },
          ],
        },
        {
          name: "Social Studies",
          lessonsPerWeek: 3,
          is_elective: false,
          teacher: [{ name: "Robert Wilson", avatar: "RW" }],
        },
        {
          name: "Arts",
          lessonsPerWeek: 2,
          is_elective: true,
          elective_group: {
            name:
            id:
          }
    
          options: [
            {
              subject: "Visual Arts",
              number_of_students: 20,
              alotted_teachers: [
                { name: "Alice Thompson", avatar: "AT" },
                { name: "Emma White", avatar: "EW" },
              ],
            },
            {
              subject: "Music",
              number_of_students: 16,
              alotted_teachers: [
                { name: "David Clark", avatar: "DC" },
                { name: "Frank Miller", avatar: "FM" },
              ],
            },
            {
              subject: "Drama",
              number_of_students: 14,
              alotted_teachers: [{ name: "Grace Taylor", avatar: "GT" }],
            },
          ],
        },
      ];

]