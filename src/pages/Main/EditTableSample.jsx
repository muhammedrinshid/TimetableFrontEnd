import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const initialData = {
  columns: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  rows: [
    {
      id: "1",
      time: "09:00 - 10:00",
      cells: ["Math", "Physics", "Chemistry", "Biology", "English"],
    },
    {
      id: "2",
      time: "10:00 - 11:00",
      cells: ["History", "Geography", "Art", "Music", "PE"],
    },
    {
      id: "3",
      time: "11:00 - 12:00",
      cells: ["Computer Science", "Math", "Physics", "Chemistry", "Biology"],
    },
  ],
};

const DraggableColumn = ({ column, index, moveColumn }) => {
  const [, drag] = useDrag({
    type: "COLUMN",
    item: { index, type: "COLUMN" },
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      className="border p-2 bg-gray-100 cursor-move"
    >
      {column}
    </th>
  );
};

const DraggableCell = ({ cell, rowIndex, cellIndex, moveCell }) => {
  const [, drag] = useDrag({
    type: "CELL",
    item: { rowIndex, cellIndex, type: "CELL" },
  });

  const [, drop] = useDrop({
    accept: "CELL",
    hover: (draggedItem) => {
      if (
        draggedItem.rowIndex === rowIndex &&
        draggedItem.cellIndex !== cellIndex
      ) {
        moveCell(rowIndex, draggedItem.cellIndex, cellIndex);
        draggedItem.cellIndex = cellIndex;
      }
    },
  });

  return (
    <td
      ref={(node) => drag(drop(node))}
      className="border p-2 bg-white cursor-move"
    >
      {cell}
    </td>
  );
};

const Timetable = () => {
  const [data, setData] = useState(initialData);

  const moveColumn = useCallback((fromIndex, toIndex) => {
    setData((prevData) => {
      const newColumns = [...prevData.columns];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);

      const newRows = prevData.rows.map((row) => {
        const newCells = [...row.cells];
        const [movedCell] = newCells.splice(fromIndex, 1);
        newCells.splice(toIndex, 0, movedCell);
        return { ...row, cells: newCells };
      });

      return { ...prevData, columns: newColumns, rows: newRows };
    });
  }, []);

  const moveCell = useCallback((rowIndex, fromIndex, toIndex) => {
    setData((prevData) => {
      const newRows = [...prevData.rows];
      const newCells = [...newRows[rowIndex].cells];
      const [movedCell] = newCells.splice(fromIndex, 1);
      newCells.splice(toIndex, 0, movedCell);
      newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
      return { ...prevData, rows: newRows };
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200">Time</th>
            {data.columns.map((column, index) => (
              <DraggableColumn
                key={column}
                column={column}
                index={index}
                moveColumn={moveColumn}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="border p-2 bg-gray-200">{row.time}</td>
              {row.cells.map((cell, cellIndex) => (
                <DraggableCell
                  key={`${row.id}-${cellIndex}`}
                  cell={cell}
                  rowIndex={rowIndex}
                  cellIndex={cellIndex}
                  moveCell={moveCell}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DndProvider>
  );
};

const TimetablePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Draggable Timetable</h1>
      <Timetable />
    </div>
  );
};

export default TimetablePage;
