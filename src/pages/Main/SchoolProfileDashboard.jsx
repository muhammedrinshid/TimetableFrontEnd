import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ClassIcon from '@mui/icons-material/Class';

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});

const SchoolProfileDashboard = ({ schoolData }) => {
  // This would be replaced with actual data passed as a prop or fetched from an API
  const school = {
    name: "Example High School",
    address: "123 Education St, Learningville, KS 12345",
    email: "contact@examplehigh.edu",
    phone: "(123) 456-7890",
    profileImage: "https://example.com/school-image.jpg",
    studentCount: 1200,
    teacherCount: 80,
    subjectCount: 30,
    lessonsPerWeek: 180,
    periodsPerDay: 8,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    grades: [
      { name: "Elementary", count: 6 },
      { name: "Middle School", count: 3 },
      { name: "High School", count: 4 }
    ],
    standards: [
      { name: "6th", divisions: 4 },
      { name: "7th", divisions: 4 },
      { name: "8th", divisions: 3 },
      { name: "9th", divisions: 3 },
      { name: "10th", divisions: 3 },
      { name: "11th", divisions: 2 },
      { name: "12th", divisions: 2 },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default',  }} overflow={"auto"}>
        <Grid container spacing={3}>
          {/* School Basic Info */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={school.profileImage}
                    sx={{ width: 100, height: 100, mr: 2, border: '3px solid white' }}
                  />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{school.name}</Typography>
                    <Typography variant="body1">{school.address}</Typography>
                    <Typography variant="body2">{school.email} | {school.phone}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Students
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{school.studentCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Teachers
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{school.teacherCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: 'secondary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <BookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Subjects
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{school.subjectCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Academic Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>Academic Information</Typography>
                <Typography><strong>Lessons per Week:</strong> {school.lessonsPerWeek}</Typography>
                <Typography><strong>Periods per Day:</strong> {school.periodsPerDay}</Typography>
                <Typography><strong>Working Days:</strong> {school.workingDays.join(', ')}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Grades and Standards */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>Grades and Standards</Typography>
                {school?.grades?.map((grade, index) => (
                  <Typography key={index}>
                    <strong>{grade.name}:</strong> {grade.count} years
                  </Typography>
                ))}
                <Box sx={{ height: '1px', backgroundColor: 'grey.300', my: 1 }} />
                {school?.standards?.map((standard, index) => (
                  <Typography key={index}>
                    <strong>{standard.name} Grade:</strong> {standard.divisions} divisions
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default SchoolProfileDashboard;