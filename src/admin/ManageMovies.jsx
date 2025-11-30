import React, { useState } from "react";

export const ManageMovies = () => {
  const [movies] = useState([
    {
      id: 1,
      title: "Avatar 3",
      genre: "Sci-Fi",
      duration: "180 phút",
      status: "Đang chiếu",
    },
    {
      id: 2,
      title: "Fast & Furious 11",
      genre: "Action",
      duration: "140 phút",
      status: "Đang chiếu",
    },
    {
      id: 3,
      title: "The Batman 2",
      genre: "Action",
      duration: "165 phút",
      status: "Sắp chiếu",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Quản lý Phim</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Thêm phim mới
        </button>
      </div>

      {/* Movies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tên phim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Thể loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Thời lượng
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
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-200 rounded mr-3"></div>
                    <div className="font-medium text-slate-900">
                      {movie.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {movie.genre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {movie.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      movie.status === "Đang chiếu"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {movie.status}
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
  );
};
