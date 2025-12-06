import React, { useMemo } from "react";
// Import useParams để lấy ID từ URL (/movie/1)
import { useParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  Tag,
  Loader2,
  PlayCircle,
} from "lucide-react";
// 1. Import Context để lấy dữ liệu có sẵn
import { useMovieContext } from "../context/MovieContext";

const CardPhim = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const { movies, isLoading } = useMovieContext(); // Lấy danh sách phim từ kho chung

  // 2. Tìm phim trong danh sách có sẵn (Logic giống Booking.jsx)
  const movie = useMemo(() => {
    if (!movies || movies.length === 0) return null;

    // Tìm phim có id trùng với id trên URL
    // Lưu ý: id từ URL là string, id trong data là number nên cần ép kiểu
    return movies.find((m) => m.id === Number(id) || m.movieId === Number(id));
  }, [movies, id]);

  // --- TRƯỜNG HỢP 1: ĐANG TẢI ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
          <p className="text-gray-500">Đang tải thông tin phim...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // --- TRƯỜNG HỢP 2: KHÔNG TÌM THẤY PHIM ---
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Không tìm thấy phim này
          </h1>
          <p className="text-gray-500 mb-6">
            Có thể phim đã bị xóa hoặc đường dẫn không đúng.
          </p>
          <Link
            to="/all"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Trở về danh sách phim
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // --- TRƯỜNG HỢP 3: HIỂN THỊ CHI TIẾT ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <Link
          to="/all"
          className="inline-flex items-center gap-2 text-red-600 font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại tất cả phim
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Trái: Poster - Thu nhỏ lại */}
          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-2xl bg-white sticky top-24 max-w-sm mx-auto lg:mx-0">
              <img
                src={
                  movie.image || "https://placehold.co/400x600?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-auto object-cover aspect-[2/3]"
              />
            </div>
          </div>

          {/* Cột Phải: Thông tin chi tiết - Rộng hơn */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              {/* Tiêu đề & Rating */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  {movie.title}
                </h1>
                <div className="flex-shrink-0 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-md self-start">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{movie.rating || 0}/10</span>
                </div>
              </div>

              {/* Thể loại */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(movie.types || []).map((type, index) => (
                  <Link
                    key={index}
                    to={`/all?genre=${encodeURIComponent(type)}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    <Tag className="w-3 h-3 text-red-600" /> {type}
                  </Link>
                ))}
              </div>

              {/* Thông tin: Thời lượng, Ngày chiếu */}
              <div className="flex flex-wrap items-center gap-6 text-gray-700 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  {/* movie.duration trong Context đã có chữ "phút" hoặc chưa, xử lý hiển thị */}
                  <span className="font-medium">{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="font-medium">
                    {movie.releaseDate
                      ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
                      : "Đang cập nhật"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                    {movie.age || "T16"}
                  </span>
                </div>
              </div>

              {/* Mô tả phim */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Nội dung phim
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                  {movie.description || "Chưa có mô tả cho phim này."}
                </p>
              </div>

              {/* Đạo diễn */}
              {movie.director && (
                <div className="mb-8">
                  <span className="font-bold text-gray-900">Đạo diễn: </span>
                  <span className="text-gray-700">{movie.director}</span>
                </div>
              )}

              {/* Nút Đặt vé & Trailer */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  // Truyền ID sang trang Booking giống logic bạn đã làm
                  to={`/booking?movieId=${movie.id}`}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5 text-center"
                >
                  Đặt vé ngay
                </Link>

                {movie.trailer && (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Xem Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CardPhim;
