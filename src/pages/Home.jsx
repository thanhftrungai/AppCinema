import React, { useState, useEffect } from "react";
import {
  Star,
  Clock,
  Calendar,
  Play,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import banner4 from "../assets/images/banner4.jpg";

// Banner Slideshow Component
const BannerSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [banner1, banner2, banner3, banner4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative h-[500px] overflow-hidden group">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Trải nghiệm điện ảnh đỉnh cao
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Đặt vé nhanh chóng - Rạp hiện đại - Âm thanh sống động
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-red-600 w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Movie Card Component
const MovieCard = ({ movie, isUpcoming = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const movieDetailLink = `/movie/${movie.id}`;

  return (
    <div
      className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={movieDetailLink} className="block">
        <div className="relative h-80 overflow-hidden bg-gray-900">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {!isUpcoming && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              {movie.rating}
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {movie.age}
            </span>
          </div>

          {isHovered && !isUpcoming && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full shadow-2xl transform transition-all hover:scale-110">
                <Play className="w-8 h-8 fill-current" />
              </button>
            </div>
          )}

          {isUpcoming && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-xl">
                Sắp chiếu
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 bg-white">
        <Link to={movieDetailLink}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-red-600 transition-colors h-14">
            {movie.title}
          </h3>
        </Link>

        <div className="space-y-2.5 mb-5">
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
          <span className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg cursor-default">
            Thông báo cho tôi
          </span>
        ) : (
          <Link
            to={`/booking?movieId=${movie.id}`}
            className="inline-block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
          >
            Đặt vé ngay
          </Link>
        )}
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-2">
      {Icon && (
        <div className="bg-red-600 p-2 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
    </div>
    {subtitle && <p className="text-gray-600 text-lg ml-14">{subtitle}</p>}
  </div>
);

// Main Home Component
const Home = () => {
  const { movies, upcomingMovies, isLoading } = useMovieContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Header />

      {/* Hero Banner Slideshow */}
      <BannerSlideshow />

      {/* Features Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Chất lượng cao</h3>
              <p className="text-white/90">Hình ảnh 4K, âm thanh Dolby Atmos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đặt vé nhanh</h3>
              <p className="text-white/90">Chỉ 30 giây để hoàn tất đặt vé</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ưu đãi hấp dẫn</h3>
              <p className="text-white/90">Nhiều chương trình khuyến mãi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Now Showing Movies */}
      <div className="container mx-auto px-4 py-20">
        <SectionHeader
          icon={TrendingUp}
          title="Phim đang chiếu"
          subtitle="Những bộ phim hot nhất hiện nay"
        />

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">
            Đang tải danh sách phim...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.length > 0 ? (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Hiện chưa có phim đang chiếu
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Movies */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            icon={Calendar}
            title="Phim sắp chiếu"
            subtitle="Đừng bỏ lỡ những bom tấn sắp ra mắt"
          />

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
