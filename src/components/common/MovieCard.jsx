import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Calendar, Play } from "lucide-react";

const MovieCard = ({ movie, isUpcoming = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const detailPath = `/movie/${movie.id}`;

    return (
        <div
            className="group block relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={detailPath} className="block relative h-80 overflow-hidden bg-gray-900">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {!isUpcoming && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        {movie.rating}
                    </div>
                )}

                <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {movie.age || "T16"}
          </span>
                </div>

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
            </Link>

            <div className="p-5 bg-white">
                <Link to={detailPath}>
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

export default MovieCard;