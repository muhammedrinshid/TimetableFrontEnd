export function checkRoomAndTeacherConflicts(timetable) {
  // Input validation
  if (!Array.isArray(timetable)) {
    throw new Error("Timetable must be an array");
  }

  const errors = [];
  // Get maximum number of sessions across all classrooms
  const maxSessions = Math.max(
    ...timetable.map((classroomData) =>
      Array.isArray(classroomData?.sessions) ? classroomData.sessions.length : 0
    )
  );

  // Iterate through each session period
  for (
    let sessionGroupIndex = 0;
    sessionGroupIndex < maxSessions;
    sessionGroupIndex++
  ) {
    const roomsInUse = new Map();
    const teachersInSession = new Map();
    const electiveGroupInSession = new Map();

    // Process each classroom's sessions
    timetable.forEach((classroomData, classRoomIndx) => {
      if (!classroomData?.classroom) {
        return; // Skip invalid classroom data
      }

      const sessionGroup = classroomData.sessions[sessionGroupIndex] || [];

      sessionGroup.forEach((session) => {
        // Skip empty sessions
        if (!session?.name || !session?.class_distribution) {
          return;
        }

        // Process each distribution in the session
        session.class_distribution.forEach((distribution) => {
          if (!distribution?.room?.id || !distribution?.teacher?.id) {
            return; // Skip invalid distribution data
          }

          const roomId = distribution.room.id;
          const teacherId = distribution.teacher.id;
          const currentClassroom = {
            id: classroomData.classroom.id,
            standard: classroomData.classroom.standard,
            division: classroomData.classroom.division,
          };

          // Handle elective sessions
          if (session.elective_id) {
            if (electiveGroupInSession.has(session.elective_id)) {
              // Same elective group - just update tracking maps
              roomsInUse.set(roomId, currentClassroom);
              teachersInSession.set(teacherId, currentClassroom);
            } else {
              // New elective group - check for conflicts
              electiveGroupInSession.set(session.elective_id, true);
              checkAndRecordConflicts();
            }
          } else {
            // Non-elective sessions - always check for conflicts
            checkAndRecordConflicts();
          }

          function checkAndRecordConflicts() {
            // Check room conflict
            if (roomsInUse.has(roomId)) {
              errors.push({
                type: "Room Conflict",
                period: sessionGroupIndex + 1,
                room: distribution.room.name,
                classRoomId:classroomData?.classroom?.id,
                roomId,
                classRooms: [roomsInUse.get(roomId), currentClassroom],
              });
            } else {
              roomsInUse.set(roomId, currentClassroom);
            }

            // Check teacher conflict
            if (teachersInSession.has(teacherId)) {
              errors.push({
                type: "Teacher Conflict",
                period: sessionGroupIndex + 1,
                teacher: distribution.teacher.name,
                classRoomId:classroomData?.classroom?.id,
                teacherId,
                classRooms: [
                  teachersInSession.get(teacherId),
                  currentClassroom,
                ],
              });
            } else {
              teachersInSession.set(teacherId, currentClassroom);
            }
          }
        });
      });
    });
  }

  return errors;
}

export function checkEmptyPeriods(timetable) {
  const errors = [];

  timetable.forEach((classroomData, classRoomIndx) => {
    classroomData.sessions.forEach((sessionGroup, periodIndex) => {
      if (
        sessionGroup.length === 0 ||
        (sessionGroup.length == 1 && sessionGroup[0].name == null)
      ) {
        errors.push({
          type: "Empty Period",
          period: periodIndex + 1,
          classRoomId: classroomData?.classroom?.id,

          class: `${classroomData.classroom.standard}-${classroomData.classroom.division}`,
          classRooms: [
            {
              id: classroomData.classroom.id,
              standard: classroomData.classroom.standard,
              division: classroomData.classroom.division,
            },
          ],
        });
      }
    });
  });
  return errors;
}

export function checkConcurrentSessions(timetable) {
  const errors = [];

  timetable.forEach((classroomData) => {
    classroomData.sessions.forEach((sessionGroup, sessionGroupIndex) => {
      if (sessionGroup.length > 1) {
        errors.push({
          type: "Concurrent Sessions",
          sessionGroup: sessionGroupIndex + 1,
          classRooms: [
            {
              id: classroomData.classroom.id,
              standard: classroomData.classroom.standard,
              division: classroomData.classroom.division,
            },
          ],
          sessions: sessionGroup.map((session) => ({
            subject: session.name,
          })),
        });
      }
    });
  });

  return errors;
}

export function checkStudentConflicts(timetable) {
  let conflicts = [];

  // Combine all conflicts from different checks
  conflicts = conflicts.concat(checkRoomAndTeacherConflicts(timetable));
  conflicts = conflicts.concat(checkEmptyPeriods(timetable));
  conflicts = conflicts.concat(checkConcurrentSessions(timetable));

  return conflicts;
}
