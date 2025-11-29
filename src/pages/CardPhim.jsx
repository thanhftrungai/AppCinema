import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { allMovies } from "../data/movies";
import { Star, Clock, Calendar, ArrowLeft, Tag } from "lucide-react";

const CardPhim = () => {
  const { id } = useParams();
  const movie = allMovies.find((m) => String(m.id) === String(id));

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy phim</h1>
          <Link
            to="/all"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Trở về danh sách phim
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <Link to="/all" className="inline-flex items-center gap-2 text-red-600 font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Quay lại tất cả phim
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-lg bg-white">
              <img src={movie.image} alt={movie.title} className="w-full h-[500px] object-cover" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mr-4">{movie.title}</h1>
                <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.rating}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {(movie.genres || []).map((g) => (
                  <Link key={g} to={`/all?genre=${encodeURIComponent(g)}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700">
                    <Tag className="w-3 h-3 text-red-600" /> {g}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-6 text-gray-700 mb-6">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-600" />{movie.duration}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-600" />{movie.releaseDate}</div>
                <div className="flex items-center gap-2"><span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-bold">{movie.age}</span></div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{movie.description}</p>

              <div className="flex gap-3">
                <Link to={`/booking?movieId=${movie.id}`} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow">Đặt vé ngay</Link>
                <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold">Xem trailer</button>
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
