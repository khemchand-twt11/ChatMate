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
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //CONTEXT
  const { username, setUserName, id, setId } = useContext(UserContext);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleUserInfo = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo.password !== userInfo.confirmPassword) {
      toast.error("password do not match.");
    } else {
      try {
        const { confirmPassword, ...userData } = userInfo;
        console.log(userData, confirmPassword);
        const { data } = await axios.post("/user/register", userData);
        setUserName(userInfo.username);
        setId(data.id);
        console.log(id, username);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center text-clr-200">
      <Toaster position="top-center" reverseOrder={false} />
      <form className="mx-auto p-4 w-96" onSubmit={handleSubmit}>
        <div className="flex items-center rounded-md border-2 p-1 mb-2 ">
          <span className="block mr-1">
            <FaUser size={18} className="ml-1 mr-1 text-current" />
          </span>
          <input
            type="text"
            placeholder="Username"
            className="block w-full p-2 outline-none text-lg box-border h-full"
            onChange={(e) => handleUserInfo(e)}
            name="username"
            value={userInfo.username}
          />
        </div>

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
            onChange={(e) => handleUserInfo(e)}
          />
        </div>

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
            onChange={(e) => handleUserInfo(e)}
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
            onChange={(e) => handleUserInfo(e)}
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

        <button className="rounded-md block w-full bg-clr-150 text-white p-2 mt-6 mb-2 text-lg">
          Sign Up
        </button>
        <div className="text-center mt-4 mb-4">
          Already a member <a href="">login here</a>
        </div>
        <div className="flex items-center justify-center">
          <hr className="w-1/2 border-t-2" />
          <span className="mx-4">OR</span>
          <hr className="w-1/2 border-t-2" />
        </div>

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
