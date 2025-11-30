import React, { useState } from "react";

export const ManageBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      customer: "Nguyễn Văn A",
      movie: "Avatar 3",
      time: "19:00 - 30/11/2024",
      seats: "A1, A2",
      status: "Đã thanh toán",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      movie: "Fast X",
      time: "20:30 - 30/11/2024",
      seats: "B5, B6",
      status: "Chờ xác nhận",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      movie: "The Batman 2",
      time: "21:00 - 01/12/2024",
      seats: "C3, C4, C5",
      status: "Đã hủy",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Quản lý Đặt vé</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            Lọc
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ghế
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {booking.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {booking.movie}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {booking.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {booking.seats}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "Đã thanh toán"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Xem
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Hủy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
