import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Tạo Context
const MovieContext = createContext();

// 2. Tạo Provider (Nhà cung cấp dữ liệu)
export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]); // Phim đang chiếu
  const [upcomingMovies, setUpcomingMovies] = useState([]); // Phim sắp chiếu
  const [isLoading, setIsLoading] = useState(true);

  // Hàm fetch dữ liệu (Chuyển từ Home sang đây)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/cinema/movies");
        const data = await response.json();

        if (data.code === 0) {
          const allMovies = data.result;
          const today = new Date();

          const formattedMovies = allMovies.map((movie) => ({
            id: movie.movieId,
            title: movie.title,
            image: movie.image,
            rating: movie.rating,
            age: "T16", // Hardcode tạm hoặc lấy từ API nếu có
            duration: `${movie.duration} phút`,
            releaseDate: movie.releaseDate,
            types: movie.types || [],
            rawDate: new Date(movie.releaseDate),
            description: movie.description,
            director: movie.director,
            trailer: movie.trailer,
          }));

          const nowShowing = [];
          const upcoming = [];

          formattedMovies.forEach((movie) => {
            if (movie.rawDate <= today) {
              nowShowing.push(movie);
            } else {
              upcoming.push(movie);
            }
          });

          setMovies(nowShowing);
          setUpcomingMovies(upcoming);
        }
      } catch (error) {
        console.error("Lỗi tải phim tại Context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Những dữ liệu muốn chia sẻ ra ngoài
  const value = {
    movies,
    upcomingMovies,
    isLoading,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

// 3. Hook để các trang khác dễ dàng gọi dùng
// eslint-disable-next-line react-refresh/only-export-components
export const useMovieContext = () => {
  return useContext(MovieContext);
};
