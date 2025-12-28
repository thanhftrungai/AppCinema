import React, { useState, useEffect } from "react";
import { Loader2, Calendar, MapPin, Ticket, Film } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// [QUAN TRỌNG] Không cần dùng API BillContext nữa để tránh lỗi 403
const API_BASE = "/cinema";

const BookingHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Lấy thông tin User
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/users/myInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.result || data);
        }
      } catch (error) {
        console.error("Lỗi user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // 2. [FIX] Đọc lịch sử từ LocalStorage (Thay vì gọi API bị chặn)
  useEffect(() => {
    if (userInfo?.userId || userInfo?.id) {
      const userId = userInfo.userId || userInfo.id;
      const storageKey = `booking_history_${userId}`;
      const localHistory = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setHistoryData(localHistory);
    }
  }, [userInfo]);

  const formatVND = (v) => (v ? v.toLocaleString("vi-VN") + " đ" : "0 đ");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-red-600 pl-4">
          Lịch sử giao dịch
        </h1>

        {!userInfo ? (
          <div className="text-center py-10">
            Vui lòng đăng nhập để xem lịch sử.
          </div>
        ) : historyData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Bạn chưa có lịch sử đặt vé nào.</p>
            <a
              href="/"
              className="text-red-600 font-medium hover:underline mt-2 inline-block"
            >
              Đặt vé ngay
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {historyData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  <div className="w-16 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Film className="text-gray-400" size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                        THÀNH CÔNG
                      </span>
                      <span className="text-xs text-gray-400">
                        Mã đơn: #{item.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.movie}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-red-500" />
                        <span>
                          {item.cinema} - {item.room}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-red-500" />
                        <span>{item.datetime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket size={16} className="text-red-500" />
                        <span>
                          Ghế: <b>{item.seats.join(", ")}</b>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <span className="text-sm text-gray-500 mb-1">Tổng tiền</span>
                  <span className="text-2xl font-bold text-red-600 mb-4">
                    {formatVND(item.total)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Ngày đặt: {item.paymentAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
