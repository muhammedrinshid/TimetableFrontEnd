import React from "react";
import { loginimage, logo } from "../assets/images";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Authcontext";
import { jwtDecode } from "jwt-decode";
import { loginToast } from "../utlts/toasts";

const Login = () => {
  const navigate = useNavigate();


  const {apiDomain,setAuthTocken,setUser}=useAuth()
// In your login component file


let loginUser = async (e) => {
  e.preventDefault();
  

  const toast = loginToast();

  try {
    const res = await axios.post(`${apiDomain}/api/token/`, {
      email: e.target.usermail.value,
      password: e.target.userpassword.value,
    });

    if (res.status === 200) {
      console.log("success full")
      setAuthTocken(() => res.data);
      setUser(() => jwtDecode(res.data?.access));
      localStorage.setItem("authTokens", JSON.stringify(res.data));

      toast.success();
      navigate("/");
    }
  } catch (error) {
    if (error.response) {
      toast.error();
    }
  }
};
  return (
    <div className=" bg-white h-full w-full flex flex-col sm:flex-row   overflow-clip backdrop-blur-xl bg-white/30 ">
      <div class=" bg-white h-1/2 w-full sm:w-1/2 sm:h-full ">
        <div className="flex flex-col items-center w-9/12 mx-auto justify-center h-full  px-12">
          <img src={logo} width={70} className="mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-center">
            Welcome Back !
          </h2>
          <p className="mb-10 text-center text-dark-secondary font-Poppins opacity-60 font-semibold text-xs">
            Please enter your details
          </p>

          {/* sign in form starts here */}
          <form
            className="w-full "
            onSubmit={(e) => {
              loginUser(e);
            }}
          >
            {/* email section */}
            <div className="mb-8 w-full ">
              <label className="input-label1" htmlFor="email">
                Email Address
              </label>
              <input type="email" id="email" className="input-custom1" name="usermail"/>
            </div>

            {/* password secton */}
            <div className="mb-10">
              <label className="input-label1" htmlFor="password">
                Password
              </label>

              <input type="password" id="password" className=" input-custom1" name="userpassword" />
              {/* <p className="text-red-500 text-sm mt-0">incorrct password</p> */}
            </div>

            {/* forgott password  */}
            <div className="flex items-center justify-between mb-4 ">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href="#"
                className="inline-block align-baseline   text-dark-secondary font-Poppins opacity-60 font-semibold text-xs hover:text-light-primary"
              >
                Forgot Password?
              </a>
            </div>

            {/* submitt button section */}
            <button type="submit" className="button-cutom1 mt-8">
              Login <FaArrowRightLong />
            </button>
          </form>
          {/* sign in form end */}

          <p className="m-8 text-text_2 text-center">
            Don't have an account?{" "}
            <span className="text-light-primary text-nowrap font-semibold opacity-60 hover:opacity-100">
              <Link>Sign Up</Link>
            </span>
          </p>
        </div>
      </div>

      {/* application small description */}
      <div class="relative gap-4 flex flex-col justify-center items-center  bg-light-primary opacity-80 h-1/2 w-full sm:w-1/2 sm:h-full p-10 bg-hero  ">
        <p className="text-xs text-text_2 max-w-lg text-center mb-10">
          Simplify and optimize your school's scheduling process with our
          advanced timetable creation tool, powered by the OptaPy constraint
          solver. Our platform is designed to help schools create efficient,
          conflict-free schedules with ease.
        </p>
        <img
          src={loginimage}
          className="  object-contain max-w-xs m-6"
          alt=""
        />

        <h1 className="text-2xl font-extrabold text-white ">
          Unlock the Power of Efficient Scheduling
        </h1>
        <p className="text-text_1 text-base">
          Drive Your Scheduling Efforts into the Fast Lane
        </p>
      </div>
    </div>
  );
};

export default Login;
