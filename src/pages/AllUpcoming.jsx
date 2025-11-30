import React, { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
// 1. Import Context
import { useMovieContext } from "../context/MovieContext";
// 2. Import Component Card Chung (Quan trọng)
import MovieCard from "../components/common/MovieCard";

const AllUpcoming = () => {
  // Lấy danh sách phim sắp chiếu từ Context
  const { upcomingMovies, isLoading } = useMovieContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("releaseDate");

  // Logic Lọc và Sắp xếp
  const filteredMovies = useMemo(() => {
    return upcomingMovies
        .filter((movie) => {
          const term = searchTerm.toLowerCase();
          // Tìm theo tên phim
          const matchTitle = movie.title.toLowerCase().includes(term);
          // Tìm theo thể loại (Duyệt mảng types)
          const matchGenre = movie.types && movie.types.some(t => t.toLowerCase().includes(term));

          return matchTitle || matchGenre;
        })
        .sort((a, b) => {
          if (sortBy === "rating") {
            return b.rating - a.rating; // Điểm cao xếp trước
          }
          if (sortBy === "releaseDate") {
            // So sánh ngày tháng
            return new Date(a.releaseDate) - new Date(b.releaseDate);
          }
          return 0;
        });
  }, [upcomingMovies, searchTerm, sortBy]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
          <div className="container mx-auto px-4 py-12 relative">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                🎬 PHIM SẮP CHIẾU
              </span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Đặt Thông Báo Ngay
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Đừng bỏ lỡ những bộ phim bom tấn sắp ra mắt.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm phim, thể loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                </div>

                {/* Nút sắp xếp - Đã bỏ style cứng để hiển thị tốt hơn */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-6 py-3 bg-slate-800/80 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
                >
                  <option value="releaseDate">Ngày phát hành</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>

            <div className="text-center mb-6">
              {!isLoading && (
                  <span className="text-gray-300 font-semibold">
                {filteredMovies.length} phim sắp chiếu
              </span>
              )}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="container mx-auto px-4 pb-16">
          {isLoading ? (
              // Loading State
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-gray-400">Đang tải danh sách phim...</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        // ✅ SỬ DỤNG COMPONENT CHUNG - Gọn gàng & Không lỗi
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isUpcoming={true}
                        />
                    ))
                ) : (
                    // Empty State
                    <div className="col-span-full text-center py-16">
                      <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <div className="text-gray-400 text-lg">
                        Không tìm thấy phim nào phù hợp
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        <Footer />
      </div>
  );
};

export default AllUpcoming;