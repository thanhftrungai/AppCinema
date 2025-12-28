import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Loader2, Calendar, MapPin, Clock, Film } from "lucide-react";

// 1. Import các Context
import { useMovieContext } from "../context/MovieContext";
import { useCinemaContext } from "../context/CinemaContext";
import { useShowtimeContext } from "../context/ShowtimeContext";

// Helper: Format tiền tệ
const pricePerSeat = 75000;
function formatVND(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

// Helper: Tạo danh sách 7 ngày tới
function useNextDays(n = 7) {
  return useMemo(() => {
    const arr = [];
    const now = new Date();
    // --- QUAN TRỌNG: Reset giờ về 0 để tránh lỗi lệch ngày khi cộng ---
    now.setHours(0, 0, 0, 0);

    for (let i = 0; i < n; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      // Tạo chuỗi YYYY-MM-DD theo giờ địa phương
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      arr.push({
        key: dateStr, // Key chuẩn YYYY-MM-DD
        label: d.toLocaleDateString("vi-VN", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
        fullDate: d
      });
    }
    return arr;
  }, [n]);
}

// --- COMPONENT SEAT MAP (Hiển thị ghế từ API) ---
function SeatMap({ seats, selected, onToggle, loading }) {
  if (loading) {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-red-500" />
          <p>Đang tải sơ đồ ghế...</p>
        </div>
    );
  }

  if (!seats || seats.length === 0) {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Film size={48} className="mb-2 opacity-20" />
          <p>Vui lòng chọn suất chiếu để xem sơ đồ ghế</p>
        </div>
    );
  }

  const isAvailable = (status) => status === "Trống" || status === "AVAILABLE";
  const isSelected = (id) => selected.includes(id);

  return (
      <div>
        <div className="bg-gray-800 text-white text-center py-2 rounded mb-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
          Màn hình chiếu
        </div>

        {/* Grid hiển thị ghế - Tự động xuống dòng dựa trên số lượng */}
        <div className="grid grid-cols-10 gap-2 justify-items-center">
          {seats.map((seat, index) => {
            const disabled = !isAvailable(seat.seatStatus);
            const active = isSelected(seat.seatId);

            // --- LOGIC TẠO TÊN GHẾ GIẢ LẬP (A1, A2...) ---
            // Giả sử 10 ghế mỗi hàng (do grid-cols-10)
            const rowLabel = String.fromCharCode(65 + Math.floor(index / 10)); // A, B, C...
            const colLabel = (index % 10) + 1; // 1, 2, 3...
            const seatName = `${rowLabel}${colLabel}`;
            // ----------------------------------------------

            return (
                <button
                    key={seat.seatId}
                    disabled={disabled}
                    onClick={() => onToggle(seat.seatId)}
                    className={`w-9 h-9 rounded-t-lg rounded-b-md text-[10px] font-bold shadow-sm transition-all transform hover:-translate-y-1 ${
                        disabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : active
                                ? "bg-red-600 text-white shadow-red-200 ring-2 ring-red-300 scale-110"
                                : "bg-white border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500"
                    }`}
                    title={`Ghế ${seatName} (ID: ${seat.seatId}) - ${seat.seatStatus}`}
                >
                  {/* Hiển thị Tên ghế thay vì ID */}
                  {seatName}
                </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-6 h-6 rounded bg-white border border-gray-300 shadow-sm"></span>
            Trống
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-6 h-6 rounded bg-red-600 shadow-sm"></span>
            Đang chọn
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-6 h-6 rounded bg-gray-300 shadow-sm"></span>
            Đã đặt
          </div>
        </div>
      </div>
  );
}

// --- MAIN BOOKING COMPONENT ---
const Booking = () => {
  const { movies, isLoading: movieLoading } = useMovieContext();
  const { cinemas } = useCinemaContext(); // Lấy danh sách rạp từ Context
  const { showtimes } = useShowtimeContext(); // Lấy tất cả lịch chiếu

  const location = useLocation();
  const days = useNextDays(7);

  // 1. Lấy phim từ URL
  const selectedMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    const params = new URLSearchParams(location.search);
    const urlMovieId = Number(params.get("movieId"));
    const foundMovie = movies.find((m) => m.id === urlMovieId);
    return foundMovie || movies[0];
  }, [movies, location.search]);

  // State
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedDayKey, setSelectedDayKey] = useState(days[0].key);
  const [selectedShowtime, setSelectedShowtime] = useState(null); // Lưu object suất chiếu đã chọn

  // State Ghế
  const [seats, setSeats] = useState([]); // Danh sách ghế từ API
  const [selectedSeats, setSelectedSeats] = useState([]); // ID các ghế đang chọn
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Set rạp mặc định khi load xong
  useEffect(() => {
    if (cinemas.length > 0 && !selectedCinemaId) {
      setSelectedCinemaId(cinemas[0].cinemaId);
    }
  }, [cinemas]);

  // Reset khi đổi ngày/rạp
  useEffect(() => {
    setSelectedShowtime(null);
    setSeats([]);
    setSelectedSeats([]);
  }, [selectedCinemaId, selectedDayKey]);

  // Lấy thông tin Rạp đang chọn để hiển thị địa chỉ
  const currentCinema = useMemo(
      () => cinemas.find((c) => String(c.cinemaId) === String(selectedCinemaId)),
      [selectedCinemaId, cinemas]
  );

  // --- LỌC SUẤT CHIẾU (ĐÃ CẬP NHẬT LOGIC FIX LỖI) ---
  const availableShowtimes = useMemo(() => {
    if (!selectedMovie || !selectedCinemaId) return [];

    // Tìm object rạp đang chọn để lấy tên rạp (dùng cho fallback so sánh)
    const selectedCinemaObj = cinemas.find(c => String(c.cinemaId) === String(selectedCinemaId));

    // In ra điều kiện lọc hiện tại
    console.group("🔍 Booking Filter Process");
    console.log("🎯 Conditions:", {
      MovieID: selectedMovie.id,
      CinemaID: selectedCinemaId,
      CinemaName: selectedCinemaObj ? selectedCinemaObj.name : "Unknown",
      DateKey: selectedDayKey
    });

    const results = showtimes.filter(st => {
      // 1. Khớp phim (ID hoặc Tên)
      const matchMovie = st.movieId === selectedMovie.id || st.movie === selectedMovie.title;

      // 2. Khớp rạp (QUAN TRỌNG: Thêm logic so sánh Tên vì API showtime có thể thiếu cinemaId)
      let matchCinema = false;
      if (st.cinemaId) {
        // Nếu có ID thì so sánh ID
        matchCinema = String(st.cinemaId) === String(selectedCinemaId);
      } else if (selectedCinemaObj && st.cinema) {
        // Nếu không có ID, so sánh Tên rạp (cắt khoảng trắng, chữ thường)
        matchCinema = st.cinema.trim().toLowerCase() === selectedCinemaObj.name.trim().toLowerCase();
      }

      // 3. Khớp ngày (Xử lý chuỗi ngày an toàn)
      const stDateRaw = st.date;
      const stDate = stDateRaw ? stDateRaw.split("T")[0] : "";
      const matchDate = stDate === selectedDayKey;

      // In chi tiết để debug nếu cần
      // console.log(`Checking ID ${st.id}: Movie(${matchMovie}) Cinema(${matchCinema}) Date(${matchDate})`);

      return matchMovie && matchCinema && matchDate;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));

    console.log("✅ Final Results:", results);
    console.groupEnd();

    return results;
  }, [showtimes, selectedMovie, selectedCinemaId, selectedDayKey, cinemas]); // Thêm cinemas vào dependency


  // --- GỌI API LẤY GHẾ KHI CHỌN SUẤT CHIẾU ---
  const handleSelectShowtime = async (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]); // Reset ghế đang chọn
    setLoadingSeats(true);

    try {
      // Gọi API lấy ghế theo phòng
      const token = localStorage.getItem("token");
      const res = await fetch(`/cinema/seats/room/${showtime.roomId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.code === 0) {
        setSeats(data.result);
      } else {
        setSeats([]);
        alert("Không tải được danh sách ghế.");
      }
    } catch (error) {
      console.error("Lỗi lấy ghế:", error);
      setSeats([]);
    } finally {
      setLoadingSeats(false);
    }
  };

  const toggleSeat = (id) => {
    setSelectedSeats((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Helper: Chuyển đổi ID ghế sang Tên ghế (A1, B2) để hiển thị ở mục tổng kết
  const getSelectedSeatNames = () => {
    return selectedSeats.map(id => {
      const index = seats.findIndex(s => s.seatId === id);
      if (index === -1) return id; // Fallback nếu không tìm thấy
      const rowLabel = String.fromCharCode(65 + Math.floor(index / 10));
      const colLabel = (index % 10) + 1;
      return `${rowLabel}${colLabel}`;
    }).join(", ");
  };

  const total = selectedSeats.length * pricePerSeat;

  if (movieLoading || !selectedMovie) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <Header />

        <div className="container mx-auto px-4 py-8">
          {/* Movie Info Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                  src={selectedMovie.image}
                  alt={selectedMovie.title}
                  className="w-32 h-48 object-cover rounded-xl shadow-lg border-4 border-white/20"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {selectedMovie.title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-white/90">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur">
                     {selectedMovie.duration} phút
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur">
                     {selectedMovie.genre || "Phim chiếu rạp"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: SELECTION */}
            <div className="lg:col-span-1 space-y-5">

              {/* 1. Chọn Rạp */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <div className="flex items-center gap-2 mb-3 text-red-600 font-semibold">
                  <MapPin size={20} /> Chọn rạp chiếu
                </div>
                <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:outline-none font-medium bg-white"
                    value={selectedCinemaId}
                    onChange={(e) => setSelectedCinemaId(e.target.value)}
                >
                  {cinemas.map((c) => (
                      <option key={c.cinemaId} value={c.cinemaId}>
                        {c.name}
                      </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2 px-1">
                  {currentCinema?.address || "Địa chỉ rạp"}
                </p>
              </div>

              {/* 2. Chọn Ngày */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <div className="flex items-center gap-2 mb-3 text-red-600 font-semibold">
                  <Calendar size={20} /> Ngày chiếu
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {days.map((d) => (
                      <button
                          key={d.key}
                          onClick={() => setSelectedDayKey(d.key)}
                          className={`px-2 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                              selectedDayKey === d.key
                                  ? "bg-red-600 text-white border-red-600 shadow-md transform scale-105"
                                  : "bg-white hover:bg-red-50 text-gray-700 border-gray-200"
                          }`}
                      >
                        {d.label}
                      </button>
                  ))}
                </div>
              </div>

              {/* 3. Chọn Suất Chiếu (Hiển thị Phòng) */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <div className="flex items-center gap-2 mb-3 text-red-600 font-semibold">
                  <Clock size={20} /> Suất chiếu
                </div>

                {availableShowtimes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {availableShowtimes.map((st) => (
                          <button
                              key={st.id}
                              onClick={() => handleSelectShowtime(st)}
                              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                                  selectedShowtime?.id === st.id
                                      ? "bg-red-600 text-white border-red-600 shadow-md"
                                      : "bg-white hover:bg-red-50 border-gray-200 text-gray-700"
                              }`}
                          >
                            <span className="text-lg font-bold">{st.startTime.substring(0, 5)}</span>
                            <span className={`text-xs mt-1 ${selectedShowtime?.id === st.id ? "text-red-100" : "text-gray-500"}`}>
                            {st.room} {/* Hiển thị tên phòng (VD: 3D 01) */}
                          </span>
                          </button>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      Không có suất chiếu
                    </div>
                )}
              </div>
            </div>

            {/* CENTER COLUMN: SEAT MAP */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
                <div className="mb-6 flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Chọn ghế ngồi</h2>
                    {selectedShowtime && (
                        <p className="text-gray-500 text-sm mt-1">
                          {currentCinema?.name} • {selectedShowtime.room} • {selectedShowtime.startTime}
                        </p>
                    )}
                  </div>
                </div>

                {/* --- SEAT MAP COMPONENT --- */}
                <SeatMap
                    seats={seats}
                    selected={selectedSeats}
                    onToggle={toggleSeat}
                    loading={loadingSeats}
                />

                {/* --- TOTAL & ACTION --- */}
                {seats.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ghế đang chọn:</p>
                          <p className="text-lg font-bold text-red-600 min-h-[1.75rem]">
                            {/* Hiển thị Tên ghế thay vì ID */}
                            {selectedSeats.length > 0 ? getSelectedSeatNames() : "..."}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Tổng tiền tạm tính:</p>
                          <p className="text-3xl font-bold text-gray-900">{formatVND(total)}</p>
                        </div>
                      </div>

                      <button
                          className="w-full mt-5 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          disabled={selectedSeats.length === 0}
                      >
                        Thanh toán ngay
                      </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
  );
};

export default Booking;