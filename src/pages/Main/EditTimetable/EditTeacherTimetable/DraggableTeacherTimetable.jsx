import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditTeacherListCard from "./EditTeacherListCard";
import { useConflictChecker } from "../../../../hooks/useConflictChecker";
import DroppableCell from "./DroppableCell";
import TeacherLessonReassignmentDialog from "./TeacherLessonReassignmentTeacherLessonReassignmentDialog";

// Column dragging component
const DraggableColumn = ({ columnIndex, children, moveColumn,onChangesetSelectedSessionForRoomNumber }) => {
  const [, drag] = useDrag({
    type: "COLUMN",
    item: { columnIndex, type: "COLUMN" },
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (draggedItem) => {
      if (draggedItem.columnIndex !== columnIndex) {
        moveColumn(draggedItem.columnIndex, columnIndex);
        draggedItem.columnIndex = columnIndex;
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      className="p-4 font-semibold cursor-pointer"
      onClick={()=>onChangesetSelectedSessionForRoomNumber(columnIndex)}
    >
      {children}
    </th>
  );
};

// Session dragging component

// Modified cell component to only handle session drops

const DraggableTeacherTimetable = ({
  teacherWeekTimetable,
  selectedDay,
  setTeacherWeekTimetable,
  NumberOfPeriodsInAday,
  searchTerm,
  setConflicts,
  conflicts,
  onChangesetSelectedSessionForRoomNumber,
  handleOpenRoomChangeDialog,
}) => {
  const [columns, setColumns] = useState(
    Array.from({ length: NumberOfPeriodsInAday }, (_, i) => `Period ${i + 1}`)
  );
  const [filteredTimetable, setFilteredTimetable] = useState(
    teacherWeekTimetable[selectedDay]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSwapParams, setCurrentSwapParams] = useState(null);

  const checkedConflicts = useConflictChecker(
    teacherWeekTimetable[selectedDay],
    "teacher"
  );

  useEffect(() => {
    setConflicts(checkedConflicts);
  }, [checkedConflicts, setConflicts]);

  useEffect(() => {
    setFilteredTimetable(teacherWeekTimetable[selectedDay]);
  }, [teacherWeekTimetable, selectedDay]);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = teacherWeekTimetable[selectedDay]?.filter((teacher) => {
        const nameMatch = teacher.instructor.name
          .toLowerCase()
          .includes(lowercasedSearch);
        const sessionMatch = teacher.sessions.some((sessionGroup) =>
          sessionGroup.some((session) => {
            const subjectMatch = (
              session?.subject ||
              session?.elective_subject_name ||
              ""
            )
              .toLowerCase()
              .includes(lowercasedSearch);
            const roomMatch = session?.room?.room_number
              ?.toString()
              .toLowerCase()
              .includes(lowercasedSearch);
            return subjectMatch || roomMatch;
          })
        );
        return nameMatch || sessionMatch;
      });
      setFilteredTimetable(filtered);
    } else {
      setFilteredTimetable(teacherWeekTimetable[selectedDay]);
    }
  }, [searchTerm, teacherWeekTimetable, selectedDay]);

  const moveColumn = useCallback(
    (fromIndex, toIndex) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);
        return newColumns;
      });

      setTeacherWeekTimetable((prevTimetable) => {
        const newTimetable = JSON.parse(JSON.stringify(prevTimetable));
        newTimetable[selectedDay] = newTimetable[selectedDay].map((teacher) => {
          const newSessions = [...teacher.sessions];
          const [movedSession] = newSessions.splice(fromIndex, 1);
          newSessions.splice(toIndex, 0, movedSession);
          return { ...teacher, sessions: newSessions };
        });
        return newTimetable;
      });
    },
    [selectedDay, setTeacherWeekTimetable]
  );

  const moveSession = useCallback(
    (draggedSession, toRowIndex, toColumnIndex) => {
      setTeacherWeekTimetable((prevTimetable) => {
        const newTimetable = JSON.parse(JSON.stringify(prevTimetable));
        const newDayTimetable = newTimetable[selectedDay];

        const fromRowIndex = draggedSession.rowIndex;
        const fromColumnIndex = draggedSession.columnIndex;

        if (fromRowIndex === toRowIndex && fromColumnIndex === toColumnIndex) {
          return prevTimetable;
        }

        const fromTeacher = newDayTimetable[fromRowIndex];
        const toTeacher = newDayTimetable[toRowIndex];
        const fromSessionGroup = fromTeacher.sessions[fromColumnIndex];
        const toSessionGroup = toTeacher.sessions[toColumnIndex];

        const sessionToMove = {
          ...fromSessionGroup[draggedSession.sessionIndex],
        };

        fromSessionGroup.splice(draggedSession.sessionIndex, 1);

        if (fromSessionGroup.length === 0) {
          fromSessionGroup.push({
            subject: null,
            type: null,
            elective_group_id: null,
            subject_id: null,
            elective_subject_name: null,
            room: null,
            class_details: null,
          });
        }

        if (toSessionGroup.length === 1 && toSessionGroup[0].subject === null) {
          toSessionGroup.length = 0;
        }

        toSessionGroup.push(sessionToMove);

        fromTeacher.sessions[fromColumnIndex] = fromSessionGroup;
        toTeacher.sessions[toColumnIndex] = toSessionGroup;

        return newTimetable;
      });
    },
    [selectedDay, setTeacherWeekTimetable]
  );

  const hasConflict = (teacherIndex, sessionGroup) => {
    return (
      conflicts?.length > 0 &&
      conflicts?.some(
        (conflict) =>
          conflict.sessionGroup === sessionGroup + 1 &&
          conflict.teachers.some(
            (teacher) =>
              teacher.id === filteredTimetable[teacherIndex].instructor.id
          )
      )
    );
  };

  const handleOpenTeacherLessonReassignmentDialog = (
    teacherId,
    selectedDay,
    sessionNumber,
    selectedSession,
    teacherWeekTimetable
  ) => {
    setCurrentSwapParams({
      teacherId,
      selectedDay,
      sessionNumber,
      selectedSession,
      teacherWeekTimetable,
    });
    setIsDialogOpen(true);
  };

  const handleCloseTeacherLessonReassignmentDialog = () => {
    setIsDialogOpen(false);
    setCurrentSwapParams(null);
  };

  const handleTeacherLessonReassignmentSwap = (selectedSwap) => {
    setTeacherWeekTimetable((prevTimetable) => {
      const updatedTimetable = JSON.parse(JSON.stringify(prevTimetable)); // Deep copy

      const { headers, teachers } = selectedSwap;
      const [, swap1, swap2] = headers;

      teachers.forEach(({ instructor }) => {
        const dayIndex1 = Object.keys(updatedTimetable).findIndex(
          (day) => day === swap1.dayofweek
        );
        const dayIndex2 = Object.keys(updatedTimetable).findIndex(
          (day) => day === swap2.dayofweek
        );

        if (dayIndex1 !== -1 && dayIndex2 !== -1) {
          const day1 = Object.keys(updatedTimetable)[dayIndex1];
          const day2 = Object.keys(updatedTimetable)[dayIndex2];

          const teacherIndex1 = updatedTimetable[day1].findIndex(
            (t) => t.instructor.id === instructor.id
          );
          const teacherIndex2 = updatedTimetable[day2].findIndex(
            (t) => t.instructor.id === instructor.id
          );

          if (teacherIndex1 !== -1 && teacherIndex2 !== -1) {
            let session1 =
              updatedTimetable[day1][teacherIndex1].sessions[
                swap1.sessiongrpindx
              ];
            let session2 =
              updatedTimetable[day2][teacherIndex2].sessions[
                swap2.sessiongrpindx
              ];

            updatedTimetable[day1][teacherIndex1].sessions[
              swap1.sessiongrpindx
            ] = session2;
            updatedTimetable[day2][teacherIndex2].sessions[
              swap2.sessiongrpindx
            ] = session1;
          }
        }
      });

      return updatedTimetable;
    });
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="shadow-xl rounded-lg bg-white dark:bg-gray-800 overflow-auto max-h-[88%] w-full">
        <table className="border-collapse w-full h-full">
          <thead>
            <tr className="sticky left-0 top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-500 dark:text-gray-200 p-4 font-semibold">
              <th className="p-4 font-semibold">Teacher</th>
              {columns.map((header, index) => (
                <DraggableColumn
                  key={index}
                  columnIndex={index}
                  moveColumn={moveColumn}
                  onChangesetSelectedSessionForRoomNumber={
                    onChangesetSelectedSessionForRoomNumber
                  }
                >
                  {header}
                </DraggableColumn>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTimetable?.map((teacher, teacherIndex) => (
              <tr key={teacherIndex}>
                <td className="sticky left-0 bg-white dark:bg-gray-800 border p-4 z-10 backdrop-blur-md bg-opacity-50">
                  <EditTeacherListCard
                    sessions={teacher?.sessions}
                    teacher={teacher.instructor}
                  />
                </td>
                {teacher.sessions.map((sessionGroup, columnIndex) => (
                  <DroppableCell
                    key={columnIndex}
                    teacher={teacher}
                    rowIndex={teacherIndex}
                    columnIndex={columnIndex}
                    sessions={sessionGroup}
                    moveSession={moveSession}
                    hasConflict={hasConflict}
                    onOpenTeacherSwapDialog={
                      handleOpenTeacherLessonReassignmentDialog
                    }
                    selectedDay={selectedDay}
                    teacherWeekTimetable={teacherWeekTimetable}
                    handleOpenRoomChangeDialog={handleOpenRoomChangeDialog}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <TeacherLessonReassignmentDialog
          isOpen={isDialogOpen}
          onClose={handleCloseTeacherLessonReassignmentDialog}
          swapParams={currentSwapParams}
          onConfirm={handleTeacherLessonReassignmentSwap}
        />
      </div>
    </DndProvider>
  );
};

export default DraggableTeacherTimetable;
