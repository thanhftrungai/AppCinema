import React, { useState, useEffect } from "react";
import {
  Film,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  LogOut,
  History,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const getAuthStatus = () => {
  const token = localStorage.getItem("token");
  const storedUsername = localStorage.getItem("username");
  const storedRole = localStorage.getItem("role");

  return {
    isAuthenticated: !!token,
    username: storedUsername || "",
    role: storedRole || "",
  };
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [{ isAuthenticated, username, role }, setAuthStatus] =
    useState(getAuthStatus);

  const navigate = useNavigate();

  // Xử lý scroll để thu nhỏ header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("/cinema/users/myInfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAuthStatus((prev) => ({
            ...prev,
            role: data.role,
            username: data.username,
          }));

          localStorage.setItem("role", data.role || "");
          localStorage.setItem("username", data.username || "");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };

    fetchUserInfo();

    const handleStorageChange = () => {
      setAuthStatus(getAuthStatus());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => setIsUserMenuOpen((p) => !p);
  const toggleMovieDropdown = () => setIsMovieDropdownOpen((p) => !p);

  const handleLogout = () => {
    localStorage.clear();
    setAuthStatus({ isAuthenticated: false, username: "", role: "" });
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handleManageClick = () => {
    setIsUserMenuOpen(false);
    navigate("/admin/dashboard");
  };

  return (
    <header
      className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-2xl backdrop-blur-lg bg-opacity-95" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo với animation */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`transition-all duration-300 ${
                isScrolled ? "scale-90" : "scale-100"
              }`}
            >
              <div className="relative">
                <Film className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors" />
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
            </div>
            <span
              className={`font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              CinemaBooking
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium hover:text-red-400 ${
                isScrolled ? "text-sm" : ""
              }`}
            >
              Trang chủ
            </Link>

            {/* Movie Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 ${
                  isScrolled ? "text-sm" : ""
                }`}
              >
                Phim
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-700">
                <Link
                  to="/all"
                  className="block px-5 py-3 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 transition-all first:rounded-t-xl text-sm font-medium"
                >
                  🎬 Phim đang chiếu
                </Link>
                <Link
                  to="/upcoming"
                  className="block px-5 py-3 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all last:rounded-b-xl border-t border-gray-700 text-sm font-medium"
                >
                  🔜 Sắp chiếu
                </Link>
              </div>
            </div>

            <Link
              to="/cinemas"
              className={`px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium hover:text-red-400 ${
                isScrolled ? "text-sm" : ""
              }`}
            >
              Rạp
            </Link>
            <Link
              to="/news"
              className={`px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium hover:text-red-400 ${
                isScrolled ? "text-sm" : ""
              }`}
            >
              Tin tức
            </Link>
            <Link
              to="/booking-history"
              className={`flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium hover:text-red-400 ${
                isScrolled ? "text-sm" : ""
              }`}
            >
              <History className="w-4 h-4" />
              Lịch sử
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              className={`p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 ${
                isScrolled ? "p-1.5" : "p-2"
              }`}
            >
              <Search
                className={`transition-all ${
                  isScrolled ? "w-4 h-4" : "w-5 h-5"
                }`}
              />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`hidden md:flex items-center gap-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 ${
                    isScrolled ? "py-1.5 text-sm" : "py-2"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span
                    className="max-w-[140px] truncate"
                    title={username || "Tài khoản"}
                  >
                    {username || "Tài khoản"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200">
                    <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-200">
                      <p className="text-xs text-gray-500">Xin chào,</p>
                      <p className="font-bold text-gray-900 truncate">
                        {username}
                      </p>
                      {role === "ADMIN" && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </div>

                    {role === "ADMIN" && (
                      <button
                        onClick={handleManageClick}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 font-medium border-b border-gray-200 text-blue-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Quản lý hệ thống</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden md:block px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 ${
                  isScrolled ? "py-1.5 text-sm" : "py-2"
                }`}
              >
                Đăng nhập
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-110"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-700 mt-4">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium hover:text-red-400"
                onClick={toggleMobileMenu}
              >
                🏠 Trang chủ
              </Link>

              <div>
                <button
                  onClick={toggleMovieDropdown}
                  className="flex items-center justify-between w-full hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium"
                >
                  <span>🎬 Phim</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isMovieDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMovieDropdownOpen && (
                  <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-red-500">
                    <Link
                      to="/all"
                      className="hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium hover:text-red-400"
                      onClick={toggleMobileMenu}
                    >
                      Phim đang chiếu
                    </Link>
                    <Link
                      to="/upcoming"
                      className="hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium hover:text-red-400"
                      onClick={toggleMobileMenu}
                    >
                      Sắp chiếu
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/cinemas"
                className="hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium hover:text-red-400"
                onClick={toggleMobileMenu}
              >
                🎭 Rạp
              </Link>
              <Link
                to="/news"
                className="hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium hover:text-red-400"
                onClick={toggleMobileMenu}
              >
                📰 Tin tức
              </Link>
              <Link
                to="/booking-history"
                className="hover:bg-white/10 rounded-lg transition py-3 px-4 font-medium hover:text-red-400"
                onClick={toggleMobileMenu}
              >
                📋 Lịch sử đặt vé
              </Link>

              {isAuthenticated ? (
                <div className="mt-2 pt-3 border-t border-gray-700 space-y-2">
                  {role === "ADMIN" && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition font-medium shadow-lg"
                      onClick={toggleMobileMenu}
                    >
                      <Settings className="w-4 h-4" />
                      Quản lý hệ thống
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      toggleMobileMenu();
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="mt-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition font-medium text-center shadow-lg"
                  onClick={toggleMobileMenu}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
