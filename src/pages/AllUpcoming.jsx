import React, { useState, useMemo } from "react";
import { Star, Clock, Calendar, Bell, Search, Filter, Loader2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
// 1. Import Context
import { useMovieContext } from "../context/MovieContext";

const AllUpcoming = () => {
  // 2. Lấy danh sách phim sắp chiếu từ Context
  const { upcomingMovies, isLoading } = useMovieContext();

  const [notifiedMovies, setNotifiedMovies] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("releaseDate");

  // Logic nút thông báo (Giả lập local)
  const handleNotify = (movieId) => {
    setNotifiedMovies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  // 3. Logic Lọc và Sắp xếp (Cập nhật cho cấu trúc dữ liệu mới)
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
            // So sánh ngày tháng (String YYYY-MM-DD so sánh được trực tiếp)
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
                Đừng bỏ lỡ những bộ phim bom tấn sắp ra mắt. Nhấn thông báo để
                được nhắc nhở khi phim công chiếu!
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
                    filteredMovies.map((movie) => {
                      const isNotified = notifiedMovies.has(movie.id);

                      return (
                          <div
                              key={movie.id}
                              className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
                          >
                            {/* Movie Poster */}
                            <div className="relative h-[400px] overflow-hidden bg-gray-900">
                              <img
                                  src={movie.image}
                                  alt={movie.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />

                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              {/* Rating Badge */}
                              {movie.rating > 0 && (
                                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-xl">
                                    <Star className="w-4 h-4 fill-current" />
                                    {movie.rating}
                                  </div>
                              )}

                              {/* Coming Soon Badge */}
                              <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-xl animate-pulse">
                          Sắp Chiếu
                        </span>
                              </div>

                              {/* Description on hover */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm line-clamp-2">
                                  {movie.description || "Đang cập nhật nội dung..."}
                                </p>
                              </div>
                            </div>

                            {/* Movie Info */}
                            <div className="p-5">
                              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 min-h-[56px] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition">
                                {movie.title}
                              </h3>

                              <div className="space-y-2 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-purple-400" />
                                  <span>{movie.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-purple-400" />
                                  <span>{movie.releaseDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Filter className="w-4 h-4 text-purple-400" />
                                  {/* Chuyển mảng types thành chuỗi */}
                                  <span className="line-clamp-1">
                             {movie.types ? movie.types.join(", ") : "Đang cập nhật"}
                          </span>
                                </div>
                              </div>

                              {/* Notify Button */}
                              <button
                                  onClick={() => handleNotify(movie.id)}
                                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 ${
                                      isNotified
                                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                                  }`}
                              >
                                <Bell
                                    className={`w-5 h-5 ${isNotified ? "fill-current" : ""}`}
                                />
                                {isNotified ? "Đã Bật Thông Báo ✓" : "Bật Thông Báo"}
                              </button>
                            </div>
                          </div>
                      );
                    })
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