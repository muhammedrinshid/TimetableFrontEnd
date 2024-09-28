import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/Authcontext";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaArrowRightLong, FaEye, FaEyeSlash, FaInfinity } from "react-icons/fa6";
import { BackgroundIcons } from "../components/common";
import logo2 from '../assets/images/identities/logo 2.png'


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(1, "Password must be at least 6 characters"),
});

const signupSchema = yup.object().shape({
  schoolName: yup.string().required("School name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const AuthForm = () => {
  const navigate = useNavigate();
  const { apiDomain, setAuthTocken, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onLoginSubmit = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${apiDomain}/api/token/`, {
        email: data.email,
        password: data.password,
      });

      if (res.status === 200) {
          console.log("success full");
        setAuthTocken(() => res.data);
        setUser(() => jwtDecode(res.data?.access));
        localStorage.setItem("authTokens", JSON.stringify(res.data));
        navigate("/");
        
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = (data) => {
    // Placeholder for signup functionality
    console.log("Signup data:", data);
    // Implement signup logic here
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#3949ab] to-[#5c6bc0] p-5 relative overflow-hidden">
      <BackgroundIcons />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8 ">
          <div className="w-full flex justify-center items-center my-2">
            {" "}
            <img src={logo2} width={120}></img>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center text-gray-800"
          >
            {isLogin ? "Welcome Back!" : "Create Account"}
          </motion.h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <form
                  onSubmit={handleLoginSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="loginEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="loginEmail"
                      {...loginRegister("email")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949ab]"
                    />
                    {loginErrors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="loginPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="loginPassword"
                        {...loginRegister("password")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949ab]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-500" />
                        ) : (
                          <FaEye className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white py-2 px-4 rounded-md hover:from-[#3949ab] hover:to-[#5c6bc0] transition duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                    ) : (
                      <>
                        Login <FaArrowRightLong className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 30, rotate: 5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -30, rotate: -5 }}
                transition={{ duration: 0.5 }}
              >
                <form
                  onSubmit={handleSignupSubmit(onSignupSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="schoolName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      School Name
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      {...signupRegister("schoolName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949ab]"
                    />
                    {signupErrors.schoolName && (
                      <p className="mt-1 text-xs text-red-500">
                        {signupErrors.schoolName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="signupEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="signupEmail"
                      {...signupRegister("email")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949ab]"
                    />
                    {signupErrors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {signupErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="signupPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="signupPassword"
                        {...signupRegister("password")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949ab]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-500" />
                        ) : (
                          <FaEye className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {signupErrors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {signupErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      {...signupRegister("confirmPassword")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949ab]"
                    />
                    {signupErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {signupErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white py-2 px-4 rounded-md hover:from-[#3949ab] hover:to-[#5c6bc0] transition duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up <FaArrowRightLong className="ml-2" />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <motion.button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[#3949ab] hover:underline font-medium focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </motion.button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
