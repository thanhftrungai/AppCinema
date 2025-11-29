import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { allMovies, filterMoviesByGenre, genres } from "../data/movies";
import { Star, Clock, Calendar, Tag } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AllPhim = () => {
  const query = useQuery();
  const genre = query.get("genre") || "Tất cả";

  const filtered = filterMoviesByGenre(allMovies, genre);

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
            <h1 className="text-3xl font-bold text-gray-900">Tất cả phim {genre !== "Tất cả" ? `- ${genre}` : ""}</h1>
          </div>
          <div className="text-gray-600">{filtered.length} phim</div>
        </div>

        {/* Genres Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {genres.map((g) => (
            <Link
              key={g}
              to={g === "Tất cả" ? "/all" : `/all?genre=${encodeURIComponent(g)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                g === genre
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {g}
            </Link>
          ))}
        </div>

        {/* Movies grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
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
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition">
                    {movie.title}
                  </h3>
                </Link>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" /> {movie.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" /> {movie.releaseDate}
                  </div>
                </div>
                <Link to={`/booking?movieId=${movie.id}`} className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Đặt vé ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllPhim;
