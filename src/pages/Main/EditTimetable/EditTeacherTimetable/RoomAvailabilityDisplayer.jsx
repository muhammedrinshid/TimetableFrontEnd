import React, { useState, useEffect } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";

const RoomAvailabilityDisplayer = ({
  availableRooms,
  teacherWeekTimetable,
  selectedDay,
  selectedSessionForRoomNumber,
  roomChangeDialogOpen,
  setRoomChangeDialogOpen,
}) => {
  const [freeRooms, setFreeRooms] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);

  useEffect(() => {
    const updateRoomAvailability = () => {
      const free = [];
      const occupied = [];

      availableRooms.forEach((room) => {
        const isOccupied = teacherWeekTimetable[selectedDay]?.some(
          (instructor) =>
            instructor.sessions[selectedSessionForRoomNumber]?.some(
              (session) =>
                session.room && session.room.room_number === room.room_number
            )
        );

        if (isOccupied) {
          occupied.push(room);
        } else {
          free.push(room);
        }
      });

      setFreeRooms(free);
      setOccupiedRooms(occupied);
    };

    updateRoomAvailability();
  }, [
    availableRooms,
    teacherWeekTimetable,
    selectedDay,
    selectedSessionForRoomNumber,
  ]);

const handleAddRoom = (roomId) => {
  const selectedRoom = availableRooms.find((room) => room.id === roomId);

  setRoomChangeDialogOpen((prev)=>{


    return {
      ...prev,
      toRoom: {
        room: selectedRoom,
      },
      type: "ADD",
    };
  });

};

const handleSwapRoom = (roomId) => {
  // We already know sessionGrpIdx from 'from' prop
  let toTeacherId = null;
  let toSessionIndex = null;
  let foundRoom =    availableRooms.find((room) => room.id === roomId);

  // Only iterate through teachers and their sessions at the known sessionGrpIdx
  teacherWeekTimetable[selectedDay]?.forEach((teacher, teacherIdx) => {
    const sessionGrp =
      teacher.sessions[selectedSessionForRoomNumber]

    if (sessionGrp) {

      sessionGrp.forEach((session, sessionIdx) => {

        if (session.room && session.room.id === roomId) {
          toTeacherId = teacher.instructor.id;
          toSessionIndex = sessionIdx;
        }
      });
    }
  });

  if (toTeacherId != null) {
    setRoomChangeDialogOpen((prev) => ({
      ...prev,
      toRoom: {
        teacherId: toTeacherId,
        sessionGrpIdx: prev?.fromRoom?.sessionGrpIdx, // Use the same sessionGrpIdx
        sessionIndex: toSessionIndex,
        room: foundRoom,
      },
      type: "SWAP",
    }));
  } else {
    console.error("Room not found in timetable");
  }

};


  const RoomCard = ({ room, isFree }) => (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md duration-200">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full ${
              isFree ? "bg-emerald-500" : "bg-orange-500"
            }`}
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {room.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Room {room.room_number}
            </p>
          </div>
        </div>

        {isFree && roomChangeDialogOpen.isOpen ? (
          <button
            onClick={() => handleAddRoom(room.id)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : (
          roomChangeDialogOpen.isOpen &&
          !isFree && (
            <button
              onClick={() => handleSwapRoom(room.id)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-custom-4 dark:bg-gray-900 p-4 rounded-lg overflow-y-auto h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          Room Availability For {selectedSessionForRoomNumber + 1}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Rooms
            </h3>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {freeRooms.length} rooms
            </span>
          </div>
          <div className="grid gap-2">
            {freeRooms.map((room) => (
              <RoomCard key={room.id} room={room} isFree={true} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Occupied Rooms
            </h3>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {occupiedRooms.length} rooms
            </span>
          </div>
          <div className="grid gap-2">
            {occupiedRooms.map((room) => (
              <RoomCard key={room.id} room={room} isFree={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityDisplayer;
