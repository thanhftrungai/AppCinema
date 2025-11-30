import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Star, Clock, Calendar, Tag, Loader2 } from "lucide-react";
// 1. Import Context
import { useMovieContext } from "../context/MovieContext";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AllPhim = () => {
  // 2. Lấy dữ liệu từ Context (Kho chung)
  const { movies, isLoading } = useMovieContext();

  const query = useQuery();
  const currentGenre = query.get("genre") || "Tất cả";

  // 3. Tự động lấy danh sách thể loại từ các phim đang có
  const genres = useMemo(() => {
    const genreSet = new Set();
    movies.forEach((movie) => {
      if (movie.types && Array.isArray(movie.types)) {
        movie.types.forEach((type) => genreSet.add(type));
      }
    });
    return ["Tất cả", ...Array.from(genreSet)];
  }, [movies]);

  // 4. Logic lọc phim (Filter)
  const filteredMovies = useMemo(() => {
    if (currentGenre === "Tất cả") return movies;
    return movies.filter((movie) => movie.types && movie.types.includes(currentGenre));
  }, [movies, currentGenre]);

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />

        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">BỘ LỌC</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tất cả phim {currentGenre !== "Tất cả" ? `- ${currentGenre}` : ""}
              </h1>
            </div>
            <div className="text-gray-600">
              {/* Hiển thị số lượng phim tìm thấy */}
              {!isLoading && `${filteredMovies.length} phim`}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
                <p className="text-gray-500">Đang tải danh sách phim...</p>
              </div>
          ) : (
              <>
                {/* Genres Pills (Danh sách nút thể loại) */}
                <div className="flex gap-2 flex-wrap mb-8">
                  {genres.map((g) => (
                      <Link
                          key={g}
                          to={g === "Tất cả" ? "/all" : `/all?genre=${encodeURIComponent(g)}`}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                              g === currentGenre
                                  ? "bg-red-600 text-white border-red-600 shadow-lg"
                                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        {g}
                      </Link>
                  ))}
                </div>

                {/* Movies grid */}
                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredMovies.map((movie) => (
                          <div
                              key={movie.id}
                              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
                          >
                            <div className="relative h-80 overflow-hidden bg-gray-900">
                              <img
                                  src={movie.image}
                                  alt={movie.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                                <Star className="w-4 h-4 fill-current" />
                                {movie.rating}
                              </div>
                              <div className="absolute top-3 left-3">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          {movie.age}
                        </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <Link to={`/movie/${movie.id}`} className="block">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition h-14">
                                  {movie.title}
                                </h3>
                              </Link>

                              <div className="space-y-1 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-red-600" /> {movie.duration}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-red-600" /> {movie.releaseDate}
                                </div>
                                {/* Hiển thị thể loại nhỏ bên dưới */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {movie.types && movie.types.slice(0, 2).map((t, idx) => (
                                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{t}</span>
                                  ))}
                                </div>
                              </div>

                              <Link
                                  to={`/booking?movieId=${movie.id}`}
                                  className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                Đặt vé ngay
                              </Link>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                      <p className="text-xl text-gray-500">Không tìm thấy phim nào thuộc thể loại này.</p>
                      <Link to="/all" className="inline-block mt-4 text-red-600 hover:underline">
                        Quay lại xem tất cả
                      </Link>
                    </div>
                )}
              </>
          )}
        </div>

        <Footer />
      </div>
  );
};

export default AllPhim;