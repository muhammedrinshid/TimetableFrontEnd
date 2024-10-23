export function checkRoomConflicts(timetable) {
  const errors = [];

  // Iterate through each classroom
  for (const classroomData of timetable) {
    const sessions = classroomData.sessions;

    // Iterate through each period (session group)
    for (
      let sessionGroupIndex = 0;
      sessionGroupIndex < sessions.length;
      sessionGroupIndex++
    ) {
      const sessionGroup = sessions[sessionGroupIndex];
      const roomsInUse = new Map(); // key: roomId, value: {id, name} of teacher

      // For each session in the session group
      for (const session of sessionGroup) {
        // For each class distribution in the session
        for (const distribution of session.class_distribution) {
          // Check if this distribution has a room
          if (distribution.room) {
            const roomId = distribution.room.id;

            // Only process if we have a valid room ID
            if (roomId) {
              // Check for room conflict
              if (roomsInUse.has(roomId)) {
                errors.push({
                  type: "Room Conflict",
                  sessionGroup: sessionGroupIndex + 1,
                  room: distribution.room.name,
                  roomId: roomId,
                  teachers: [
                    {
                      id: roomsInUse.get(roomId).id,
                      name: roomsInUse.get(roomId).name,
                    },
                    {
                      id: distribution.teacher.id,
                      name: distribution.teacher.name,
                    },
                  ],
                });
              } else {
                // Add this room usage to the tracking map
                roomsInUse.set(roomId, {
                  id: distribution.teacher.id,
                  name: distribution.teacher.name,
                });
              }
            }
          }
        }
      }
    }
  }

  return errors;
}
export function checkTeacherScheduleConflicts(timetable) {
  const errors = [];

  Object.entries(timetable).forEach(([day, classrooms]) => {
    classrooms.forEach((classroom) => {
      classroom.sessions.forEach((sessionGroup, periodIndex) => {
        const teachersInSession = new Map();

        sessionGroup.forEach((session) => {
          session.class_distribution.forEach((distribution) => {
            const teacherId = distribution.teacher.id;

            // Skip if it's the same elective group
            if (
              session.type === "Elective" &&
              teachersInSession.has(teacherId) &&
              teachersInSession.get(teacherId).type === "Elective"
            ) {
              return;
            }

            if (teachersInSession.has(teacherId)) {
              errors.push({
                type: "Teacher Schedule Conflict",
                day: day,
                period: periodIndex + 1,
                teacher: {
                  id: distribution.teacher.id,
                  name: distribution.teacher.name,
                },
                rooms: [
                  teachersInSession.get(teacherId).room,
                  distribution.room.name,
                ],
                class: `${classroom.classroom.standard}-${classroom.classroom.division}`,
              });
            } else {
              teachersInSession.set(teacherId, {
                room: distribution.room.name,
                type: session.type,
              });
            }
          });
        });
      });
    });
  });

  return errors;
}

export function checkEmptyPeriods(timetable) {
  const errors = [];

  Object.entries(timetable).forEach(([day, classrooms]) => {
    classrooms.forEach((classroom) => {
      classroom.sessions.forEach((sessionGroup, periodIndex) => {
        if (sessionGroup.length === 0) {
          errors.push({
            type: "Empty Period",
            day: day,
            period: periodIndex + 1,
            class: `${classroom.classroom.standard}-${classroom.classroom.division}`,
          });
        }
      });
    });
  });

  return errors;
}

export function checkStudentConflicts(timetable) {
  let conflicts = [];

  // Combine all conflicts from different checks
  conflicts = conflicts.concat(checkRoomConflicts(timetable));

  return conflicts;
}
