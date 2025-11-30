import React, { useState } from "react";
import { Star, Clock, Calendar, Play, Flame, TrendingUp } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
// Import hook lấy dữ liệu
import { useMovieContext } from "../context/MovieContext";

// --- 1. MOVIE CARD COMPONENT (Giữ nguyên) ---
const MovieCard = ({ movie, isUpcoming = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Link chi tiết phim
  const movieDetailLink = `/movie/${movie.id}`;

  return (
      // 1. Đổi thẻ bao ngoài từ Link -> div
      <div
          className="group block relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        {/* 2. Bọc riêng phần Ảnh bằng Link để bấm vào ảnh vẫn chuyển trang */}
        <Link to={movieDetailLink} className="block">
          <div className="relative h-80 overflow-hidden bg-gray-900">
            <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Rating Badge */}
            {!isUpcoming && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.rating}
                </div>
            )}

            {/* Age Badge */}
            <div className="absolute top-3 left-3">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {movie.age}
            </span>
            </div>

            {/* Play Button Overlay */}
            {isHovered && !isUpcoming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-xl transform transition-transform hover:scale-110">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
            )}

            {isUpcoming && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                Sắp chiếu
              </span>
                </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 bg-white">
          {/* 3. Bọc Tiêu đề bằng Link */}
          <Link to={movieDetailLink}>
            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition h-14">
              {movie.title}
            </h3>
          </Link>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4 text-red-600" />
              <span>{movie.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>{movie.releaseDate}</span>
            </div>
          </div>

          {/* 4. Nút Đặt vé hoặc Thông báo (Giữ nguyên là Link, giờ nó không bị lồng nữa) */}
          {isUpcoming ? (
              <span className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 cursor-default">
            Thông báo
          </span>
          ) : (
              <Link
                  to={`/booking?movieId=${movie.id}`}
                  className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Đặt vé ngay
              </Link>
          )}
        </div>
      </div>
  );
};

// (Đã xóa Component CategoryFilter ở đây)

// --- HOME PAGE ĐÃ RÚT GỌN ---
const Home = () => {
  // ✅ Lấy dữ liệu trực tiếp từ kho chung
  const { movies, upcomingMovies, isLoading } = useMovieContext();

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />

        {/* Hero Banner (Giữ nguyên) */}
        <div className="relative bg-gradient-to-r from-purple-900 via-red-900 to-pink-900 text-white overflow-hidden">
          {/* ... Code Banner giữ nguyên ... */}
          <div className="relative container mx-auto px-4 py-24">
            <h1 className="text-6xl font-bold mb-4">Trải nghiệm điện ảnh đỉnh cao</h1>
          </div>
        </div>

        {/* Movies Section - Đang Chiếu */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <h2 className="text-4xl font-bold text-gray-900">Phim đang chiếu</h2>
            </div>
          </div>

          {isLoading ? (
              <div className="text-center py-10 text-gray-500">Đang tải danh sách phim...</div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.length > 0 ? (
                    movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    <div className="col-span-full text-center text-gray-500">Hiện chưa có phim đang chiếu</div>
                )}
              </div>
          )}
        </div>

        {/* Upcoming Movies Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-900">Phim sắp chiếu</h2>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Đang tải...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcomingMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} isUpcoming={true} />
                  ))}
                </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
  );
};

export default Home;