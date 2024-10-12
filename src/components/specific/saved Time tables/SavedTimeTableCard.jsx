import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Edit,
  Delete,
  Star,
  CheckCircle,
  Warning,
  Error,
  ThumbUp,
  Balance,
  Refresh,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

const SavedTimeTableCard = ({
  table,
  onSubmitEdit,
  setDeleteTimeTableDialogOpen,
  handleSetDefault,
  isLoadingDefault,
}) => {
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
    if (e.key === "Enter") {
      handleEdit();
    }
  };

  const getScoreStatus = (hardScore, softScore) => {
    if (hardScore === 0 && softScore === 0)
      return {
        label: "Perfect",
        icon: <CheckCircle className="text-green-500" />,
        color: "bg-green-100 text-green-800",
      };
    if (hardScore === 0)
      return {
        label: "Feasible",
        icon: <ThumbUp className="text-green-500" />,
        color: "bg-green-100 text-green-800",
      };
    if (hardScore > -3)
      return {
        label: "Near Feasible",
        icon: <Balance className="text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-800",
      };
    return {
      label: "Needs Improvement",
      icon: <Refresh className="text-red-500" />,
      color: "bg-red-100 text-red-800",
    };
  };

  const formatScore = (score) => {
    return score?.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const scoreStatus = getScoreStatus(table.hard_score, table.soft_score);

  const getScoreColor = (score, isHardScore = false) => {
    if (isHardScore) {
      return score === 0 ? "text-green-600" : "text-red-600";
    }
    return score <= 5000
      ? "text-green-600"
      : score <= 10000
      ? "text-yellow-600"
      : "text-red-600";
  };

  return (
    <div
      className={`bg-light-background1 rounded-lg shadow-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl border-2 ${scoreStatus.color
        .split(" ")[0]
        .replace("bg", "border")}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-xl font-bold border-b-2 border-blue-500 outline-none w-full"
              autoFocus
            />
          ) : (
            <h2 className="text-xl font-bold truncate flex-1 mr-2">
              {table.name}
            </h2>
          )}
          <div>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={handleEdit}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => setDeleteTimeTableDialogOpen(table.id)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          {new Date(table.created)?.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs ${scoreStatus.color}`}
          >
            {scoreStatus.icon}
            <span className="ml-1">{scoreStatus.label}</span>
          </div>
          <p className={`text-lg font-bold ${getScoreColor(table.score)}`}>
            Score: {formatScore(table.score)}
          </p>
        </div>

        <hr className="my-4" />

        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">Mandatory Directives</h3>
          <div className="flex items-center">
            <p
              className={`text-lg ${getScoreColor(
                table.hard_score,
                true
              )} mr-1`}
            >
              {table.hard_score}
            </p>
            {table.hard_score === 0 ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <Error className="text-red-500" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">Optional Directives</h3>
          <div className="flex items-center">
            <p className={`text-lg ${getScoreColor(table.soft_score)} mr-1`}>
              {formatScore(table.soft_score)}
            </p>
            {table.soft_score <= 5000 ? (
              <TrendingDown className="text-green-500" />
            ) : table.soft_score <= 10000 ? (
              <TrendingUp className="text-yellow-500" />
            ) : (
              <Warning className="text-red-500" />
            )}
          </div>
        </div>

        <button
          className={`w-full mt-4 py-2 px-4 rounded ${
            table.is_default
              ? "bg-blue-600 text-white"
              : "border border-blue-600 text-blue-600"
          } flex items-center justify-center`}
          onClick={() => handleSetDefault(table.id)}
          disabled={isLoadingDefault}
        >
          <Star className="mr-2" />
          {isLoadingDefault ? (
            <div className="flex items-center">
              <span className="mr-2">Loading</span>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : table.is_default ? (
            "Default"
          ) : (
            "Set as Default"
          )}
        </button>
      </div>
    </div>
  );
};

export default SavedTimeTableCard;
