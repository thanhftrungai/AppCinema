import React, { useState } from "react";
import { Star, Clock, Calendar, Bell, Search, Filter } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Dữ liệu tĩnh phim sắp chiếu
const upcomingMovies = [
  {
    id: 1,
    title: "Avengers: Secret Wars",
    image: "https://image.tmdb.org/t/p/w500/qVdrYN0OZErSQkYjiHqAScf0UA6.jpg",
    rating: 9.2,
    duration: "165 phút",
    releaseDate: "15/05/2026",
    genre: "Hành động, Phiêu lưu",
    description: "Cuộc chiến vũ trụ hoành tráng nhất từng được dựng nên",
  },
  {
    id: 2,
    title: "Dune: Messiah",
    image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    rating: 8.9,
    duration: "155 phút",
    releaseDate: "18/12/2025",
    genre: "Khoa học viễn tưởng",
    description: "Hành trình tiếp theo của Paul Atreides",
  },
  {
    id: 3,
    title: "Avatar 3: The Seed Bearer",
    image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    rating: 9.0,
    duration: "180 phút",
    releaseDate: "20/12/2025",
    genre: "Khoa học viễn tưởng, Phiêu lưu",
    description: "Khám phá những bộ tộc mới trên hành tinh Pandora",
  },
  {
    id: 4,
    title: "The Batman Part II",
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 8.7,
    duration: "170 phút",
    releaseDate: "02/10/2026",
    genre: "Hành động, Tội phạm",
    description: "Người Dơi đối mặt với kẻ thù nguy hiểm nhất",
  },
  {
    id: 5,
    title: "Spider-Man 4",
    image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    rating: 8.8,
    duration: "145 phút",
    releaseDate: "25/07/2025",
    genre: "Hành động, Phiêu lưu",
    description: "Peter Parker đối mặt với một mối đe dọa mới",
  },
  {
    id: 6,
    title: "Mission: Impossible 8",
    image: "https://image.tmdb.org/t/p/w500/z0r3YjyJSLqf6Hz0rbBAnEhNXQ7.jpg",
    rating: 8.5,
    duration: "160 phút",
    releaseDate: "23/05/2025",
    genre: "Hành động, Thriller",
    description: "Nhiệm vụ cuối cùng của Ethan Hunt",
  },
  {
    id: 7,
    title: "Fantastic Four",
    image: "https://image.tmdb.org/t/p/w500/6RCf9jzKxyjblYV4CseayK6bcJo.jpg",
    rating: 8.3,
    duration: "140 phút",
    releaseDate: "25/07/2025",
    genre: "Hành động, Phiêu lưu",
    description: "Gia đình siêu anh hùng trở lại",
  },
  {
    id: 8,
    title: "Joker: Folie à Deux",
    image: "https://image.tmdb.org/t/p/w500/byDXrm0pY6vSsJlYPpuwvKJNm6K.jpg",
    rating: 8.6,
    duration: "138 phút",
    releaseDate: "04/10/2024",
    genre: "Drama, Thriller",
    description: "Câu chuyện tình điên loạn của Joker và Harley Quinn",
  },
];

const AllUpcoming = () => {
  const [notifiedMovies, setNotifiedMovies] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("releaseDate");

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

  const filteredMovies = upcomingMovies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="releaseDate" className="bg-slate-800">
                  Ngày phát hành
                </option>
                <option value="rating" className="bg-slate-800">
                  Đánh giá
                </option>
              </select>
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="text-gray-300 font-semibold">
              {filteredMovies.length} phim sắp chiếu
            </span>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => {
            const isNotified = notifiedMovies.has(movie.id);

            return (
              <div
                key={movie.id}
                className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
              >
                {/* Movie Poster */}
                <div className="relative h-[400px] overflow-hidden">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-xl">
                    <Star className="w-4 h-4 fill-current" />
                    {movie.rating}
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-xl animate-pulse">
                      Sắp Chiếu
                    </span>
                  </div>

                  {/* Description on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm line-clamp-2">
                      {movie.description}
                    </p>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition">
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
                      <span className="line-clamp-1">{movie.genre}</span>
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
          })}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">
              Không tìm thấy phim nào phù hợp
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllUpcoming;
