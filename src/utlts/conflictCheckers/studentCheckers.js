export function checkRoomAndTeacherConflicts(timetable) {
  if (!Array.isArray(timetable)) {
    throw new Error("Timetable must be an array");
  }

  const errors = [];
  const maxSessions = Math.max(
    ...timetable.map((classroomData) =>
      Array.isArray(classroomData?.sessions) ? classroomData.sessions.length : 0
    )
  );

  for (
    let sessionGroupIndex = 0;
    sessionGroupIndex < maxSessions;
    sessionGroupIndex++
  ) {
    const roomsInUse = new Map();
    const teachersInSession = new Map();
    const electiveGroupInSession = new Map();

    timetable.forEach((classroomData) => {
      const classroom = classroomData?.classroom;
      if (!classroom) return;

      const sessionGroup = classroomData?.sessions?.[sessionGroupIndex] || [];
      sessionGroup.forEach((session) => {
        if (!session?.name || !session?.class_distribution) return;

        session.class_distribution.forEach((distribution) => {
          const roomId = distribution?.room?.id;
          const teacherId = distribution?.teacher?.id;

          if (!roomId || !teacherId) return;

          const currentClassroom = {
            id: classroom?.id,
            standard: classroom?.standard,
            division: classroom?.division,
          };

          if (session?.elective_id) {
            if (electiveGroupInSession.has(session.elective_id)) {
              roomsInUse.set(roomId, currentClassroom);
              teachersInSession.set(teacherId, currentClassroom);
            } else {
              electiveGroupInSession.set(session.elective_id, true);
              checkAndRecordConflicts();
            }
          } else {
            checkAndRecordConflicts();
          }

          function checkAndRecordConflicts() {
            if (roomsInUse.has(roomId)) {
              errors.push({
                type: "Room Conflict",
                period: sessionGroupIndex + 1,
                room: distribution?.room?.name,
                classRoomId: classroom?.id,
                roomId,
                classRooms: [roomsInUse.get(roomId), currentClassroom],
              });
            } else {
              roomsInUse.set(roomId, currentClassroom);
            }

            if (teachersInSession.has(teacherId)) {
              errors.push({
                type: "Teacher Conflict",
                period: sessionGroupIndex + 1,
                teacher: distribution?.teacher?.name,
                classRoomId: classroom?.id,
                teacherId,
                classRooms: [teachersInSession.get(teacherId), currentClassroom],
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

  timetable.forEach((classroomData) => {
    const classroom = classroomData?.classroom;
    classroomData?.sessions?.forEach((sessionGroup, periodIndex) => {
      if (
        sessionGroup?.length === 0 ||
        (sessionGroup?.length === 1 && !sessionGroup[0]?.name)
      ) {
        errors.push({
          type: "Empty Period",
          period: periodIndex + 1,
          classRoomId: classroom?.id,
          class: `${classroom?.standard}-${classroom?.division}`,
          classRooms: [
            {
              id: classroom?.id,
              standard: classroom?.standard,
              division: classroom?.division,
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
    const classroom = classroomData?.classroom;
    classroomData?.sessions?.forEach((sessionGroup, sessionGroupIndex) => {
      if (sessionGroup?.length > 1) {
        errors.push({
          type: "Concurrent Sessions",
          sessionGroup: sessionGroupIndex + 1,
          classRooms: [
            {
              id: classroom?.id,
              standard: classroom?.standard,
              division: classroom?.division,
            },
          ],
          sessions: sessionGroup.map((session) => ({
            subject: session?.name,
          })),
        });
      }
    });
  });

  return errors;
}

export function checkStudentConflicts(timetable) {
  let conflicts = [];

  conflicts = conflicts.concat(checkRoomAndTeacherConflicts(timetable));
  conflicts = conflicts.concat(checkEmptyPeriods(timetable));
  conflicts = conflicts.concat(checkConcurrentSessions(timetable));

  return conflicts;
}
