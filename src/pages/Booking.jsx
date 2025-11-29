import React, { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { allMovies } from "../data/movies";

// Mock data for demo
const allMoviesDemo = [
  {
    id: 1,
    title: "Oppenheimer",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    genre: "Drama, History",
    duration: 180,
    rating: "13+",
  },
  {
    id: 2,
    title: "Barbie",
    image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    genre: "Comedy, Adventure",
    duration: 114,
    rating: "T13",
  },
];

const cinemas = [
  { id: "cgv-times", name: "CGV Times City", address: "458 Minh Khai, Hà Nội" },
  {
    id: "bhd-vincom",
    name: "BHD Star Vincom",
    address: "54 Nguyễn Chí Thanh, Hà Nội",
  },
  {
    id: "galaxy-ngu-quyen",
    name: "Galaxy Nguyễn Du",
    address: "116 Nguyễn Du, TP.HCM",
  },
  {
    id: "lotte-go-vap",
    name: "Lotte Gò Vấp",
    address: "242 Nguyễn Văn Lượng, TP.HCM",
  },
];

const times = ["10:00", "12:30", "15:00", "17:30", "20:00", "22:15"];

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

const pricePerSeat = 75000;

function formatVND(v) {
  return v.toLocaleString("vi-VN") + " đ";
}

function SeatMap({ selected, onToggle, disabled = [] }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);
  const isDisabled = (code) => disabled.includes(code);
  const isSelected = (code) => selected.includes(code);

  return (
    <div>
      <div className="bg-gray-800 text-white text-center py-2 rounded mb-4">
        Màn hình
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))" }}
      >
        <div></div>
        {cols.map((c) => (
          <div key={`head-${c}`} className="text-center text-sm text-gray-600">
            {c}
          </div>
        ))}
        {rows.map((r) => (
          <React.Fragment key={r}>
            <div className="flex items-center justify-center text-sm font-semibold text-gray-700">
              {r}
            </div>
            {cols.map((c) => {
              const code = `${r}${c}`;
              const disabledSeat = isDisabled(code);
              const active = isSelected(code);
              return (
                <button
                  key={code}
                  disabled={disabledSeat}
                  onClick={() => onToggle(code)}
                  className={`h-9 rounded flex items-center justify-center text-xs font-medium border transition ${
                    disabledSeat
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                      : active
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-white border border-gray-300 inline-block"></span>{" "}
          Trống
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-600 inline-block"></span> Đang
          chọn
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-200 inline-block"></span> Đã
          đặt
        </div>
      </div>
    </div>
  );
}

const Booking = () => {
  const days = useNextDays(7);
  const params = new URLSearchParams(window.location.search);
  const preselect =
    Number(params.get("movieId")) || allMovies[0]?.id || allMoviesDemo[0].id;
  const [movieId] = useState(preselect);
  const [cinemaId, setCinemaId] = useState(cinemas[0].id);
  const [dayKey, setDayKey] = useState(days[0].key);
  const [time, setTime] = useState(times[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const movie = useMemo(
    () =>
      (allMovies.find
        ? allMovies.find((m) => m.id === Number(movieId))
        : null) || allMoviesDemo.find((m) => m.id === Number(movieId)),
    [movieId]
  );
  const cinema = useMemo(
    () => cinemas.find((c) => c.id === cinemaId),
    [cinemaId]
  );

  const disabledSeats = useMemo(() => {
    const seed = (String(movieId) + cinemaId + dayKey + time).length;
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const list = [];
    rows.forEach((r, idx) => {
      const col = ((seed + idx) % 10) + 1;
      list.push(`${r}${col}`);
    });
    return list;
  }, [movieId, cinemaId, dayKey, time]);

  const toggleSeat = (code) => {
    setSelectedSeats((prev) =>
      prev.includes(code) ? prev.filter((s) => s !== code) : [...prev, code]
    );
  };

  const total = selectedSeats.length * pricePerSeat;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Movie Header Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={movie?.image}
              alt={movie?.title}
              className="w-28 h-40 object-cover rounded-xl shadow-lg border-4 border-white/20"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {movie?.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-white/90">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur">
                  {movie?.genre}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur">
                  {movie?.duration} phút
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur">
                  {movie?.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Selections */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <label className="text-base font-semibold text-gray-900">
                  Chọn rạp
                </label>
              </div>
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:outline-none transition-colors font-medium"
                value={cinemaId}
                onChange={(e) => setCinemaId(e.target.value)}
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-3 flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {cinema?.address}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <label className="text-base font-semibold text-gray-900">
                  Ngày chiếu
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {days.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDayKey(d.key)}
                    className={`px-3 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      dayKey === d.key
                        ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <label className="text-base font-semibold text-gray-900">
                  Suất chiếu
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`px-3 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      time === t
                        ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Seat map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Chọn ghế ngồi
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {cinema?.name} • {days.find((d) => d.key === dayKey)?.label} •{" "}
                  {time}
                </p>
              </div>

              <SeatMap
                selected={selectedSeats}
                onToggle={toggleSeat}
                disabled={disabledSeats}
              />

              <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gray-700">
                    <span className="font-semibold">Ghế đã chọn:</span>{" "}
                    <span className="text-red-600 font-bold">
                      {selectedSeats.length > 0
                        ? selectedSeats.join(", ")
                        : "Chưa chọn ghế nào"}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      Số lượng:{" "}
                      <span className="font-semibold text-gray-900">
                        {selectedSeats.length} ghế
                      </span>
                    </div>
                    <div>
                      Giá vé:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatVND(pricePerSeat)}
                      </span>{" "}
                      / ghế
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                      Tổng thanh toán
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {formatVND(total)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                  disabled={selectedSeats.length === 0}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
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
