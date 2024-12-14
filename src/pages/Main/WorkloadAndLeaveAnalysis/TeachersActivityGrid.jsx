import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Avatar,
  Box,
  Typography,
  MenuItem,
  TextField,
  styled,
  FormControl,
  IconButton,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context/Authcontext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { makeStyles } from "@mui/styles";
import Select from "@mui/material/Select";
import { RefreshCwIcon } from "lucide-react";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const useStyles = makeStyles({
  select: {
    height: 24,
    width: "100%",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
});

const TeachersActivityGrid = ({
  teachersLeaveAndOverloads,
  setSelectedDate,
  selectedDate,
  handleRefresh,
  setSelectedTeacher
}) => {
  const { academicYearEnd, academicYearStart, apiDomain } = useAuth();
  const StyledTextField = styled(TextField)({
    "& .MuiInputBase-root": {
      padding: "8px 12px",
      borderRadius: "8px",
    },
    "& .MuiInputBase-input": {
      padding: "0px",
    },
  });

  const [selectedDateRangeOption, setSelectedDateRangeOption] =
    useState("academic_year");

  const handleDateChange = (newDate, type = "startDate") => {
    if (type === "startDate") {
      setSelectedDate((prev) => ({ ...prev, startDate: newDate }));
    } else {
      setSelectedDate((prev) => ({ ...prev, endDate: newDate }));
    }
  };

  const dateRangeOptions = [
    { value: "last_month", label: "Last Month" },
    { value: "last_week", label: "Last Week" },
    { value: "custom", label: "Custom" },
  ];

  const handleChangeDateRange = (newValue) => {
    let startDate = null;
    let endDate = null;

    const currentDate = new Date();

    switch (newValue) {
      case "academic_year":
        if (academicYearStart && academicYearEnd) {
          startDate = academicYearStart;
          endDate = academicYearEnd;
        } else {
          const start = new Date();
          start.setMonth(currentDate.getMonth() - 6);
          startDate = formatDate(start);

          const end = new Date();
          end.setMonth(currentDate.getMonth() + 6);
          endDate = formatDate(end);
        }
        break;

      case "last_month":
        const lastMonth = new Date();
        lastMonth.setMonth(currentDate.getMonth() - 1);
        const firstDayLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const lastDayLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth() + 1,
          0
        );
        startDate = formatDate(firstDayLastMonth);
        endDate = formatDate(lastDayLastMonth);
        break;

      case "last_week":
        const lastWeek = new Date();
        lastWeek.setDate(currentDate.getDate() - 7);
        const startOfLastWeek = new Date(
          lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay())
        );
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        startDate = formatDate(startOfLastWeek);
        endDate = formatDate(endOfLastWeek);
        break;

      case "custom":
        startDate = null;
        endDate = null;
        break;

      default:
        break;
    }
    setSelectedDate({ startDate, endDate });
    setSelectedDateRangeOption(newValue);
  };

  const classes = useStyles();

  const columns = useMemo(
    () => [
      {
        accessorKey: "teacher.full_name",
        header: "Teacher",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={
                row.original?.teacher?.profile_image &&
                `${apiDomain}${row.original.teacher.profile_image}`
              }
              alt={row.original.teacher.full_name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography>{row.original.teacher.full_name}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: "teacher.teacher_id",
        header: "Teacher ID",
      },
      {
        accessorKey: "leaves_count",
        header: "Leaves Count",
        type: "number",
      },
      {
        accessorKey: "extra_loads_count",
        header: "Extra Loads Count",
        type: "number",
      },
      {
        accessorKey: "leave_days_count",
        header: "Leave Days",
        type: "number",
      },
      {
        accessorKey: "extra_load_days_count",
        header: "Extra Load Days",
        type: "number",
      },
    ],
    [apiDomain]
  );

  const table = useMaterialReactTable({
    columns,
    data: teachersLeaveAndOverloads,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableRowSelection: true,
    enableRowActions: true,
    positionActionsColumn: "first",

    // Simplified layout configuration
    layoutMode: "grid-layout",
    enableStickyHeader: true,
    enableStickyFooter: true,

    // Simple full height configuration
    muiTableContainerProps: {
      sx: {
        height: "100%",
        maxHeight: "100%",
        overflow: "auto",
      },
    },

    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? "#ecf3fa" : "white",
      },
    }),
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key="view"
        onClick={() => {
            setSelectedTeacher(row.original);
            console.log(row.original)
          closeMenu();
        }}
      >
        <VisibilityIcon sx={{ mr: 1 }} /> View
      </MenuItem>,
      <MenuItem
        key="edit"
        onClick={() => {
          console.log("Edit:", row.original);
          closeMenu();
        }}
      >
        <EditIcon sx={{ mr: 1 }} /> Edit
      </MenuItem>,
      <MenuItem
        key="delete"
        onClick={() => {
          console.log("Delete:", row.original);
          closeMenu();
        }}
      >
        <DeleteIcon sx={{ mr: 1 }} /> Delete
      </MenuItem>,
    ],
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            value={selectedDate.startDate}
            disabled={!(selectedDateRangeOption == "custom")}
            onChange={(newDate) => handleDateChange(newDate, "startDate")}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  className: "dark:text-dark-text",
                }}
                className="dark:bg-dark-secondary bg-white w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    fontSize: "16px",
                    padding: "4px 8px",
                  },
                  "& .MuiInputBase-input": {
                    paddingX: "8px",
                  },
                }}
              />
            )}
          />

          <DesktopDatePicker
            value={selectedDate.endDate}
            onChange={(newDate) => handleDateChange(newDate, "endDate")}
            disabled={!(selectedDateRangeOption == "custom")}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  className: "dark:text-dark-text",
                }}
                className="dark:bg-dark-secondary bg-white w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    fontSize: "16px",
                    padding: "4px 8px",
                  },
                  "& .MuiInputBase-input": {
                    paddingX: "8px",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>

        <FormControl fullWidth sx={{ m: 1 }}>
          <Select
            value={selectedDateRangeOption}
            onChange={(e) => handleChangeDateRange(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            className={classes.select}
            size="small"
            fullWidth={true}
          >
            <MenuItem value="academic_year">
              <em>Academic Year</em>
            </MenuItem>
            {dateRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={handleRefresh} aria-label="refresh">
          <RefreshCwIcon className="text-light-primary font-bold" />
        </IconButton>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} muiToolbarAlertBannerChipProps={{
    color: 'primary',
  }}
  muiTableHeadCellFilterTextFieldProps={{
    InputProps: {
      sx: {
        '& .css-i4bv87-MuiSvgIcon-root': {
          color: 'primary.main',
          fill:"#312ECB"
        },
      },
    },
  }} />;
};

export default TeachersActivityGrid;
