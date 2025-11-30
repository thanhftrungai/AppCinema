import React from "react";

export const AdminDashboard = () => {
  const stats = [
    { label: "Tổng phim", value: "248", color: "blue", change: "+12%" },
    { label: "Đặt vé hôm nay", value: "1,234", color: "green", change: "+23%" },
    { label: "Người dùng", value: "8,456", color: "purple", change: "+8%" },
    { label: "Doanh thu", value: "₫45.2M", color: "orange", change: "+15%" },
  ];

  const movies = ["Avatar 3", "Fast & Furious 11", "The Batman 2"];

  const activities = [
    "Nguyễn Văn A đã đặt 2 vé cho Avatar 3",
    'Phim "Fast X" được cập nhật',
    "Trần Thị B đã hủy đặt vé",
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
          >
            <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">
                {stat.value}
              </h3>
              <span
                className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Movies */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Phim mới nhất</h3>
          <div className="space-y-3">
            {movies.map((movie, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-slate-200 rounded"></div>
                <div className="flex-1">
                  <p className="font-medium">{movie}</p>
                  <p className="text-sm text-slate-500">120 phút • Action</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {i + 2} phút trước
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
