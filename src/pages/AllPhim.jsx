import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
// Bỏ bớt Star, Clock, Calendar vì đã nằm trong MovieCard rồi
import { Tag, Loader2 } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

// ✅ IMPORT COMPONENT CHUNG
import MovieCard from "../components/common/MovieCard";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AllPhim = () => {
  const { movies, isLoading } = useMovieContext();

  const query = useQuery();
  const currentGenre = query.get("genre") || "Tất cả";

  // Tự động lấy danh sách thể loại
  const genres = useMemo(() => {
    const genreSet = new Set();
    movies.forEach((movie) => {
      if (movie.types && Array.isArray(movie.types)) {
        movie.types.forEach((type) => genreSet.add(type));
      }
    });
    return ["Tất cả", ...Array.from(genreSet)];
  }, [movies]);

  // Logic lọc phim
  const filteredMovies = useMemo(() => {
    if (currentGenre === "Tất cả") return movies;
    return movies.filter(
      (movie) => movie.types && movie.types.includes(currentGenre)
    );
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
            {/* Genres Pills */}
            <div className="flex gap-2 flex-wrap mb-8">
              {genres.map((g) => (
                <Link
                  key={g}
                  to={
                    g === "Tất cả"
                      ? "/all"
                      : `/all?genre=${encodeURIComponent(g)}`
                  }
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
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-xl text-gray-500">
                  Không tìm thấy phim nào thuộc thể loại này.
                </p>
                <Link
                  to="/all"
                  className="inline-block mt-4 text-red-600 hover:underline"
                >
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
