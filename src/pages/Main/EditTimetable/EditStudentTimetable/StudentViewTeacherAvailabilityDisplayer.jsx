import React, { useState, useEffect } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@mui/material";
import { useAuth } from "../../../../context/Authcontext";
import { toast } from "react-toastify";

const StudentViewTeacherAvailabilityDisplayer = ({
  availableTeachers,
  studentWeekTimetable,
  selectedDay,
  teacherChangeDialogOpen,
  setTeacherChangeDialogOpen,
}) => {
  const { darkMode, apiDomain } = useAuth();

  const [freeTeachers, setFreeTeachers] = useState([]);
  const [occupiedTeachers, setOccupiedTeachers] = useState([]);

  useEffect(() => {
    const updateTeacherAvailability = () => {
      const free = [];
      const occupied = [];

      availableTeachers.forEach((teacher) => {
        let subject = null; // Placeholder for the subject if the teacher is occupied

         const isOccupied = studentWeekTimetable[selectedDay]?.some(
           (classroomData) =>
             classroomData.sessions[
               teacherChangeDialogOpen?.selectedSessionForTeacherChange
             ]?.some((session) =>
               session?.class_distribution?.some((distribution) => {
                 const teacherMatch =
                   distribution.teacher &&
                   distribution.teacher.id === teacher.id;
                 if (teacherMatch) {
                   subject = distribution.subject; // Extract subject if the teacher is found
                 }
                 return teacherMatch;
               })
             )
         );
        if (isOccupied) {
    const newTeacher = { ...teacher, subject };
          occupied.push(newTeacher);
        } else {
          free.push(teacher);
        }
      });

      setFreeTeachers(free);
      setOccupiedTeachers(occupied);
    };

    updateTeacherAvailability();
  }, [
    availableTeachers,
    studentWeekTimetable,
    selectedDay,
    teacherChangeDialogOpen?.selectedSessionForTeacherChange,
  ]);

const isTeacherQualified = (targetTeacher, isSwap = false) => {
  // Early exit if `teacherChangeDialogOpen.fromSubject` is undefined
  if (!teacherChangeDialogOpen?.fromSubject) return false;

  // Check if `fromTeacherId` is provided, then find the `fromTeacher` and validate their eligibility
  if (isSwap) {
    const fromTeacher = availableTeachers?.find(
      (teacher) => teacher.id === teacherChangeDialogOpen?.fromTeacher?.id
    );
    const isFromTeacherEligible = fromTeacher?.qualified_subjects_display?.some(
      (subject) => subject.name === targetTeacher?.subject
    );

    const isToTeacherEligible = targetTeacher.qualified_subjects_display?.some(
      (subject) => subject.name === teacherChangeDialogOpen.fromSubject
    );

    return isFromTeacherEligible && isToTeacherEligible;
  }

  // Only check `targetTeacher` eligibility if `fromTeacherId` is not provided
  return targetTeacher.qualified_subjects_display?.some(
    (subject) => subject.name === teacherChangeDialogOpen.fromSubject
  );
};


  const handleAddTeacher = (teacherId) => {
    const selectedTeacher = availableTeachers.find(
      (teacher) => teacher.id === teacherId
    );
    if (selectedTeacher?.id==teacherChangeDialogOpen.fromTeacher?.id) {
      toast.info("Please selecte diffrent teacher")
      return
    }
    setTeacherChangeDialogOpen((prev) => ({
      ...prev,
      toTeacher: selectedTeacher,
      type: "ADD",
    }));
  };

  const handleSwapTeacher = (teacherId) => {
    let toClassroomId = null;
    let toSessionIndex = null;
    let foundTeacher = availableTeachers.find(
      (teacher) => teacher.id === teacherId
    );
     if (foundTeacher?.id == teacherChangeDialogOpen.fromTeacher?.id) {
       toast.info("Please selecte diffrent teacher");
       return
     }

    studentWeekTimetable[selectedDay]?.forEach(
      (classroomData, classRoomIndex) => {
        const sessionGrp =
          classroomData.sessions[
            teacherChangeDialogOpen?.selectedSessionForTeacherChange
          ];

        if (sessionGrp) {
          sessionGrp.forEach((session, sessionIdx) => {
            session.class_distribution?.forEach((distribution) => {
              if (
                distribution.teacher &&
                distribution.teacher.id === teacherId
              ) {
                toClassroomId = classroomData.classroom.id;
                toSessionIndex = session.id;
              }
            });
          });
        }
      }
    );

    if (toClassroomId != null) {
      setTeacherChangeDialogOpen((prev) => ({
        ...prev,
        toTeacher: foundTeacher,
        type: "SWAP",
      }));
    }
  };

  const TeacherCard = ({ teacher, isFree }) => {
    const isQualified = isTeacherQualified(teacher, !isFree);

    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md duration-200 border-l-4  ${
          !isQualified ? " border-red-500" : "border-green-500"
        }`}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Avatar
              alt={teacher.name}
              src={
                teacher.profile_image
                  ? `${apiDomain}/${teacher.profile_image}`
                  : undefined
              }
              className="w-8 h-8 rounded-full mr-2 border-2 border-white dark:border-dark-border"
            >
              {!teacher.profile_image && teacher?.name?.charAt(0)}
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {teacher.name} {teacher.surname}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {teacher.teacher_id} • Subjects:{" "}
                {teacher.qualified_subjects_display
                  .map((subject) => subject.name)
                  .join(", ")}
              </p>
              {!isQualified && (
                <p className="text-xs text-red-500">
                  Not qualified for {teacherChangeDialogOpen?.fromSubject}
                </p>
              )}
            </div>
          </div>

          {isFree && teacherChangeDialogOpen.isOpen && isQualified ? (
            <button
            onClick={()=>handleAddTeacher(teacher.id)}
              className={`h-8 w-8 inline-flex items-center justify-center rounded-full  bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30`}
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            teacherChangeDialogOpen.isOpen &&
            !isFree &&
            isQualified && (
              <button
                onClick={() => handleSwapTeacher(teacher.id)}
                className={`h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30   `}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-custom-4 dark:bg-gray-900 p-4 rounded-lg overflow-y-auto h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          Teacher Availability For Session{" "}
          {teacherChangeDialogOpen?.selectedSessionForTeacherChange + 1}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Teachers
            </h3>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {freeTeachers.length} teachers
            </span>
          </div>
          <div className="grid gap-2">
            {freeTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} isFree={true} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Occupied Teachers
            </h3>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {occupiedTeachers.length} teachers
            </span>
          </div>
          <div className="grid gap-2">
            {occupiedTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} isFree={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewTeacherAvailabilityDisplayer;
