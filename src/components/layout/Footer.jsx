import React from "react";
import { Film } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold text-white">
                CinemaBooking
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam. Trải nghiệm
              điện ảnh tuyệt vời mọi lúc mọi nơi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Phim đang chiếu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Phim sắp chiếu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Rạp chiếu phim
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 support@cinemabooking.vn</li>
              <li>📞 1900 1234</li>
              <li>📍 123 Nguyễn Huệ, Q1, TP.HCM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 CinemaBooking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
