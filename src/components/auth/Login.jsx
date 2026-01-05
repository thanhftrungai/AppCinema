import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/images/logo.png";
import googleIcon from "../../assets/images/google-icon.png";
import wallpaper from "../../assets/images/wallpaper.png";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // State quản lý dữ liệu nhập
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const togglePasswordView = () => setShowPassword(!showPassword);

  // --- HÀM XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);

    try {
      // BƯỚC 1: LẤY TOKEN
      // Dùng đường dẫn tương đối để đi qua Vite Proxy (tránh CORS)
      const response = await fetch("/cinema/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        // --- ĐĂNG NHẬP THÀNH CÔNG ---
        const token = data.result.token;

        // 1. Lưu Token
        localStorage.setItem("token", token);
        localStorage.setItem("authenticated", "true");

        // BƯỚC 2: GỌI API LẤY THÔNG TIN USER
        // 👇 Quan trọng: Dùng "/cinema/..." thay vì "https://..." để khớp với vite.config.js
        try {
          const infoResponse = await fetch("/cinema/users/myInfo", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Gửi kèm Token xác thực
              "Content-Type": "application/json"
            }
          });

          if (infoResponse.ok) {
            const infoData = await infoResponse.json();

            // Lấy object user (xử lý trường hợp API bọc trong .result)
            const userFullInfo = infoData.result || infoData;

            // 2. Lưu thông tin User vào LocalStorage
            // Trang Booking.jsx sẽ đọc dữ liệu từ đây
            localStorage.setItem("user", JSON.stringify(userFullInfo));

            console.log("✅ Đã lưu User Info:", userFullInfo);
          } else {
            console.warn("⚠️ Có Token nhưng không lấy được User Info");
          }
        } catch (infoError) {
          console.error("❌ Lỗi mạng khi gọi myInfo:", infoError);
        }

        // BƯỚC 3: CHUYỂN HƯỚNG VỀ TRANG CHỦ
        navigate("/");

      } else {
        // Xử lý khi sai mật khẩu hoặc lỗi từ server trả về
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      }
    } catch (err) {
      setError("Lỗi kết nối server. Vui lòng thử lại sau.");
      console.error(err);
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
        {/* Hiệu ứng nền */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-red-600/30 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />

        <div className="w-[92%] max-w-md p-6 md:p-8 bg-gray-900/70 backdrop-blur-xl flex-col flex items-center gap-4 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-12 md:w-14" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide">
                Welcome Back
              </h1>
              <p className="text-xs md:text-sm text-gray-300">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="text-white underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && (
              <div className="w-full bg-red-500/20 border border-red-500 text-red-200 text-sm p-2 rounded text-center">
                {error}
              </div>
          )}

          <div className="w-full flex flex-col gap-3 mt-2">
            {/* Input Username */}
            <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl border border-white/10 focus-within:border-blue-500 transition">
              <MdAlternateEmail />
              <input
                  type="text"
                  placeholder="Username"
                  className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div className="w-full flex items-center gap-2 bg-gray-800/80 p-3 rounded-xl relative border border-white/10 focus-within:border-blue-500 transition">
              <FaFingerprint />
              <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()} // Cho phép nhấn Enter để login
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
          </div>

          {/* Nút Login */}
          <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full p-3 rounded-xl mt-3 text-sm md:text-base font-semibold shadow-lg shadow-blue-900/30 transition-all
            ${isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              }`}
          >
            {isLoading ? "Logging in..." : "Login"}
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

export default Login;