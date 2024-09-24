import React, { useState } from "react";
import { Edit, Delete, Star, AccessTime } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
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
      return { label: "Perfect", icon: <CheckCircle />, color: "success" };
    if (hardScore === 0)
      return { label: "Feasible", icon: <ThumbUp />, color: "success" };
    if (hardScore > -3)
      return { label: "Near Feasible", icon: <Balance />, color: "warning" };
    return { label: "Needs Improvement", icon: <Refresh />, color: "error" };
  };

  const formatScore = (score) => {
    return score.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const scoreStatus = getScoreStatus(table.hard_score, table.soft_score);

  const getScoreColor = (score, isHardScore = false) => {
    if (isHardScore) {
      return score === 0 ? "success.main" : "error.main";
    }
    // For soft score, lower is better
    return score <= 5000
      ? "success.main"
      : score <= 10000
      ? "warning.main"
      : "error.main";
  };

  return (
    <Card
      elevation={3}
      sx={{
        transition: "all 0.3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
        border: `2px solid ${scoreStatus.color}.main`,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                border: "none",
                borderBottom: "2px solid #3f51b5",
                outline: "none",
                width: "100%",
              }}
              autoFocus
            />
          ) : (
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                mr: 2,
              }}
            >
              {table.name}
            </Typography>
          )}
          <Box>
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
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <AccessTime fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {new Date(table.created).toLocaleDateString()}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Chip
            icon={scoreStatus.icon}
            label={scoreStatus.label}
            color={scoreStatus.color}
            size="small"
          />
          <Typography
            variant="h6"
            fontWeight="bold"
            color={getScoreColor(table.score)}
          >
            Score: {formatScore(table.score)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Mandatory Directives
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              color={getScoreColor(table.hard_score, true)}
              sx={{ mr: 1 }}
            >
              {table.hard_score}
            </Typography>
            {table.hard_score === 0 ? (
              <CheckCircle color="success" />
            ) : (
              <Error color="error" />
            )}
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Optional Directives
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              color={getScoreColor(table.soft_score)}
              sx={{ mr: 1 }}
            >
              {formatScore(table.soft_score)}
            </Typography>
            {table.soft_score <= 5000 ? (
              <TrendingDown color="success" />
            ) : table.soft_score <= 10000 ? (
              <TrendingUp color="warning" />
            ) : (
              <Warning color="error" />
            )}
          </Box>
        </Box>

        <Button
          variant={table.is_default ? "contained" : "outlined"}
          color="primary"
          startIcon={<Star />}
          fullWidth
          onClick={() => handleSetDefault(table.id)}
          disabled={isLoadingDefault}
          sx={{ mt: 2 }}
        >
          {isLoadingDefault ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="button" sx={{ mr: 1 }}>
                Loading
              </Typography>
              <CircularProgress size={16} />
            </Box>
          ) : table.is_default ? (
            "Default"
          ) : (
            "Set as Default"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedTimeTableCard;
