import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const mockHistory = [
  {
    id: "ORD-202511-001",
    movie: "Oppenheimer",
    cinema: "CGV Times City",
    datetime: "28/11/2025 20:00",
    seats: ["C5", "C6"],
    total: 150000,
  },
  {
    id: "ORD-202511-002",
    movie: "Dune Part Two",
    cinema: "BHD Star Vincom",
    datetime: "20/11/2025 17:30",
    seats: ["B3"],
    total: 75000,
  },
];

function formatVND(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

const BookingHistory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lịch sử đặt vé</h1>

        <div className="space-y-4">
          {mockHistory.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Mã đơn: {o.id}</div>
                <div className="text-lg font-semibold text-gray-900">{o.movie}</div>
                <div className="text-gray-700 text-sm">{o.cinema} • {o.datetime}</div>
                <div className="text-gray-600 text-sm">Ghế: {o.seats.join(", ")}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Tổng tiền</div>
                <div className="text-xl font-bold">{formatVND(o.total)}</div>
                <button className="mt-2 text-red-600 font-medium hover:underline">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
