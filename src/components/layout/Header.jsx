import React, { useState, useEffect } from "react";
import {
  Film,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const getAuthStatus = () => {
  const token = localStorage.getItem("token");
  const storedUsername = localStorage.getItem("username");

  return {
    isAuthenticated: !!token,
    username: storedUsername || "",
  };
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [{ isAuthenticated, username }, setAuthStatus] =
    useState(getAuthStatus);

  const navigate = useNavigate();

  // Cập nhật auth status khi component mount hoặc khi localStorage thay đổi
  useEffect(() => {
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
    localStorage.removeItem("token");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");

    setAuthStatus({ isAuthenticated: false, username: "" });
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handleManageClick = () => {
    setIsUserMenuOpen(false);
    navigate("/admin/dashboard");
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-red-500" />
            <Link to="/" className="text-2xl font-bold">
              CinemaBooking
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-red-500 transition">
              Trang chủ
            </Link>
            {/* Movie Dropdown */}
            <div className="relative group">
              <button
                onClick={toggleMovieDropdown}
                className="flex items-center gap-1 hover:text-red-500 transition"
              >
                Phim
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/all"
                  className="block px-4 py-3 hover:bg-gray-700 hover:text-red-500 transition first:rounded-t-lg"
                >
                  Phim đang chiếu
                </Link>
                <Link
                  to="/upcoming"
                  className="block px-4 py-3 hover:bg-gray-700 hover:text-red-500 transition last:rounded-b-lg border-t border-gray-700"
                >
                  Sắp chiếu
                </Link>
              </div>
            </div>
            <Link to="/cinemas" className="hover:text-red-500 transition">
              Rạp
            </Link>
            <Link to="/news" className="hover:text-red-500 transition">
              Tin tức
            </Link>
            <Link
              to="/booking-history"
              className="hover:text-red-500 transition"
            >
              Đặt vé
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
              <Search className="w-5 h-5" />
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium"
                >
                  <User className="w-4 h-4" />
                  <span
                    className="max-w-[160px] truncate"
                    title={username || "Tài khoản"}
                  >
                    {username || "Tài khoản"}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={handleManageClick}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2 font-medium border-b border-gray-200"
                    >
                      <Settings className="w-4 h-4" />
                      Quản lý
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
              >
                Đăng nhập
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
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
          <nav className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="hover:text-red-500 transition py-2"
                onClick={toggleMobileMenu}
              >
                Trang chủ
              </Link>
              {/* Mobile Movie Dropdown */}
              <div>
                <button
                  onClick={toggleMovieDropdown}
                  className="flex items-center gap-1 w-full hover:text-red-500 transition py-2"
                >
                  Phim
                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      isMovieDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMovieDropdownOpen && (
                  <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-gray-700">
                    <Link
                      to="/all"
                      className="hover:text-red-500 transition py-1"
                      onClick={toggleMobileMenu}
                    >
                      Phim đang chiếu
                    </Link>
                    <Link
                      to="/upcoming"
                      className="hover:text-red-500 transition py-1"
                      onClick={toggleMobileMenu}
                    >
                      Sắp chiếu
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/cinemas"
                className="hover:text-red-500 transition py-2"
                onClick={toggleMobileMenu}
              >
                Rạp
              </Link>
              <Link
                to="/news"
                className="hover:text-red-500 transition py-2"
                onClick={toggleMobileMenu}
              >
                Tin tức
              </Link>
              <Link
                to="/booking-history"
                className="hover:text-red-500 transition py-2"
                onClick={toggleMobileMenu}
              >
                Đặt vé
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium flex items-center gap-2"
                    onClick={toggleMobileMenu}
                  >
                    <Settings className="w-4 h-4" />
                    Quản lý
                  </Link>
                  <button
                    onClick={() => {
                      toggleMobileMenu();
                      handleLogout();
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium text-left"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium text-left"
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
