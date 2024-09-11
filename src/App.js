import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { AuthProvider } from "./context/Authcontext";
import PrivateRoute from "./utlts/PrivateRoute";
import Wrokshop from "./pages/Workshop";
import TeachersInSchool from "./pages/Main/TeachersInSchool";
import Dashboard from "./pages/Main/Dashboard";
import ClassesInSchool from "./pages/Main/ClassesInSchool";
import SavedTimeTables from "./pages/Main/YourtimeTables";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserConfiguration from "./pages/Main/UserConfiguration";
import SchoolProfileDashboard from "./pages/Main/SchoolProfileDashboard";
function App() {
  return (
    <div className="w-full min-h-screen bg-[#F8F7FC] flex items-center justify-center font-Roboto">
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
      <div className="w-full wide:max-w-8xl  h-screen  wide:max-h-128   wide:rounded-md   shadow-custom-2 overflow-clip">
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
                </Route>
              </Route>
              <Route path="login" element={<Login />} />

              <Route path="s" element={<Wrokshop />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>{" "}
      </div>
    </div>
  );
}

export default App;
