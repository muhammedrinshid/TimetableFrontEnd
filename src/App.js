import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { AuthProvider } from "./context/Authcontext";
import PrivateRoute from "./utlts/PrivateRoute";
import TeachersInSchool from "./pages/Main/TeachersInSchool";
import Dashboard from "./pages/Main/Dashboard";
import ClassesInSchool from "./pages/Main/ClassesInSchool";
import SavedTimeTables from "./pages/Main/YourtimeTables";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserConfiguration from "./pages/Main/UserConfiguration";
import SchoolProfileDashboard from "./pages/Main/SchoolProfileDashboard";
import DirectivesConfiguration from "./pages/Main/DirectivesConfiguration";
import BuildSchedule from "./pages/Main/BuildSchedule";
import { mainBg02 } from "./assets/images";
import TimetablePage from "./pages/Main/EditTableSample";
import EditTimetable from "./pages/Main/EditTimetable";
import { ThemeProvider } from "@mui/material";
function App() {
  return (
      <div className="w-full min-h-screen dark:bg-light-background bg-[#F8F7FC] flex items-center justify-center font-Roboto">
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
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
        />
        <div
          className="w-full 3xl:max-w-8xl  h-screen  3xl:max-h-128   3xl:rounded-md   shadow-custom-2 overflow-clip relative"
          style={{
            backgroundImage: `url(${mainBg02})`,
          }}
        >
          <div className="absolute inset-0 bg-light-background1 dark:bg-dark-border dark:bg-opacity-80 bg-opacity-95 z-0"></div>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Main />}>
                    <Route index element={<Dashboard />} />
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
                    <Route path="edit-timetable" element={<EditTimetable />} />{" "}
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
