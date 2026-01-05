import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Loader2, ChevronDown, ChevronUp, MapPin, Lock, ArrowRight } from "lucide-react";

// Import các Context (Giữ nguyên)
import { useMovieContext } from "../context/MovieContext";
import { useShowtimeContext } from "../context/ShowtimeContext";
import { useCinemaContext } from "../context/CinemaContext";
import { useSeatContext } from "../context/SeatContext";
import { useBillContext } from "../context/BillContext";
import { useTicketContext } from "../context/TicketContext";

const pricePerSeat = 75000;
function formatVND(v) { return v.toLocaleString("vi-VN") + " đ"; }
const getCinemaId = (c) => c.cinemaId || c.id || c._id;
const getNext7Days = () => {
  const days = []; const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    days.push(d.toLocaleDateString('en-CA'));
  }
  return days;
};

// --- SEAT MAP COMPONENT (Giữ nguyên không đổi) ---
function SeatMap({ seatDataFromDB, selectedIds, bookedSeatIds = [], onToggle, isDisabled }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = Array.from({ length: 17 }, (_, i) => i + 1);

  return (
      <div className={`overflow-x-auto pb-4 ${isDisabled ? "opacity-60 pointer-events-none" : ""}`}>
        <div className="min-w-[800px]">
          <div className="bg-gray-800 text-white text-center py-2 rounded mb-8 shadow-lg w-3/4 mx-auto">Màn hình</div>
          <div className="grid gap-y-3 gap-x-1" style={{ gridTemplateColumns: "30px repeat(17, minmax(0, 1fr))" }}>
            <div></div>
            {cols.map((c) => (<div key={`head-${c}`} className="text-center text-xs font-bold text-gray-400">{c}</div>))}

            {rows.map((rLabel, rIndex) => (
                <React.Fragment key={rLabel}>
                  <div className="flex items-center justify-center font-bold text-gray-600">{rLabel}</div>
                  {cols.map((cNum, cIndex) => {
                    const flatIndex = (rIndex * 17) + cIndex;
                    const seatInfo = seatDataFromDB[flatIndex];
                    if (!seatInfo) return <div key={`${rLabel}-${cNum}`} className="bg-transparent"></div>;

                    const currentSeatId = seatInfo.seatId;
                    const isSold = Array.isArray(bookedSeatIds) && bookedSeatIds.includes(currentSeatId);
                    const isUnavailable = seatInfo.seatStatus !== "Trống";
                    const isBooked = isSold || isUnavailable;
                    const isSelected = selectedIds.includes(currentSeatId);

                    return (
                        <button key={currentSeatId} type="button" disabled={isBooked}
                                onClick={() => onToggle(currentSeatId, rLabel + cNum)}
                                className={`h-8 w-full rounded-t-md text-[10px] font-bold border-b-2 flex items-center justify-center transition-all duration-150 ${
                                    isBooked ? "bg-gray-400 border-gray-500 text-white cursor-not-allowed"
                                        : isSelected ? "bg-red-600 border-red-800 text-white -translate-y-1 shadow-md"
                                            : "bg-white border-gray-300 text-gray-600 hover:-translate-y-1 hover:border-red-400"
                                }`}
                        >
                          {isBooked ? <Lock className="w-3 h-3" /> : `${rLabel}${cNum}`}
                        </button>
                    );
                  })}
                </React.Fragment>
            ))}
          </div>
        </div>
      </div>
  );
}

