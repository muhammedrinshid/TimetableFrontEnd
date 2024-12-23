


[
    {
        "id": "b1bd25a6-515c-4eea-8b99-85b07311890f",
        "name": "Dinesh",
        "surname": "Luka",
        "email": "dinesh@gmail.com",
        "phone": "97898452",
        "min_lessons_per_week": 10,
        "max_lessons_per_week": 15,
        "teacher_id": "T0005",
        "profile_image": "/media/teacher_profiles/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg",
        "qualified_subjects_display": [
            {
                "name": "Information Technology",
                "id": "1b7854ff-cede-4359-a82e-cabbac40e958"
            }
        ],
        "grades_display": [
            {
                "name": "Elementary School",
                "short_name": "ES",
                "id": "44194619-8feb-439d-a645-7dbfee709fb6"
            },
            {
                "name": "Middle School",
                "short_name": "MS",
                "id": "f55d96fa-165e-41cd-9f8e-feb0d382bc3e"
            }
        ]
    }

]

// "condensed_timetable": [
//     {
//         "taecher_details": {
//             "name": "10",
//             "surname": "A",
//             "teacher_id": "10A"
//         },
//         "timetable_rows": {
//             "FRI": [
//                 [
//                     {
//                         "subject": "Eng",
//                         "is_elective": false,
//                         "room_no":,
//                     }
//                 ],
//                 [
//                     {
//                         "subject": "Eng",
//                         "is_elective": true,                        "room_no":,

//                     },
//                     {
//                         "subject": "Spa",
//                         "is_elective": true,                        "room_no":,

//                     },
//                     {
//                         "subject": "Fre",
//                         "is_elective": true ,                         "room_no":,

//                     }
//                 ],




[
    {
        "grade_name": "High School",
        "grade_short_name": "HS",
        "grade_id": "e356019d-fc7f-4fed-b228-90fe685b139a",
        "standards": [
            {
                "standard_short_name": "10",
                "standard_id": "8ccc2c3c-8222-4a5f-92cc-db3c1f9bb71b",
                "electives_groups": [
                    {
                        "group_name": "10FL 1",
                        "group_id": "0cc12532-33b4-4e0d-98b2-ede56a7d399c",
                        "elective_subjects": [
                            {
                                "elective_subject_name": "Foreign Language",
                                "lessons_per_week": 2,
                                "classroom_name": "10A",
                                "options": [
                                    "URD",
                                    "FRE"
                                ]
                            },
                            {
                                "elective_subject_name": "Foreign Language",
                                "lessons_per_week": 2,
                                "classroom_name": "10B",
                                "options": [
                                    "URD",
                                    "SPA"
                                ]
                            },
                            {
                                "elective_subject_name": "Foreign Language",
                                "lessons_per_week": 2,
                                "classroom_name": "10C",
                                "options": [
                                    "FRE",
                                    "SPA"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "grade_name": "Middle School",
        "grade_short_name": "MS",
        "grade_id": "bf06d671-5d50-4ed0-b915-cef4fdb8e24b",
        "standards": [
            {
                "standard_short_name": "7",
                "standard_id": "4fca90b4-4553-4d1f-82d1-9e6a235df1ad",
                "electives_groups": [
                    {
                        "group_name": "7FL 1",
                        "group_id": "5cbc7c7b-ffda-477c-abcb-1e850fb4c122",
                        "elective_subjects": []
                    },
                    {
                        "group_name": "7FL 2",
                        "group_id": "b63425aa-1e47-46d1-a6ac-74cd22297b10",
                        "elective_subjects": [
                            {
                                "elective_subject_name": "Foreign Language",
                                "lessons_per_week": 2,
                                "classroom_name": "7A",
                                "options": [
                                    "URD",
                                    "FRE",
                                    "SPA"
                                ]
                            },
                            {
                                "elective_subject_name": "Foreign Language",
                                "lessons_per_week": 2,
                                "classroom_name": "7B",
                                "options": [
                                    "FRE",
                                    "SPA"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

setElectiveGroups((prev)={
    const updatedGroups = JSON.parse(JSON.stringify(prevGroups)); // Deep clone to avoid direct mutation

    let removedElectiveSubjects = [];

    // Find the standard and group
    
  })