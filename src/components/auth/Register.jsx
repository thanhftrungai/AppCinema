import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaUser, FaPhone } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/images/logo.png";
import googleIcon from "../../assets/images/google-icon.png";
import wallpaper from "../../assets/images/wallpaper.png";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center text-white p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17,24,39,0.85), rgba(17,24,39,0.95)), url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full" />

      <div className="w-[92%] max-w-md p-6 md:p-8 bg-gray-900/70 backdrop-blur-xl flex-col flex items-center gap-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-12 md:w-14" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">
              Create Account
            </h1>
            <p className="text-xs md:text-sm text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl border border-white/10 focus-within:border-rose-500 transition">
            <FaUser />
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl border border-white/10 focus-within:border-rose-500 transition">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl border border-white/10 focus-within:border-rose-500 transition">
            <FaPhone />
            <input
              type="tel"
              placeholder="Phone number"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl relative border border-white/10 focus-within:border-rose-500 transition">
            <FaFingerprint />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-4 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl relative border border-white/10 focus-within:border-rose-500 transition">
            <FaFingerprint />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-4 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-300 select-none">
            <input id="terms" type="checkbox" className="accent-rose-500" />
            <label htmlFor="terms">
              I agree to the <span className="underline">Terms</span> and{" "}
              <span className="underline">Privacy Policy</span>
            </label>
          </div>
        </div>

        <button className="w-full p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl mt-3 hover:from-rose-600 hover:to-pink-700 text-sm md:text-base font-semibold shadow-lg shadow-rose-900/30">
          Register
        </button>

        <div className="relative w-full flex items-center justify-center py-3">
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
          <h3 className="font-lora text-xs md:text-sm px-4 text-gray-300">
            OR
          </h3>
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
        </div>

        <div className="w-full flex items-center justify-evenly md:justify-between gap-2">
          <div className="p-2 md:px-6 lg:px-10 bg-slate-700/70 cursor-pointer rounded-xl hover:bg-slate-700 border border-white/10">
            <BsApple className="text-lg md:text-xl" />
          </div>
          <div className="p-1 md:px-6 lg:px-10 bg-slate-700/70 cursor-pointer rounded-xl hover:bg-slate-700 border border-white/10">
            <img src={googleIcon} alt="google-icon" className="w-6 md:w-8" />
          </div>
          <div className="p-2 md:px-6 lg:px-10 bg-slate-700/70 cursor-pointer rounded-xl hover:bg-slate-700 border border-white/10">
            <FaXTwitter className="text-lg md:text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
