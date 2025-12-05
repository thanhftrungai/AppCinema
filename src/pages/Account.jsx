import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  User,
  Lock,
  Mail,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch thông tin user
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // --- CHỈNH SỬA 1: API lấy thông tin user (thường ở UserController) ---
        const response = await fetch("/cinema/users/myInfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            username: data.result?.username || data.username || "",
            email: data.result?.email || data.email || "",
            role: data.result?.role || data.role || "",
            createdAt: data.result?.createdAt || data.createdAt || "",
          });
        } else {
          setMessage({
            type: "error",
            content: "Không thể tải thông tin tài khoản",
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
        setMessage({
          type: "error",
          content: "Có lỗi xảy ra khi tải thông tin",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    // Validation
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage({
        type: "error",
        content: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        content: "Mật khẩu mới không khớp",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        content: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem("token");

      // --- CHỈNH SỬA 2: API Đổi mật khẩu (chuyển sang AuthenticationController) ---
      const response = await fetch("/cinema/auth/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      // Kiểm tra response.ok và logic code (nếu backend trả về code 1000 cho thành công)
      if (response.ok && (!data.code || data.code === 1000)) {
        setMessage({
          type: "success",
          content: data.result || "Đổi mật khẩu thành công!",
        });
        // Clear form
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Xử lý lỗi từ ApiResponse
        setMessage({
          type: "error",
          content: data.message || "Đổi mật khẩu thất bại",
        });
      }
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      setMessage({
        type: "error",
        content: "Có lỗi xảy ra khi đổi mật khẩu",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Dữ liệu ngày không hợp lệ";
    return date.toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
            <p className="text-gray-500">Đang tải thông tin tài khoản...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600">
            Xem và cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin tài khoản */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userInfo.username || "Người dùng"}
                  </h2>
                  {userInfo.role === "ADMIN" && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo.email || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vai trò</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo.role === "ADMIN"
                        ? "Quản trị viên"
                        : "Người dùng"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Ngày tạo tài khoản
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(userInfo.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form đổi mật khẩu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Đổi mật khẩu
                </h2>
              </div>

              {/* Message */}
              {message.content && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium">{message.content}</p>
                </div>
              )}

              <form onSubmit={handleSubmitPassword} className="space-y-5">
                {/* Mật khẩu cũ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Đổi mật khẩu
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  💡 Lưu ý khi đổi mật khẩu:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Mật khẩu phải có ít nhất 6 ký tự</li>
                  <li>Nên kết hợp chữ hoa, chữ thường và số</li>
                  <li>Không chia sẻ mật khẩu với người khác</li>
                  <li>Thay đổi mật khẩu định kỳ để bảo mật</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
