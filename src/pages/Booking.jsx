import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
// Import Layout & Context
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useMovieContext } from "../context/MovieContext";
import { useCinemaContext } from "../context/CinemaContext";

// --- HELPERS & DATA TĨNH ---
const times = ["10:00", "12:30", "15:00", "17:30", "20:00", "22:15"];
const pricePerSeat = 75000;

// Tạo danh sách 7 ngày tới
function useNextDays(n = 7) {
  return useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      arr.push({
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("vi-VN", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
      });
    }
    return arr;
  }, [n]);
}

function formatVND(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

// --- COMPONENT SƠ ĐỒ GHẾ ---
function SeatMap({ selected, onToggle, disabled = [] }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div>
      <div className="bg-gray-800 text-white text-center py-2 rounded mb-4 shadow-inner">
        Màn hình
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))" }}
      >
        <div></div>
        {cols.map((c) => (
          <div key={`h-${c}`} className="text-center text-xs text-gray-500">
            {c}
          </div>
        ))}
        {rows.map((r) => (
          <React.Fragment key={r}>
            <div className="flex items-center justify-center text-sm font-bold text-gray-700">
              {r}
            </div>
            {cols.map((c) => {
              const code = `${r}${c}`;
              const isDisabled = disabled.includes(code);
              const isActive = selected.includes(code);
              return (
                <button
                  key={code}
                  disabled={isDisabled}
                  onClick={() => onToggle(code)}
                  className={`h-9 rounded flex items-center justify-center text-xs font-bold border transition-all ${
                    isDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isActive
                      ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
                      : "bg-white hover:bg-red-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {/* Chú thích ghế */}
      <div className="flex justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border rounded bg-white"></span> Trống
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-600"></span> Đang chọn
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-200"></span> Đã đặt
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
const Booking = () => {
  const { movies, isLoading: isMovieLoading } = useMovieContext();
  const { cinemas, isLoading: isCinemaLoading } = useCinemaContext();
  const location = useLocation();
  const days = useNextDays(7);

  // 1. Lấy phim từ URL
  const selectedMovie = useMemo(() => {
    if (!movies?.length) return null;
    const id = Number(new URLSearchParams(location.search).get("movieId"));
    return movies.find((m) => m.id === id) || movies[0];
  }, [movies, location.search]);

  // 2. State quản lý lựa chọn
  const [userCinemaId, setUserCinemaId] = useState(""); // Rạp user tự chọn
  const [dayKey, setDayKey] = useState(days[0].key);
  const [time, setTime] = useState(times[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 3. Derived State: Tính toán rạp đang hiển thị (Fix lỗi useEffect)
  // Nếu user chưa chọn -> lấy rạp đầu tiên trong list
  const activeCinemaId = userCinemaId || cinemas[0]?.cinemaId || "";

  const currentCinema = useMemo(
    () => cinemas.find((c) => c.cinemaId === activeCinemaId),
    [cinemas, activeCinemaId]
  );

  // 4. Giả lập ghế đã đặt (Dựa trên phim, rạp, ngày, giờ)
  const disabledSeats = useMemo(() => {
    const seed = (
      String(selectedMovie?.id || 0) +
      String(activeCinemaId) +
      dayKey +
      time
    ).length;
    const list = [];
    ["A", "B", "C", "D", "E", "F", "G"].forEach((r, idx) => {
      const col = ((seed + idx) % 10) + 1;
      list.push(`${r}${col}`);
    });
    return list;
  }, [selectedMovie, activeCinemaId, dayKey, time]);

  // Handlers
  const handleToggleSeat = (code) => {
    setSelectedSeats((prev) =>
      prev.includes(code) ? prev.filter((s) => s !== code) : [...prev, code]
    );
  };

  const handleCinemaChange = (e) => {
    setUserCinemaId(e.target.value);
    setSelectedSeats([]); // Reset ghế khi đổi rạp
  };

  // Render Loading
  if (isMovieLoading || isCinemaLoading || !selectedMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  // Render Empty (nếu không có rạp)
  if (!cinemas.length)
    return <div className="p-10 text-center">Không có rạp nào hoạt động.</div>;

  const total = selectedSeats.length * pricePerSeat;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Banner Phim */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl shadow-xl p-6 mb-8 text-white flex gap-6 items-center">
          <img
            src={selectedMovie.image}
            alt={selectedMovie.title}
            className="w-24 h-36 object-cover rounded-lg shadow-md border-2 border-white/20"
          />
          <div>
            <h1 className="text-3xl font-bold">{selectedMovie.title}</h1>
            <p className="opacity-90 mt-2 text-sm">
              {selectedMovie.duration} • {selectedMovie.types?.join(", ")} •{" "}
              {selectedMovie.age}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Bộ lọc */}
          <div className="lg:col-span-1 space-y-6">
            {/* Chọn Rạp */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <label className="font-bold block mb-3 text-gray-800">
                Chọn rạp
              </label>
              <select
                className="w-full border p-3 rounded-lg focus:border-red-500 outline-none"
                value={activeCinemaId}
                onChange={handleCinemaChange}
              >
                {cinemas.map((c) => (
                  <option key={c.cinemaId} value={c.cinemaId}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2 truncate">
                📍 {currentCinema?.address}
              </p>
            </div>

            {/* Chọn Ngày */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <label className="font-bold block mb-3 text-gray-800">
                Ngày chiếu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {days.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDayKey(d.key)}
                    className={`p-2 rounded-lg text-sm border ${
                      dayKey === d.key
                        ? "bg-red-600 text-white border-red-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-xs opacity-75">
                      {d.label.split(" ")[0]}
                    </div>
                    <div className="font-bold">{d.label.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Giờ */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <label className="font-bold block mb-3 text-gray-800">
                Suất chiếu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`p-2 rounded-lg text-sm font-semibold border ${
                      time === t
                        ? "bg-red-600 text-white border-red-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Sơ đồ ghế & Thanh toán */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border h-fit">
            <div className="mb-4 flex justify-between items-end border-b pb-4">
              <h2 className="text-xl font-bold">Sơ đồ ghế</h2>
              <div className="text-right text-sm">
                <span className="font-semibold block">
                  {currentCinema?.name}
                </span>
                <span className="text-gray-500">
                  {days.find((d) => d.key === dayKey)?.label} - {time}
                </span>
              </div>
            </div>

            <SeatMap
              selected={selectedSeats}
              onToggle={handleToggleSeat}
              disabled={disabledSeats}
            />

            {/* Footer Thanh toán */}
            <div className="mt-8 bg-gray-50 p-5 rounded-xl border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">
                  Ghế chọn:{" "}
                  <b className="text-black">
                    {selectedSeats.join(", ") || "---"}
                  </b>
                </span>
                <span className="text-gray-600">
                  Giá: <b>{formatVND(pricePerSeat)}</b>
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Tổng cộng</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatVND(total)}
                  </p>
                </div>
                <button
                  disabled={!selectedSeats.length}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
