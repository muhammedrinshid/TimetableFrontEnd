import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { AuthProvider } from "./context/Authcontext";
import PrivateRoute from "./utlts/PrivateRoute";
import Wrokshop from "./pages/Workshop";
import TeachersInSchool from "./pages/Main/TeachersInSchool";
import Dashboard from "./pages/Main/Dashboard";
import ClassesInSchool from "./pages/Main/ClassesInSchool";

function App() {
  return (
    <div className="w-full min-h-screen bg-light-background flex items-center justify-center font-Roboto">
      <div className="w-full wide:max-w-8xl  h-screen  wide:max-h-128   rounded-md   shadow-custom-2 overflow-clip bg-slate-50">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Main />}>
                  <Route index element={<Dashboard />} />
                  <Route path="teachers" element={<TeachersInSchool />} />
                  <Route path="classes" element={<ClassesInSchool />} />
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