// --- MAIN COMPONENT ---
const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Contexts
  const { movies } = useMovieContext();
  const { showtimes, fetchShowtimes } = useShowtimeContext();
  const { cinemas } = useCinemaContext();
  const { seats: dbSeats, fetchSeatsByRoom, resetSeatState } = useSeatContext();
  const { createBill, currentBill, clearCurrentBill } = useBillContext();
  const { createSingleTicket, deleteTicket, getTicketsByShowtime } = useTicketContext();

  // UI States
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Booking States
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [selectedSeatNames, setSelectedSeatNames] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);

  // Queue & Refs
  const seatTicketMapRef = useRef({});
  const pendingQueue = useRef([]);
  const isProcessingQueue = useRef(false);
  const [isInitializingBill, setIsInitializingBill] = useState(false);

  // --- 👇 [LOGIC MỚI] USER & AUTHENTICATION 👇 ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Trạng thái đang check user

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // 1. Nếu đã có trong LocalStorage thì dùng luôn
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setAuthLoading(false);
        return;
      }

      // 2. Nếu chưa có User nhưng có Token -> Gọi API lấy Info
      if (token) {
        try {
          const response = await fetch("https://cinema-web-mme8.onrender.com/cinema/users/myInfo", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const data = await response.json();
            // Data trả về là object user: { userId: 1, username: "admin", ... }
            // Hoặc nếu nó bọc trong result thì dùng data.result
            const userData = data.result || data;

            console.log("Fetched User Info:", userData); // Debug

            // Lưu lại để lần sau đỡ phải gọi API
            localStorage.setItem("user", JSON.stringify(userData));
            setCurrentUser(userData);
          } else {
            console.error("Token hết hạn hoặc không hợp lệ");
            // localStorage.removeItem("token"); // Tùy chọn: xóa token nếu lỗi
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      }
      setAuthLoading(false);
    };

    fetchUserInfo();
  }, []);

  // Lấy userId an toàn
  const currentUserId = currentUser ? (currentUser.userId || currentUser.id) : null;

  // Chuyển hướng nếu load xong mà vẫn không có user
  useEffect(() => {
    if (!authLoading && !currentUserId) {
      // Chỉ alert nếu người dùng cố thao tác, hoặc redirect ngay khi vào trang (tùy bạn)
      // Ở đây mình để redirect ngay
      const timer = setTimeout(() => {
        alert("Phiên đăng nhập hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại!");
        navigate("/login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authLoading, currentUserId, navigate]);

  // --- [HẾT LOGIC MỚI] ---

  const selectedMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    const params = new URLSearchParams(location.search);
    const urlMovieId = params.get("movieId");
    return movies.find((m) => String(m.id) === String(urlMovieId)) || movies[0];
  }, [movies, location.search]);

  useEffect(() => { fetchShowtimes(); }, [fetchShowtimes]);

  const availableCinemas = useMemo(() => cinemas?.filter(c => c.status === 'ACTIVE') || [], [cinemas]);
  const next7Days = useMemo(() => getNext7Days(), []);

  const availableTimes = useMemo(() => {
    if (!selectedMovie || !selectedCinemaId || !selectedDate || !showtimes) return [];
    const currentCinemaObj = cinemas.find(c => String(getCinemaId(c)) === String(selectedCinemaId));
    if (!currentCinemaObj) return [];
    const targetMovie = (selectedMovie.title || "").trim().toLowerCase().normalize('NFC');
    const targetCinema = (currentCinemaObj.name || "").trim().toLowerCase().normalize('NFC');
    return showtimes.filter((s) => {
      const sMovie = String(s.movie || "").trim().toLowerCase().normalize('NFC');
      const sCinema = String(s.cinema || "").trim().toLowerCase().normalize('NFC');
      const sDate = String(s.date || "");
      return sMovie === targetMovie && (sCinema.includes(targetCinema) || targetCinema.includes(sCinema)) && sDate === selectedDate;
    }).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  }, [showtimes, selectedMovie, selectedCinemaId, selectedDate, cinemas]);

  const handleReset = () => {
    resetSeatState();
    clearCurrentBill();
    setSelectedSeatIds([]);
    setSelectedSeatNames([]);
    setBookedSeatIds([]);
    seatTicketMapRef.current = {};
    pendingQueue.current = [];
    isProcessingQueue.current = false;
    localStorage.removeItem("activeBillId");
  };

  useEffect(() => { setSelectedDate(""); setSelectedShowtimeId(""); handleReset(); }, [selectedCinemaId]);
  useEffect(() => { setSelectedShowtimeId(""); handleReset(); }, [selectedDate]);

  // --- INIT TRANSACTION ---
  useEffect(() => {
    let isActive = true;
    const initializeTransaction = async () => {
      handleReset();
      if (!selectedShowtimeId) return;

      // Chờ Auth check xong mới chạy logic tạo bill
      if (authLoading) return;

      if (!currentUserId) {
        // Đã xử lý redirect ở useEffect trên
        return;
      }

      setIsInitializingBill(true);
      try {
        const showtimeObj = availableTimes.find(s => s.id === selectedShowtimeId);
        if (!showtimeObj || !showtimeObj.roomId) throw new Error("Suất chiếu lỗi");

        const [_, soldTickets] = await Promise.all([
          fetchSeatsByRoom(showtimeObj.roomId),
          getTicketsByShowtime(selectedShowtimeId)
        ]);

        if (isActive) {
          const soldIds = Array.isArray(soldTickets) ? soldTickets.map(t => t.seatId || (t.seat ? t.seat.seatId : null)).filter(Boolean) : [];
          setBookedSeatIds(soldIds);

          const newBillPayload = { userId: currentUserId, paymentMethod: "", ticketId: [], comboId: [], paymentAt: "" };
          const createdBill = await createBill(newBillPayload);

          if (createdBill && createdBill.result) {
            const bId = createdBill.result.billId || createdBill.result.id;
            localStorage.setItem("activeBillId", bId);
          }
        }
      } catch (error) {
        console.error("Init error:", error);
        if (isActive) setSelectedShowtimeId("");
      } finally {
        if (isActive) setIsInitializingBill(false);
      }
    };
    initializeTransaction();
    return () => { isActive = false; };
  }, [selectedShowtimeId, currentUserId, authLoading]); // Thêm authLoading vào dependency

  // --- QUEUE PROCESSOR (Giữ nguyên) ---
  const processQueue = async () => {
    if (isProcessingQueue.current || pendingQueue.current.length === 0) return;
    isProcessingQueue.current = true;
    const task = pendingQueue.current[0];
    try {
      if (!currentBill) throw new Error("No bill");
      const billId = currentBill.billId || currentBill.id;

      if (task.type === 'ADD') {
        const ticketPayload = { userId: currentUserId, seatId: task.seatId, ticketName: `Vé ${task.seatName}`, showtimeId: selectedShowtimeId, price: pricePerSeat, billId: billId };
        const createdTicket = await createSingleTicket(ticketPayload);
        const newTicketId = createdTicket ? (createdTicket.ticketId || createdTicket.id) : null;
        if (newTicketId) seatTicketMapRef.current[task.seatId] = newTicketId;
      } else if (task.type === 'REMOVE') {
        const ticketIdToDelete = seatTicketMapRef.current[task.seatId];
        if (ticketIdToDelete) {
          await deleteTicket(ticketIdToDelete);
          delete seatTicketMapRef.current[task.seatId];
        }
      }
      pendingQueue.current.shift();
    } catch (error) {
      if (task.type === 'ADD') {
        setSelectedSeatIds(prev => prev.filter(id => id !== task.seatId));
        setSelectedSeatNames(prev => prev.filter(name => name !== task.seatName));
      }
      pendingQueue.current.shift();
    } finally {
      isProcessingQueue.current = false;
      if (pendingQueue.current.length > 0) processQueue();
    }
  };

  const handleToggleSeat = (seatId, seatName) => {
    if (isInitializingBill || !currentBill) return;
    const isSelected = selectedSeatIds.includes(seatId);
    if (isSelected) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seatId));
      setSelectedSeatNames(prev => prev.filter(name => name !== seatName));
      pendingQueue.current.push({ type: 'REMOVE', seatId, seatName });
    } else {
      setSelectedSeatIds(prev => [...prev, seatId]);
      setSelectedSeatNames(prev => [...prev, seatName]);
      pendingQueue.current.push({ type: 'ADD', seatId, seatName });
    }
    processQueue();
  };

  const handleContinue = () => {
    if (pendingQueue.current.length > 0 || isProcessingQueue.current) {
      alert("Đang xử lý vé...");
      return;
    }
    if (!currentBill) {
      alert("Lỗi: Không tìm thấy hóa đơn. Vui lòng chọn lại suất chiếu.");
      return;
    }
    const billIdToSave = currentBill.billId || currentBill.id;
    localStorage.setItem("activeBillId", String(billIdToSave));
    const total = selectedSeatIds.length * pricePerSeat;
    navigate("/booking/combo", { state: { seatTotal: total, seatNames: selectedSeatNames } });
  };

  const handleSelectCinema = (c) => { setSelectedCinemaId(getCinemaId(c)); setIsCinemaDropdownOpen(false); };
  const currentCinemaName = cinemas?.find(c => String(getCinemaId(c)) === String(selectedCinemaId))?.name;
  const total = selectedSeatIds.length * pricePerSeat;

  // Render Loading khi đang check User hoặc Load phim
  if (authLoading || !selectedMovie) return <div className="min-h-screen flex items-center justify-center gap-2"><Loader2 className="animate-spin text-red-600" /> <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span></div>;

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* UI hiển thị phim */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={selectedMovie.image} alt={selectedMovie.title} className="w-32 h-48 object-cover rounded-xl shadow-lg border-4 border-white/20" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{selectedMovie.title}</h1>
                <p className="opacity-90">{selectedMovie.durationDisplay || "120 phút"} | {selectedMovie.releaseDate}</p>
              </div>
            </div>
          </div>

          {/* Layout chọn Rạp - Ngày - Giờ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative z-30">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">1</span>Chọn Rạp</h3>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsCinemaDropdownOpen(!isCinemaDropdownOpen)} className="w-full p-3 rounded-lg border flex items-center justify-between">
                    <span className="flex items-center gap-2 truncate"><MapPin className="w-4 h-4" />{currentCinemaName || "Vui lòng chọn rạp chiếu"}</span>
                    {isCinemaDropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {isCinemaDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar z-50">
                        {availableCinemas.map(c => (<button key={getCinemaId(c)} onClick={() => handleSelectCinema(c)} className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-50 flex justify-between"><span className="font-medium text-gray-700">{c.name}</span></button>))}
                      </div>
                  )}
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative z-20">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">2</span>Chọn Ngày</h3>
                <div className="grid grid-cols-3 gap-2">
                  {next7Days.map(date => (<button key={date} onClick={() => setSelectedDate(date)} className={`py-2 px-1 rounded-lg text-sm border flex flex-col items-center ${selectedDate === date ? "bg-red-600 text-white" : "bg-white"}`}><span>{new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</span></button>))}
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative z-10">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">3</span>Chọn Giờ</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map(t => (<button key={t.id} onClick={() => setSelectedShowtimeId(t.id)} className={`py-2 rounded-lg text-sm font-bold border-2 ${selectedShowtimeId === t.id ? "border-red-600 bg-red-600 text-white" : "hover:border-red-300"}`}>{t.startTime.slice(0, 5)}</button>))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Sơ đồ ghế</h2>
                  {isInitializingBill && <span className="text-xs text-red-500 animate-pulse ml-2">Đang khởi tạo...</span>}
                </div>
                <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[400px] overflow-hidden">
                  {selectedShowtimeId ? (
                      !isInitializingBill && dbSeats.length > 0 ? (
                          <SeatMap seatDataFromDB={dbSeats} selectedIds={selectedSeatIds} bookedSeatIds={bookedSeatIds} onToggle={handleToggleSeat} isDisabled={isInitializingBill} />
                      ) : <div className="text-gray-400">{isInitializingBill ? <Loader2 className="animate-spin"/> : "Không có dữ liệu ghế"}</div>
                  ) : <p className="text-gray-400">Vui lòng chọn suất chiếu</p>}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-4">
                    <div><p className="text-sm text-gray-600">Ghế chọn:</p><p className="font-bold text-lg text-gray-800">{selectedSeatNames.join(", ")}</p></div>
                    <div className="text-right"><p className="text-sm text-gray-600">Tổng tiền:</p><p className="font-bold text-red-600 text-2xl">{formatVND(total)}</p></div>
                  </div>
                  <button onClick={handleContinue} disabled={selectedSeatIds.length === 0} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 hover:bg-red-700 transition flex items-center justify-center gap-2">
                    TIẾP TỤC CHỌN COMBO <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};
export default Booking;