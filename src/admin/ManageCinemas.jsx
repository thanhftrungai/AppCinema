import React, { useState } from "react";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";

export const ManageCinemas = () => {
  const [cinemas] = useState([
    {
      id: 1,
      name: "CGV Vincom Center",
      address: "72 Lê Thánh Tôn, Q.1, TP.HCM",
      city: "TP. Hồ Chí Minh",
      screens: 8,
      totalSeats: 1200,
      status: "Đang hoạt động",
    },
    {
      id: 2,
      name: "Lotte Cinema Đống Đa",
      address: "229 Tây Sơn, Đống Đa, Hà Nội",
      city: "Hà Nội",
      screens: 10,
      totalSeats: 1500,
      status: "Đang hoạt động",
    },
    {
      id: 3,
      name: "Galaxy Cinema Nguyễn Du",
      address: "116 Nguyễn Du, Q.1, TP.HCM",
      city: "TP. Hồ Chí Minh",
      screens: 6,
      totalSeats: 900,
      status: "Bảo trì",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Quản lý Rạp Chiếu Phim
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý thông tin các rạp chiếu phim trong hệ thống
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Thêm rạp mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">Tổng số rạp</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-600 mt-1">22</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">Tổng phòng chiếu</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">186</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">Tổng ghế</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">28,500</p>
        </div>
      </div>

      {/* Cinemas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {cinema.name}
                  </h3>
                  <div className="flex items-start gap-2 text-slate-600 mb-2">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <p className="text-sm">{cinema.address}</p>
                  </div>
                  <p className="text-sm text-slate-500">
                    Thành phố: {cinema.city}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    cinema.status === "Đang hoạt động"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {cinema.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Phòng chiếu</p>
                  <p className="text-lg font-bold text-slate-900">
                    {cinema.screens}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tổng số ghế</p>
                  <p className="text-lg font-bold text-slate-900">
                    {cinema.totalSeats}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
                <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
