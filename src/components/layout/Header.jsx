import React, { useState } from "react";
import { Film, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-red-500" />
            <Link to="/" className="text-2xl font-bold">CinemaBooking</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-red-500 transition">
              Trang chủ
            </Link>
            <Link to="/all" className="hover:text-red-500 transition">
              Phim
            </Link>
            <Link to="/cinemas" className="hover:text-red-500 transition">
              Rạp
            </Link>
            <Link to="/news" className="hover:text-red-500 transition">
              Tin tức
            </Link>
            <Link to="/booking-history" className="hover:text-red-500 transition">
              Đặt vé
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/login" className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium">
              Đăng nhập
            </Link>
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
              <Link
                to="/all"
                className="hover:text-red-500 transition py-2"
                onClick={toggleMobileMenu}
              >
                Phim
              </Link>
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
              <Link to="/login" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium text-left" onClick={toggleMobileMenu}>
                Đăng nhập
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
