import React from "react";
import {
  Film,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 mt-16 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-500 p-2 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                CinemaBooking
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam. Trải nghiệm
              điện ảnh tuyệt vời mọi lúc mọi nơi.
            </p>
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Liên kết
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Phim đang chiếu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Phim sắp chiếu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Rạp chiếu phim
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Khuyến mãi
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Hỗ trợ
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Hướng dẫn đặt vé
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Liên hệ
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500"></span>
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 group-hover:bg-red-500 p-2 rounded-lg transition-colors duration-300 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Email</p>
                  <a
                    href="mailto:support@cinemabooking.vn"
                    className="hover:text-red-500 transition-colors"
                  >
                    support@cinemabooking.vn
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 group-hover:bg-red-500 p-2 rounded-lg transition-colors duration-300 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Hotline</p>
                  <a
                    href="tel:19001234"
                    className="hover:text-red-500 transition-colors"
                  >
                    1900 0000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 group-hover:bg-red-500 p-2 rounded-lg transition-colors duration-300 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Địa chỉ</p>
                  <p className="leading-relaxed">
                    Số 1 Vũ Văn Dũng Sơn Trà Đằ Nẵng ,Việt Nam
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-red-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-1">
                Đăng ký nhận tin
              </h4>
              <p className="text-sm text-gray-400">
                Nhận thông tin phim mới và ưu đãi đặc biệt
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors flex-1 md:w-64"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; 2025 CinemaBooking.Hehehehihihi.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
