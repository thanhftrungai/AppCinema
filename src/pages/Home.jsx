import React, { useState } from "react";
import { Star, Clock, Calendar, Play, Flame, TrendingUp } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

// Movie Card Component
const MovieCard = ({ movie, isUpcoming = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-gray-900">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-4 h-4 fill-current" />
          {movie.rating}
        </div>

        {/* Age Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {movie.age}
          </span>
        </div>

        {/* Play Button on Hover */}
        {isHovered && !isUpcoming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-xl transform transition-transform hover:scale-110">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        )}

        {/* Coming Soon Badge */}
        {isUpcoming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
              Sắp chiếu
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition">
          {movie.title}
        </h3>
        
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

        {isUpcoming ? (
          <span className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Thông báo
          </span>
        ) : (
          <Link to={`/booking?movieId=${movie.id}`} className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Đặt vé ngay
          </Link>
        )}
      </div>
    </Link>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
            activeCategory === category
              ? "bg-red-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// Home Page
const Home = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  
  const categories = ["Tất cả", "Hành động", "Hài hước", "Kinh dị", "Tình cảm", "Khoa học viễn tưởng"];

  const movies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
      rating: 8.4,
      age: "13+",
      duration: "181 phút",
      releaseDate: "26/04/2024",
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      image:
        "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
      rating: 8.7,
      age: "13+",
      duration: "148 phút",
      releaseDate: "17/12/2024",
    },
    {
      id: 3,
      title: "Oppenheimer",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
      rating: 8.5,
      age: "16+",
      duration: "180 phút",
      releaseDate: "21/07/2024",
    },
    {
      id: 4,
      title: "The Batman",
      image:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
      rating: 7.9,
      age: "16+",
      duration: "176 phút",
      releaseDate: "04/03/2024",
    },
    {
      id: 5,
      title: "Dune: Part Two",
      image:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
      rating: 8.8,
      age: "13+",
      duration: "166 phút",
      releaseDate: "01/03/2024",
    },
    {
      id: 6,
      title: "Barbie",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=600&fit=crop",
      rating: 7.2,
      age: "P",
      duration: "114 phút",
      releaseDate: "21/07/2024",
    },
  ];

  const upcomingMovies = [
    {
      id: 7,
      title: "Avatar 3",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
      rating: 8.0,
      age: "13+",
      duration: "192 phút",
      releaseDate: "15/12/2024",
    },
    {
      id: 8,
      title: "Aquaman 2",
      image:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
      rating: 7.8,
      age: "13+",
      duration: "164 phút",
      releaseDate: "22/12/2024",
    },
    {
      id: 9,
      title: "Wonka",
      image:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop",
      rating: 8.2,
      age: "P",
      duration: "116 phút",
      releaseDate: "29/12/2024",
    },
    {
      id: 10,
      title: "Killers of the Flower Moon",
      image:
        "https://images.unsplash.com/photo-1533613220915-609f21a91335?w=400&h=600&fit=crop",
      rating: 8.3,
      age: "16+",
      duration: "206 phút",
      releaseDate: "05/01/2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-purple-900 via-red-900 to-pink-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Phim hot nhất tuần</span>
            </div>
            <h1 className="text-6xl font-bold mb-4 leading-tight">
              Trải nghiệm điện ảnh đỉnh cao
            </h1>
            <p className="text-xl mb-8 text-gray-100 leading-relaxed">
              Đặt vé nhanh chóng, thanh toán dễ dàng. Hàng ngàn bộ phim hot đang chờ bạn!
            </p>
            <div className="flex gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Khám phá ngay
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-red-900 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300">
                Xem trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section - Đang Chiếu */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <span className="text-red-600 font-semibold">PHIM ĐANG CHIẾU</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Phim hot nhất hiện nay</h2>
          </div>
          <Link to="/all" className="text-red-600 hover:text-red-700 font-semibold text-lg transition">
            Xem tất cả →
          </Link>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Upcoming Movies Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600 font-semibold">SẮP CHIẾU</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Những bộ phim sắp tới</h2>
            </div>
            <Link to="/all" className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isUpcoming={true} />
            ))}
          </div>
        </div>
      </div>

      {/* Promo Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white shadow-2xl">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-bold mb-4">Ưu đãi đặc biệt cho bạn</h3>
            <p className="text-lg mb-6 text-red-100">
              Đăng ký thành viên ngay hôm nay và nhận ngay 20% giảm giá cho lần đặt vé đầu tiên!
            </p>
            <a href="/register" className="inline-block bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
            Đăng ký ngay
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
