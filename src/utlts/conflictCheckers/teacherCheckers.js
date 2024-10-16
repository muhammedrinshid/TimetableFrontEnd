export function checkRoomAndClassConflicts(teacherTimetable) {
  const errors = [];
  const maxSessions = Math.max(
    ...teacherTimetable.map((teacher) => teacher.sessions.length)
  );

  for (
    let sessionGroupIndex = 0;
    sessionGroupIndex < maxSessions;
    sessionGroupIndex++
  ) {
    const roomsInUse = new Map();
    const classesInSession = new Map();

    teacherTimetable.forEach((teacher) => {
      const sessionGroup = teacher.sessions[sessionGroupIndex] || [];

      sessionGroup.forEach((session) => {
        if (session.subject) {
          // Check for room conflicts
          if (session.room && session.room.id) {
            const roomId = session.room.id;
            if (roomsInUse.has(roomId)) {
              errors.push({
                type: "Room Conflict",
                sessionGroup: sessionGroupIndex + 1,
                room: session.room.name,
                roomId: roomId,
                teachers: [
                  {
                    id: roomsInUse.get(roomId).id,
                    name: roomsInUse.get(roomId).name,
                  },
                  { id: teacher.instructor.id, name: teacher.instructor.name },
                ],
              });
            } else {
              roomsInUse.set(roomId, {
                id: teacher.instructor.id,
                name: teacher.instructor.name,
              });
            }
          }

          // Check for class conflicts
          if (session.class_details) {
            session.class_details.forEach((classDetail) => {
              if (classDetail.id) {
                const classId = classDetail.id;
                if (classesInSession.has(classId)) {
                  const existingSession = classesInSession.get(classId);
                  // Check if both sessions are electives and have the same elective group ID
                  const isElectiveConflict =
                    session.type === "Elective" &&
                    existingSession.type === "Elective" &&
                    session.elective_group_id ===
                      existingSession.elective_group_id;

                  // Only add to errors if it's not an elective or if it's an elective conflict
                  if (!isElectiveConflict) {
                    errors.push({
                      type: "Class Conflict",
                      sessionGroup: sessionGroupIndex + 1,
                      class: `${classDetail.standard}-${classDetail.division}`,
                      classId: classId,
                      teachers: [
                        {
                          id: existingSession.teacherId,
                          name: existingSession.teacherName,
                        },
                        {
                          id: teacher.instructor.id,
                          name: teacher.instructor.name,
                        },
                      ],
                      isElectiveConflict: isElectiveConflict,
                    });
                  }
                } else {
                  classesInSession.set(classId, {
                    teacherId: teacher.instructor.id,
                    teacherName: teacher.instructor.name,
                    type: session.type,
                    elective_group_id: session.elective_group_id,
                  });
                }
              }
            });
          }
        }
      });
    });
  }

  return errors;
}
export function checkTeacherQualifications(teacherTimetable) {
  const errors = [];

  teacherTimetable.forEach((teacher) => {
    const qualifiedSubjectIds = new Set(
      teacher.instructor.qualified_subjects.map((subject) => subject.id)
    );

    teacher.sessions.forEach((sessionGroup, sessionGroupIndex) => {
      sessionGroup.forEach((session, sessionIndex) => {
        if (session.subject && session.subject_id) {
          if (!qualifiedSubjectIds.has(session.subject_id)) {
            errors.push({
              type: "Unqualified Teacher",
              sessionGroup: sessionGroupIndex + 1,
              sessionIndex: sessionIndex + 1,
              teachers: [
                {
                  id: teacher.instructor.id,
                  name: teacher.instructor.name,
                },
              ],
              subject: session.subject,
              subjectId: session.subject_id,
            });
          }
        }
      });
    });
  });

  return errors;
}

export function checkTeacherConflicts(timetable) {
  let conflicts = [];
  conflicts = conflicts.concat(checkTeacherQualifications(timetable));
  conflicts = conflicts.concat(checkRoomAndClassConflicts(timetable));
  return conflicts;
}
