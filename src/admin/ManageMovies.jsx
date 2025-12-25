import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
// 1. Import Context
import { useMovieContext } from "../context/MovieContext";
// 2. Import Modal từ thư mục riêng (đã cập nhật đường dẫn)
import CreateMovieModal from "./modals/CreateMovieModal";
import EditMovieModal from "./modals/EditMovieModal.jsx";
import DeleteMovieModal from "./modals/DeleteMovieModal";
export const ManageMovies = () => {
  // Lấy dữ liệu từ Context
  const { movies, upcomingMovies, isLoading } = useMovieContext();

  // State để quản lý việc đóng/mở Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Nếu editingMovie != null nghĩa là đang mở modal sửa
  const [editingMovie, setEditingMovie] = useState(null);

  const [movieToDelete, setMovieToDelete] = useState(null);
  // Gộp danh sách phim và xử lý hiển thị
  const allMovieList = useMemo(() => {
    // Gắn nhãn status cho phim đang chiếu
    const nowShowingList = movies.map((movie) => ({
      ...movie,
      status: "Đang chiếu",
      statusColor: "bg-green-100 text-green-800",
    }));

    // Gắn nhãn status cho phim sắp chiếu
    const upcomingList = upcomingMovies.map((movie) => ({
      ...movie,
      status: "Sắp chiếu",
      statusColor: "bg-yellow-100 text-yellow-800",
    }));

    // Gộp lại
    const combined = [...nowShowingList, ...upcomingList];

    // Sắp xếp: ID lớn nhất (mới nhất) lên đầu để dễ theo dõi
    return combined.sort((a, b) => b.id - a.id);
  }, [movies, upcomingMovies]);

  // Hàm xử lý khi thêm phim thành công
  const handleSuccess = () => {
    // Reload lại trang để cập nhật danh sách phim mới nhất từ Server
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-slate-500">Đang tải danh sách phim...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Quản lý Phim{" "}
          <span className="text-sm font-normal text-slate-500">
            ({allMovieList.length} phim)
          </span>
        </h2>

        {/* Nút mở Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          + Thêm phim mới
        </button>
      </div>

      {/* Movies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tên phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thể loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thời lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ngày chiếu
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {allMovieList.length > 0 ? (
                allMovieList.map((movie) => (
                  <tr
                    key={movie.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      #{movie.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* Ảnh phim */}
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded shadow-sm mr-3 bg-slate-200"
                          onError={(e) => (e.target.style.display = "none")} // Ẩn nếu lỗi ảnh
                        />
                        <div
                          className="font-semibold text-slate-900 max-w-[200px] truncate"
                          title={movie.title}
                        >
                          {movie.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {movie.types ? movie.types.join(", ") : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {movie.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {movie.releaseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${movie.statusColor}`}
                      >
                        {movie.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingMovie(movie)} // Set movie vào state -> Modal tự mở
                        className="text-blue-600 hover:text-blue-900 mr-4 font-semibold hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setMovieToDelete(movie)} // Set movie vào state -> Modal Xóa hiện lên
                        className="text-red-600 hover:text-red-900 font-semibold hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Chưa có dữ liệu phim.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPONENT MODAL (Ẩn/Hiện dựa vào state isModalOpen) */}
      <CreateMovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
      {/* 4. MODAL SỬA (Chỉ hiện khi editingMovie khác null) */}
      {editingMovie && (
        <EditMovieModal
          isOpen={true} // Luôn true vì việc render phụ thuộc vào editingMovie
          movie={editingMovie} // Truyền dữ liệu phim cần sửa vào
          onClose={() => setEditingMovie(null)} // Đóng modal = set state về null
          onSuccess={handleSuccess}
        />
      )}
      {/* 4. HIỂN THỊ MODAL XÓA */}
      {movieToDelete && (
        <DeleteMovieModal
          isOpen={true}
          movie={movieToDelete}
          onClose={() => setMovieToDelete(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
