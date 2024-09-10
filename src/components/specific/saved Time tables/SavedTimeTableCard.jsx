import React, { useState } from 'react';
import { Edit, Delete, Star, AccessTime, CheckCircle, Error } from '@mui/icons-material';
import { Alert, AlertTitle, Tooltip } from '@mui/material';

const SavedTimeTableCard = ({ table, onSubmitEdit, setDeleteTimeTableDialogOpen, handleSetDefault, isLoadingDefault }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(table.name);

  const handleEdit = () => {
    if (isEditing) {
      onSubmitEdit(table.id, editedName);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 70) return '⭐';
    return '❗';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg font-semibold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 transition-colors duration-300"
              autoFocus
            />
          ) : (
            <h2 className="text-lg font-semibold truncate">{table.name}</h2>
          )}
          <div className="flex space-x-1">
            <Tooltip title="Edit">
              <button
                onClick={handleEdit}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                <Edit fontSize="small" className="text-gray-600" />
              </button>
            </Tooltip>
            <Tooltip title="Delete">
              <button
                onClick={() => setDeleteTimeTableDialogOpen(table.id)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                <Delete fontSize="small" className="text-gray-600" />
              </button>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <AccessTime fontSize="small" className="mr-1" />
          <span>{new Date(table.created).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <Tooltip title={`Score: ${table.score}`}>
            <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${getScoreColor(table.score)}`}>
              {getScoreIcon(table.score)} {table.score}
            </span>
          </Tooltip>
          <Tooltip title={table.feasible ? 'Feasible' : 'Not Feasible'}>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${table.feasible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {table.feasible ? <CheckCircle fontSize="small" /> : <Error fontSize="small" />}
            </span>
          </Tooltip>
          <Tooltip title={table.optimal ? 'Optimal' : 'Not Optimal'}>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${table.optimal ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {table.optimal ? <CheckCircle fontSize="small" /> : <Error fontSize="small" />}
            </span>
          </Tooltip>
        </div>

        <button
          onClick={() => handleSetDefault(table.id)}
          disabled={isLoadingDefault}
          className={`flex items-center justify-center w-full px-3 py-1 rounded-md text-xs font-medium transition-colors duration-300 ${
            table.is_default
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
          }`}
        >
          {isLoadingDefault ? (
            <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          ) : (
            <>
              <Star fontSize="small" className={`mr-1 ${table.is_default ? 'text-yellow-300' : ''}`} />
              {table.is_default ? 'Default' : 'Set as Default'}
            </>
          )}
        </button>
      </div>
      {table.score < 70 && (
        <Alert severity="warning" className="py-1 px-2">
          <AlertTitle className="text-xs font-semibold">Low Score</AlertTitle>
          <p className="text-xs">Consider optimizing this timetable.</p>
        </Alert>
      )}
    </div>
  );
};

export default SavedTimeTableCard;