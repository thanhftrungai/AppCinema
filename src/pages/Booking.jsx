import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Calendar, Clock, MapPin, CreditCard } from "lucide-react";

// Import Context
import { useMovieContext } from "../context/MovieContext";
import { useCinemaContext } from "../context/CinemaContext";
import { useShowtimeContext } from "../context/ShowtimeContext";
import { useRoomContext } from "../context/RoomContext";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const API_BASE = "/cinema";

const safeParseJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (err) {
    return {};
  }
};

const SeatMap = ({
  seatCount = 50,
  seats = [],
  selected,
  onToggle,
  disabled = [],
}) => {
  const SEATS_PER_ROW = 10;
  const rowLabels = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ];
  const totalSeats = seats.length > 0 ? seats.length : seatCount;
  const totalRows = Math.ceil(totalSeats / SEATS_PER_ROW);

  const renderSeats = () => {
    let grid = [];
    for (let r = 0; r < totalRows; r++) {
      const rowLabel = rowLabels[r] || `R${r + 1}`;
      let rowSeats = [];
      for (let c = 1; c <= SEATS_PER_ROW; c++) {
        const seatIndex = r * SEATS_PER_ROW + (c - 1);
        if (seatIndex >= totalSeats) break;
        const seat = seats[seatIndex];
        const seatCode = seat?.code || `${rowLabel}${c}`;
        const seatId = seat?.id;
        const isDisabled =
          disabled.includes(seatCode) ||
          (seatId && disabled.some((d) => String(d) === String(seatId)));
        const isActive = selected.includes(seatCode);

        rowSeats.push(
          <button
            key={seatCode}
            disabled={isDisabled}
            onClick={() => onToggle(seatCode)}
            className={`w-9 h-9 rounded-t-lg flex items-center justify-center text-xs font-bold border transition-all shadow-sm ${
              isDisabled
                ? "bg-gray-400 text-white cursor-not-allowed border-gray-400"
                : isActive
                ? "bg-red-600 text-white border-red-600 transform scale-110 shadow-md"
                : "bg-white hover:bg-red-50 text-gray-700 border-gray-300"
            }`}
            title={isDisabled ? "Ghế đã bán" : `Ghế ${seatCode}`}
          >
            {seatCode}
          </button>
        );
      }
      grid.push(
        <div key={r} className="flex items-center gap-2 mb-2 justify-center">
          <div className="w-6 text-center font-bold text-gray-500 text-sm">
            {rowLabel}
          </div>
          <div className="flex gap-2">{rowSeats}</div>
          <div className="w-6 text-center font-bold text-gray-500 text-sm">
            {rowLabel}
          </div>
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[350px] flex flex-col items-center">
        <div className="w-full max-w-lg h-2 bg-gray-300 rounded-full mb-1 shadow-sm mx-auto"></div>
        <div className="text-gray-400 text-xs text-center mb-8 uppercase tracking-widest">
          Màn hình chiếu
        </div>
        <div className="pb-4">{renderSeats()}</div>
        <div className="flex justify-center gap-6 mt-4 text-sm border-t pt-4 w-full">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 border rounded bg-white"></span> Trống
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-red-600"></span> Đang chọn
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-400"></span> Đã bán
          </div>
        </div>
      </div>
    </div>
  );
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movies, isLoading: isMovieLoading } = useMovieContext();
  const { cinemas, isLoading: isCinemaLoading } = useCinemaContext();
  const { showtimes, isLoading: isShowtimeLoading } = useShowtimeContext();
  const { rooms, fetchRooms } = useRoomContext();

  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seats, setSeats] = useState([]);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUserLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/users/myInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.result || data);
        }
      } catch (error) {
        console.error("Lỗi Auth:", error);
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!rooms || rooms.length === 0) fetchRooms();
  }, []);

  const selectedMovie = useMemo(() => {
    if (!movies?.length) return null;
    const id = Number(new URLSearchParams(location.search).get("movieId"));
    return movies.find((m) => m.id === id) || null;
  }, [movies, location.search]);

  const movieShowtimes = useMemo(() => {
    if (!selectedMovie || !showtimes) return [];
    return showtimes.filter(
      (st) => st.movie === selectedMovie.title && st.status !== "INACTIVE"
    );
  }, [selectedMovie, showtimes]);

  const availableCinemas = useMemo(() => {
    if (!movieShowtimes.length) return [];
    const cinemaNames = [...new Set(movieShowtimes.map((st) => st.cinema))];
    return cinemas.filter((c) => cinemaNames.includes(c.name));
  }, [movieShowtimes, cinemas]);

  useEffect(() => {
    if (availableCinemas.length > 0 && !selectedCinemaId)
      setSelectedCinemaId(availableCinemas[0].cinemaId);
  }, [availableCinemas, selectedCinemaId]);

  const availableDates = useMemo(() => {
    if (!selectedCinemaId) return [];
    const cinemaName = cinemas.find(
      (c) => String(c.cinemaId) === String(selectedCinemaId)
    )?.name;
    const dates = movieShowtimes
      .filter((st) => st.cinema === cinemaName)
      .map((st) => st.date)
      .sort();
    return [...new Set(dates)];
  }, [movieShowtimes, selectedCinemaId, cinemas]);

  useEffect(() => {
    if (availableDates.length > 0 && !availableDates.includes(selectedDateStr))
      setSelectedDateStr(availableDates[0]);
    else if (availableDates.length === 0) setSelectedDateStr("");
  }, [availableDates, selectedDateStr]);

  const availableShowtimes = useMemo(() => {
    if (!selectedCinemaId || !selectedDateStr) return [];
    const cinemaName = cinemas.find(
      (c) => String(c.cinemaId) === String(selectedCinemaId)
    )?.name;
    return movieShowtimes
      .filter((st) => st.cinema === cinemaName && st.date === selectedDateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [movieShowtimes, selectedCinemaId, selectedDateStr, cinemas]);

  useEffect(() => {
    setSelectedSeats([]);
    setBookedSeats([]);
    if (selectedShowtimeId) fetchBookedTickets(selectedShowtimeId);
  }, [selectedShowtimeId]);

  const fetchBookedTickets = async (showtimeId) => {
    try {
      if (!showtimeId) return;
      const response = await fetch(
        `${API_BASE}/tickets/showtime/${showtimeId}`,
        { method: "GET", headers: getAuthHeader() }
      );
      const data = await safeParseJson(response);
      if (!response.ok) return;
      const tickets = Array.isArray(data) ? data : data.result || [];
      const occupied = tickets
        .map((ticket) => {
          const seatInfo = ticket.seat || ticket.seatResponse || ticket.seatDTO;
          if (seatInfo?.id || seatInfo?.seatId)
            return String(seatInfo.id || seatInfo.seatId);
          if (ticket.seatId) return String(ticket.seatId);
          if (ticket.ticketName && ticket.ticketName.includes("Ghế")) {
            const parts = ticket.ticketName.trim().split(" ");
            return parts[parts.length - 1];
          }
          return null;
        })
        .filter(Boolean);
      setBookedSeats(occupied);
    } catch (error) {
      console.error("Lỗi lấy vé:", error);
    }
  };

  const currentShowtime = useMemo(
    () => showtimes.find((st) => String(st.id) === String(selectedShowtimeId)),
    [showtimes, selectedShowtimeId]
  );
  const currentRoom = useMemo(() => {
    if (!currentShowtime || !rooms.length || !selectedCinemaId) return null;
    return rooms.find(
      (r) =>
        r.name === currentShowtime.room &&
        String(r.cinemaId) === String(selectedCinemaId)
    );
  }, [currentShowtime, rooms, selectedCinemaId]);

  useEffect(() => {
    const loadSeats = async () => {
      const roomId =
        currentShowtime?.roomId || currentRoom?.roomId || currentRoom?.id;
      if (!roomId) {
        setSeats([]);
        return;
      }
      setSeats([]);
      setIsSeatsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/seats/room/${roomId}`, {
          method: "GET",
          headers: getAuthHeader(),
        });
        const data = await safeParseJson(response);
        if (response.ok) {
          const rawSeats = Array.isArray(data) ? data : data.result || [];
          const mappedSeats = rawSeats.map((seat, idx) => ({
            id: seat.seatId || seat.id,
            code: seat.name || seat.seatName || seat.code || `S${idx + 1}`,
          }));
          setSeats(mappedSeats);
        }
      } catch (error) {
        console.error("Lỗi API ghế:", error);
      } finally {
        setIsSeatsLoading(false);
      }
    };
    loadSeats();
  }, [currentShowtime?.roomId, currentRoom?.roomId, currentRoom?.id]);

  const formatVND = (v) => v.toLocaleString("vi-VN") + " đ";
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  // --- HANDLE PAYMENT ---
  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    const userId = userInfo?.userId || userInfo?.id;

    if (!token || !userId) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate("/login", { state: { from: location } });
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế!");
      return;
    }

    setIsProcessing(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      // 1. Tạo Bill
      const billResponse = await fetch(`${API_BASE}/bills`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          paymentMethod: "CREDIT_CARD",
          ticketId: [],
          comboId: [],
          paymentAt: new Date().toISOString(),
        }),
      });
      const billData = await safeParseJson(billResponse);
      if (!billResponse.ok)
        throw new Error(billData.message || "Lỗi tạo hóa đơn");
      const createdBill = billData.result || billData;
      const billId = createdBill.id || createdBill.billId;

      // 2. Tạo Tickets
      for (const seatCode of selectedSeats) {
        const matchedSeat = seats.find((s) => s.code === seatCode);
        const seatId =
          matchedSeat?.id ||
          seatCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        await fetch(`${API_BASE}/tickets`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            ticketId: null,
            userId: userId,
            seatId: seatId,
            ticketName: `${selectedMovie.title} - Ghế ${seatCode}`,
            showtimeId: Number(selectedShowtimeId),
            price: 75000,
            billId: billId,
          }),
        });
      }

      // [QUAN TRỌNG] LƯU LỊCH SỬ VÀO LOCAL STORAGE (Giải pháp thay thế API)
      const newBookingHistory = {
        id: billId,
        movie: selectedMovie.title,
        cinema: cinemas.find(
          (c) => String(c.cinemaId) === String(selectedCinemaId)
        )?.name,
        room: currentRoom?.name,
        datetime: currentShowtime?.startTime
          ? new Date(currentShowtime.startTime).toLocaleString("vi-VN")
          : "N/A",
        seats: selectedSeats,
        total: total,
        paymentAt: new Date().toLocaleString("vi-VN"),
        status: "Thành công",
      };

      const storageKey = `booking_history_${userId}`;
      const currentHistory = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
      currentHistory.unshift(newBookingHistory);
      localStorage.setItem(storageKey, JSON.stringify(currentHistory));

      alert("Đặt vé thành công!");
      navigate("/booking-history");
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert(error.message || "Thanh toán thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  if (
    isMovieLoading ||
    isCinemaLoading ||
    isShowtimeLoading ||
    isUserLoading ||
    !selectedMovie
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  const pricePerSeat = 75000;
  const total = selectedSeats.length * pricePerSeat;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
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
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <label className="font-bold block mb-3 text-gray-800 flex items-center gap-2">
                <MapPin size={18} className="text-red-600" /> Chọn rạp
              </label>
              {availableCinemas.length > 0 ? (
                <select
                  className="w-full border p-3 rounded-lg focus:border-red-500 outline-none font-medium"
                  value={selectedCinemaId}
                  onChange={(e) => setSelectedCinemaId(e.target.value)}
                >
                  {availableCinemas.map((c) => (
                    <option key={c.cinemaId} value={c.cinemaId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-red-500">
                  Phim này chưa có lịch chiếu.
                </p>
              )}
            </div>
            {selectedCinemaId && (
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <label className="font-bold block mb-3 text-gray-800 flex items-center gap-2">
                  <Calendar size={18} className="text-red-600" /> Ngày chiếu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableDates.map((dateStr) => (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`p-2 rounded-lg text-sm border ${
                        selectedDateStr === dateStr
                          ? "bg-red-600 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-bold">
                        {formatDateDisplay(dateStr).split(",")[1]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {selectedDateStr && (
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <label className="font-bold block mb-3 text-gray-800 flex items-center gap-2">
                  <Clock size={18} className="text-red-600" /> Suất chiếu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableShowtimes.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedShowtimeId(st.id)}
                      className={`p-2 rounded-lg text-sm font-semibold border ${
                        selectedShowtimeId === st.id
                          ? "bg-red-600 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {st.startTime.substring(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            {selectedShowtimeId ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border h-fit">
                <div className="mb-4 border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-800">Sơ đồ ghế</h2>
                  <p className="text-gray-500 text-sm">
                    {formatDateDisplay(currentShowtime?.date)} -{" "}
                    {currentShowtime?.startTime.substring(0, 5)} • Phòng{" "}
                    {currentShowtime?.room}
                  </p>
                </div>
                {isSeatsLoading ? (
                  <div className="text-center py-10">
                    <Loader2 className="animate-spin inline mr-2" /> Đang tải...
                  </div>
                ) : (
                  <SeatMap
                    seatCount={currentRoom ? currentRoom.seatCount : 50}
                    seats={seats}
                    selected={selectedSeats}
                    onToggle={(code) =>
                      setSelectedSeats((prev) =>
                        prev.includes(code)
                          ? prev.filter((s) => s !== code)
                          : [...prev, code]
                      )
                    }
                    disabled={bookedSeats}
                  />
                )}
                <div className="mt-8 bg-gray-50 p-5 rounded-xl border flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Ghế chọn:{" "}
                      <b className="text-black">
                        {selectedSeats.join(", ") || "---"}
                      </b>
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatVND(total)}
                    </p>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={!selectedSeats.length || isProcessing}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isProcessing ? "Đang xử lý..." : "Thanh toán"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-10 flex flex-col items-center justify-center h-full text-center text-gray-400">
                <Clock size={40} className="mb-4" />
                <h3>Vui lòng chọn suất chiếu</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
