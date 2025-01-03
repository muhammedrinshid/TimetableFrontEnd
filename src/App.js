import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { AuthProvider } from "./context/Authcontext";
import PrivateRoute from "./utlts/PrivateRoute";
import TeachersInSchool from "./pages/Main/TeachersInSchool";
import DayPlanner from "./pages/Main/DayPlanner";
import ClassesInSchool from "./pages/Main/ClassesInSchool";
import SavedTimeTables from "./pages/Main/YourtimeTables";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserConfiguration from "./pages/Main/UserConfiguration";
import SchoolProfileDashboard from "./pages/Main/SchoolProfileDashboard";
import DirectivesConfiguration from "./pages/Main/DirectivesConfiguration";
import BuildSchedule from "./pages/Main/BuildSchedule";
import { mainBg02 } from "./assets/images";
import EditTimetable from "./pages/Main/EditTimetable";
import { ThemeProvider } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import ScheduleAnalytics from "./pages/Main/ScheduleAnalytics";
import WorkloadAndLeaveAnalysis from "./pages/Main/WorkloadAndLeaveAnalysis";
import ElectiveGroupManager from "./pages/Main/ElectiveGroupManager";
function App() {
  return (
    <div className="w-full min-h-screen dark:bg-light-background bg-[#F8F7FC] flex items-center justify-center font-Roboto max-h-screen">

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        icon={true}
        limit={3}
        transition={Flip}
        // Added custom styling
        className="!w-80" // Sets a fixed width
        toastClassName="!rounded-lg !text-sm !p-3" // Styles each toast
        bodyClassName="!text-sm !font-normal" // Styles the toast text
        style={{
          '--toastify-toast-min-height': '48px',
          '--toastify-toast-max-height': 'auto',
        }}
      />
      <div
        className="w-full h-screen max-h-screen 3xl:max-w-8xl  3xl:max-h-128 3xl:rounded-xl shadow-custom-2 overflow-hidden  relative"
        style={{
          backgroundImage: `url(${mainBg02})`,
        }}
      >
        <div className="absolute inset-0 bg-light-background1 dark:bg-dark-border dark:bg-opacity-80 bg-opacity-95 z-0 max-h-screen h-screen 3xl:h-128 3xl:max-h-128 w-full"></div>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Main />}>
                  <Route index element={<ScheduleAnalytics />} />
                  <Route path="teachers" element={<TeachersInSchool />} />
                  <Route path="classes" element={<ClassesInSchool />} />
                  <Route
                    path="saved-timetables"
                    element={<SavedTimeTables />}
                  />
                  <Route
                    path="user-configurations"
                    element={<UserConfiguration />}
                  />
                  <Route
                    path="user-profile"
                    element={<SchoolProfileDashboard />}
                  />
                  <Route
                    path="day-planner"
                    element={<DayPlanner />}
                  />
                  <Route
                    path="directives-configuration"
                    element={<DirectivesConfiguration />}
                  />
                  <Route path="build-schedule" element={<BuildSchedule />} />
                  <Route
                    path="edit-timetable/:viewType/:id"
                    element={<EditTimetable />}
                  />{" "}
                  <Route
                    path="edit-timetable/:viewType"
                    element={<EditTimetable />}
                  />{" "}
                  <Route
                    path="workload-leave-analysis"
                    element={<WorkloadAndLeaveAnalysis />}
                  />{" "}
                  <Route
                    path="elective-group-manager"
                    element={<ElectiveGroupManager />}
                  />{" "}
                  <Route path="edit-timetable"
                    element={<EditTimetable       />}
                  />{" "}
                </Route>
              </Route>
              <Route path="login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>{" "}
      </div>
    </div>
  );
}

export default App;
