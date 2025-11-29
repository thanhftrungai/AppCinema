import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaUser } from "react-icons/fa"; // Đã xóa FaPhone
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/images/logo.png";
import googleIcon from "../../assets/images/google-icon.png";
import wallpaper from "../../assets/images/wallpaper.png";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  const navigate = useNavigate();

  // 1. State lưu dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hàm cập nhật dữ liệu khi gõ phím
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Hàm xử lý Đăng ký
  const handleRegister = async () => {
    setError("");
    setSuccessMsg(""); // Reset thông báo cũ

    // Validate cơ bản
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending data:", formData);

      // Gọi API qua Proxy (/cinema...)
      const response = await fetch("/cinema/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      // 3. Kiểm tra kết quả (Code 1000 là thành công theo hình Postman)
      if (data.code === 1000) {
        // ✅ THAY ĐỔI Ở ĐÂY:
        // 1. Hiện thông báo màu xanh
        setSuccessMsg("Registration successful! Redirecting to login...");

        // 2. Tự động chuyển trang sau 1.5 giây
        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Hiển thị lỗi (Màu đỏ) */}
          {error && (
              <div className="w-full bg-red-500/20 border border-red-500 text-red-200 text-xs md:text-sm p-2 rounded text-center">
                {error}
              </div>
          )}

          {/* ✅ THÊM ĐOẠN NÀY: Hiển thị thành công (Màu xanh) */}
          {successMsg && (
              <div className="w-full bg-green-500/20 border border-green-500 text-green-200 text-xs md:text-sm p-2 rounded text-center">
                {successMsg}
              </div>
          )}

          <div className="w-full flex flex-col gap-3 mt-2">
            {/* USERNAME INPUT */}
            <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl border border-white/10 focus-within:border-rose-500 transition">
              <FaUser />
              <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
                  value={formData.username}
                  onChange={handleChange}
              />
            </div>

            {/* EMAIL INPUT */}
            <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl border border-white/10 focus-within:border-rose-500 transition">
              <MdAlternateEmail />
              <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
                  value={formData.email}
                  onChange={handleChange}
              />
            </div>

            {/* ĐÃ XÓA SỐ ĐIỆN THOẠI Ở ĐÂY */}

            {/* PASSWORD INPUT */}
            <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl relative border border-white/10 focus-within:border-rose-500 transition">
              <FaFingerprint />
              <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* CONFIRM PASSWORD INPUT */}
            <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl relative border border-white/10 focus-within:border-rose-500 transition">
              <FaFingerprint />
              <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
                  value={formData.confirmPassword}
                  onChange={handleChange}
              />
            </div>

            {/* TERMS CHECKBOX */}
            <div className="flex items-center gap-2 text-xs text-gray-300 select-none cursor-pointer">
              <input
                  id="terms"
                  type="checkbox"
                  className="accent-rose-500 cursor-pointer"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the <span className="underline">Terms</span> and{" "}
                <span className="underline">Privacy Policy</span>
              </label>
            </div>
          </div>

          {/* BUTTON REGISTER */}
          <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`w-full p-3 rounded-xl mt-3 text-sm md:text-base font-semibold shadow-lg shadow-rose-900/30 transition-all
            ${isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              }`}
          >
            {isLoading ? "Creating Account..." : "Register"}
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