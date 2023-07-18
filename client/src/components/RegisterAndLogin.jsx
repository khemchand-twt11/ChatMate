import axios from "axios";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  FaLock,
  FaCheck,
  FaEnvelope,
  FaUser,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { UserContext } from "../UserContext";

export default function RegistrationComponent() {
  // STATES
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // New state for login mode
  // CONTEXT
  const { username, setUserName, id, setId } = useContext(UserContext);

  // FUNCTIONS

  // Password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "/user/login" : "user/register";
    if (isLogin) {
      try {
        const response = await axios.post(url, {
          email: userInfo.email,
          password: userInfo.password,
        });

        if (response.status >= 200 && response.status < 300) {
          toast.success("User login successful!");
          setUserName(response.data.username);
          setId(response.data.id);
          console.log(id, username);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("Invalid credentials");
        } else {
          toast.error("Login failed. Please try again.");
        }
        console.log(error);
      }
    } else {
      if (userInfo.password !== userInfo.confirmPassword) {
        toast.error("password do not match.");
      } else {
        try {
          const { confirmPassword, ...userData } = userInfo;
          console.log(userData, confirmPassword);
          const response = await axios.post(url, userData);
          // console.log(response);
          if (response.status >= 200 && response.status < 300) {
            toast.success("User registered successfully!");
            setUserName(userInfo.username);
            setId(response.data.id);
            console.log(id, username);
          } else {
            toast.error("Registration failed. Please try again.");
          }
          // console.log(id, username);
        } catch (error) {
          if (error.response.status == 409)
            toast.error(error.response.data.msg);
          // console.log(error);
          // console.log(error.status, error.response.data.msg);
        }
      }
    }
  };

  // Toggle between login and registration modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUserInfo({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="h-screen w-full flex items-center text-clr-200">
      <Toaster position="top-center" reverseOrder={false} />
      <form className="mx-auto p-4 w-96" onSubmit={handleSubmit}>
        {/* Username input (only in registration mode) */}
        {!isLogin && (
          <div className="flex items-center rounded-md border-2 p-1 mb-2">
            <span className="block mr-1">
              <FaUser size={18} className="ml-1 mr-1 text-current" />
            </span>
            <input
              type="text"
              placeholder="Username"
              className="block w-full p-2 outline-none text-lg box-border h-full"
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              name="username"
              value={userInfo.username}
            />
          </div>
        )}

        {/* Email input */}
        <div className="flex items-center rounded-md border-2 p-1 mb-2">
          <span className="block mr-1">
            <FaEnvelope size={18} className="ml-1 mr-1 text-current" />
          </span>
          <input
            type="email"
            placeholder="Email"
            className="block w-full p-2 outline-none text-lg box-border h-full"
            name="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
        </div>

        {/* Password input */}
        <div className="flex items-center rounded-md border-2 p-1 mb-2">
          <span className="block mr-1">
            <FaLock size={18} className="ml-1 mr-1" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="block w-full p-2 outline-none text-lg box-border h-ful"
            name="password"
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
          <span
            className="ml-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </span>
        </div>

        {/* Confirm password input */}
        {!isLogin && (
          <div className="flex items-center rounded-md border-2 p-1 mb-2">
            <span className="block mr-1">
              <FaCheck size={18} className="ml-1 mr-1" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="block w-full p-2 outline-none text-lg box-border h-full"
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmPassword: e.target.value })
              }
            />
            <span
              className="ml-2 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </span>
          </div>
        )}

        {/* Submit button */}
        <button className="rounded-md block w-full bg-clr-150 text-white p-2 mt-6 mb-2 text-lg">
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        {/* Toggle between login and registration modes */}
        <div className="text-center mt-4 mb-4">
          {isLogin ? (
            <>
              Don&apos;t have an account?{"  "}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={toggleMode}
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already a member?{" "}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={toggleMode}
              >
                Log in here
              </button>
            </>
          )}
        </div>

        {/* Social login buttons */}
        <div className="mt-4">
          <button className="flex items-center w-full mb-4 justify-center bg-clr-350 text-white rounded-md px-4 py-2">
            <FaGoogle className="mr-2" />
            Sign Up with Google
          </button>
          <button className="flex items-center w-full justify-center bg-blue-900 text-white rounded-md px-4 py-2 ">
            <FaFacebook className="mr-2" />
            Sign Up with Facebook
          </button>
        </div>
      </form>
    </div>
  );
}
