import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import { useAuth } from '../../../context/Authcontext';
import DeleteConfirmationPopup from '../../common/DeleteConfirmationPopup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaLayerGroup } from 'react-icons/fa6';

const SubjectCard = ({ subject, refresh, selectedClassforView, onAddGroup, onEdit }) => {
  const { apiDomain, headers } = useAuth();
  const [isDeleteClassSubjectForm, setIsDeleteClassSubjectForm] = useState(null);

  const handleConfirmClassrSubjectDelete = async () => {
    if (isDeleteClassSubjectForm) {
      try {
        const response = await axios.delete(
          `${apiDomain}/api/class-room/class-subject/${isDeleteClassSubjectForm}`,
          {
            headers: headers,
          }
        );
        toast.success("Successfully deleted");
        setIsDeleteClassSubjectForm(null);
        refresh();
      } catch (error) {
        console.error("There was an error deleting the Standard:", error);
        toast.error("Error occurred");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-2 overflow-hidden "
    >
      <div className="flex">
        <div className="w-3 bg-gradient-to-b from-blue-500 to-purple-600"></div>
        <div className="flex-grow p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                {subject.name}
                {subject.multi_block_lessons > 1 && (
                  <span className="flex items-center text-slate-500 ml-2 text-sm">
                    <FaLayerGroup className="mr-1" size={16} />x
                    {subject.multi_block_lessons}{" "}
                    {/* Multiplication symbol and block count */}
                  </span>
                )}
              </h3>{" "}
              <div className="flex items-center text-sm text-gray-600">
                <BookIcon fontSize="small" className="mr-1" />
                <span>{subject.lessons_per_week} lessons/week</span>
                <Chip
                  label={subject.is_elective ? "Elective" : "Core"}
                  size="small"
                  color={subject.is_elective ? "secondary" : "primary"}
                  className="ml-2"
                />
              </div>
            </div>
            <div className="flex">
              <IconButton
                size="small"
                onClick={() => onEdit(subject)}
                className="mr-1"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsDeleteClassSubjectForm(subject?.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          {!subject.is_elective && (
            <div className="mt-3">
              <div className="flex flex-wrap mb-2">
                {subject?.teacher?.map((teacher, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center mr-3 mb-2"
                  >
                    <Avatar
                      src={`${apiDomain}${teacher.image}`}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: "0.8rem",
                        bgcolor: "secondary.main",
                        marginRight: "8px",
                      }}
                    />
                    <span className="text-sm font-medium">{teacher.name}</span>
                  </motion.div>
                ))}
              </div>
              {subject.special_rooms && subject.special_rooms.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-600">
                    Special Rooms:
                  </span>
                  <div className="flex flex-wrap">
                    {subject?.special_rooms?.map((room, roomIndex) => (
                      <span
                        key={roomIndex}
                        className="text-xs bg-gray-200 rounded px-2 py-1 mr-2 mt-1"
                      >
                        {room.name} ({room.room_number})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {subject.is_elective && subject.options && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                {subject.elective_group ? (
                  <div className="flex items-center">
                    <GroupIcon
                      fontSize="small"
                      className="mr-2 text-purple-500"
                    />
                    <span className="text-sm font-medium text-purple-600">
                      {subject.elective_group.name}
                    </span>
                    <IconButton
                      size="small"
                      onClick={() =>
                        onAddGroup({
                          standardId: selectedClassforView.standard_id,
                          classroomId: selectedClassforView.id,
                          electiveSubjectId: subject?.id,
                          currenGrpId: subject?.elective_group?.id || null,
                        })
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </div>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() =>
                      onAddGroup({
                        standardId: selectedClassforView.standard_id,
                        classroomId: selectedClassforView.id,
                        electiveSubjectId: subject?.id,
                      })
                    }
                    className="bg-purple-100 hover:bg-purple-200 text-purple-600"
                  >
                    <AddIcon fontSize="small" className="mr-1" /> Add New Group
                  </IconButton>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {subject?.options?.map((option, optionIndex) => (
                  <motion.div
                    key={optionIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: optionIndex * 0.1 }}
                    className="bg-gray-50 p-3 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">
                        {option.subject.name}
                      </span>
                      <Chip
                        icon={<GroupIcon fontSize="small" />}
                        label={`${option.number_of_students} students`}
                        size="small"
                        className="bg-blue-100 text-blue-600"
                      />
                    </div>
                    <div className="flex flex-wrap mb-2">
                      {option?.allotted_teachers?.map(
                        (teacher, teacherIndex) => (
                          <motion.div
                            key={teacherIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: teacherIndex * 0.05 }}
                            className="flex items-center mr-3 mb-1"
                          >
                            <Avatar
                              src={`${apiDomain}${teacher.image}`}
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: "0.7rem",
                                bgcolor: "secondary.main",
                                marginRight: "4px",
                              }}
                            />
                            <span className="text-xs font-medium">
                              {teacher.name}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                    {option.preferred_rooms &&
                      option.preferred_rooms.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-600">
                            Preferred Rooms:
                          </span>
                          <div className="flex flex-wrap">
                            {option.preferred_rooms.map((room, roomIndex) => (
                              <span
                                key={roomIndex}
                                className="text-xs bg-gray-200 rounded px-2 py-1 mr-2 mt-1"
                              >
                                {room.name} ({room.room_number})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeleteClassSubjectForm}
        onClose={() => setIsDeleteClassSubjectForm(false)}
        onConfirm={handleConfirmClassrSubjectDelete}
      />
    </motion.div>
  );
};

export default SubjectCard;