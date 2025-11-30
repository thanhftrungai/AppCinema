import React, { useState } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  Film as FilmIcon,
  MapPin,
} from "lucide-react";

export const ManageShowtimes = () => {
  const [showtimes] = useState([
    {
      id: 1,
      movie: "Avatar 3",
      cinema: "CGV Vincom Center",
      room: "Phòng 1",
      date: "30/11/2024",
      time: "19:00",
      price: "90,000đ",
      seats: { available: 45, total: 120 },
      status: "Còn vé",
    },
    {
      id: 2,
      movie: "Fast & Furious 11",
      cinema: "CGV Vincom Center",
      room: "Phòng 3",
      date: "30/11/2024",
      time: "20:30",
      price: "95,000đ",
      seats: { available: 12, total: 100 },
      status: "Sắp hết",
    },
    {
      id: 3,
      movie: "The Batman 2",
      cinema: "Lotte Cinema Đống Đa",
      room: "Phòng 2",
      date: "01/12/2024",
      time: "21:00",
      price: "100,000đ",
      seats: { available: 0, total: 150 },
      status: "Hết vé",
    },
    {
      id: 4,
      movie: "Avatar 3",
      cinema: "Galaxy Cinema Nguyễn Du",
      room: "Phòng 4",
      date: "30/11/2024",
      time: "18:00",
      price: "85,000đ",
      seats: { available: 80, total: 120 },
      status: "Còn vé",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Còn vé":
        return "bg-green-100 text-green-800";
      case "Sắp hết":
        return "bg-yellow-100 text-yellow-800";
      case "Hết vé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Quản lý Suất Chiếu
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý lịch chiếu phim tại các rạp
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Thêm suất chiếu
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tất cả phim</option>
            <option>Avatar 3</option>
            <option>Fast & Furious 11</option>
            <option>The Batman 2</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tất cả rạp</option>
            <option>CGV Vincom Center</option>
            <option>Lotte Cinema</option>
            <option>Galaxy Cinema</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Showtimes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rạp & Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày & Giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Giá vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ghế trống
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
              {showtimes.map((showtime) => (
                <tr key={showtime.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-slate-200 rounded"></div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {showtime.movie}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">
                        {showtime.cinema}
                      </p>
                      <p className="text-slate-500">{showtime.room}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-slate-900">
                        <CalendarIcon size={14} />
                        <span>{showtime.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 mt-1">
                        <Clock size={14} />
                        <span>{showtime.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">
                      {showtime.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">
                        {showtime.seats.available}/{showtime.seats.total}
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${
                              (showtime.seats.available /
                                showtime.seats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        showtime.status
                      )}`}
                    >
                      {showtime.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Sửa
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-sm">
          <p className="text-blue-100 text-sm">Suất chiếu hôm nay</p>
          <p className="text-3xl font-bold mt-2">48</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-sm">
          <p className="text-green-100 text-sm">Tổng vé đã bán</p>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-sm">
          <p className="text-purple-100 text-sm">Doanh thu hôm nay</p>
          <p className="text-3xl font-bold mt-2">₫12.5M</p>
        </div>
      </div>
    </div>
  );
};
