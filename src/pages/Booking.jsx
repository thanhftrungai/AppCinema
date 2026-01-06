import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Loader2, ChevronDown, ChevronUp, MapPin, Lock, ArrowRight, Ticket } from "lucide-react";

// Import các Context
import { useMovieContext } from "../context/MovieContext";
import { useShowtimeContext } from "../context/ShowtimeContext";
import { useCinemaContext } from "../context/CinemaContext";
import { useSeatContext } from "../context/SeatContext";
import { useBillContext } from "../context/BillContext";
import { useTicketContext } from "../context/TicketContext";

const pricePerSeat = 75000;
function formatVND(v) { return v.toLocaleString("vi-VN") + " đ"; }
const getCinemaId = (c) => c.cinemaId || c.id || c._id;

// Hàm lấy 7 ngày tiếp theo
const getNext7Days = () => {
  const days = []; const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    days.push(d.toLocaleDateString('en-CA')); // YYYY-MM-DD
  }
  return days;
};

// --- SEAT MAP COMPONENT ---
function SeatMap({ seatDataFromDB, selectedIds, bookedSeatIds = [], onToggle, isDisabled }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = Array.from({ length: 17 }, (_, i) => i + 1);

  return (
      <div className={`overflow-x-auto pb-4 ${isDisabled ? "opacity-60 pointer-events-none" : ""}`}>
        <div className="min-w-[800px]">
          <div className="bg-gray-800 text-white text-center py-2 rounded mb-8 shadow-lg w-3/4 mx-auto border-b-4 border-gray-600">
            MÀN HÌNH
          </div>
          <div className="grid gap-y-3 gap-x-1" style={{ gridTemplateColumns: "30px repeat(17, minmax(0, 1fr))" }}>
            <div></div>
            {cols.map((c) => (<div key={`head-${c}`} className="text-center text-xs font-bold text-gray-400">{c}</div>))}

            {rows.map((rLabel, rIndex) => (
                <React.Fragment key={rLabel}>
                  <div className="flex items-center justify-center font-bold text-gray-600">{rLabel}</div>
                  {cols.map((cNum, cIndex) => {
                    const flatIndex = (rIndex * 17) + cIndex;
                    // Lấy thông tin ghế từ DB nếu có, không thì render khoảng trống
                    const seatInfo = seatDataFromDB.find(s => s.row === rLabel && parseInt(s.number) === cNum)
                        || seatDataFromDB[flatIndex];

                    if (!seatInfo) return <div key={`${rLabel}-${cNum}`} className="bg-transparent"></div>;

                    const currentSeatId = seatInfo.seatId || seatInfo.id;
                    const isSold = Array.isArray(bookedSeatIds) && bookedSeatIds.includes(currentSeatId);
                    const isUnavailable = seatInfo.seatStatus !== "Trống" && seatInfo.seatStatus !== "AVAILABLE";
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
          {/* Chú thích ghế */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-white border border-gray-300 rounded"></div><span className="text-sm text-gray-600">Trống</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-red-600 rounded"></div><span className="text-sm text-gray-600">Đang chọn</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-400 rounded"></div><span className="text-sm text-gray-600">Đã đặt</span></div>
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
  const [isSyncing, setIsSyncing] = useState(false); // <--- Trạng thái đang đồng bộ vé (Loading Button)

  // Queue & Refs
  const seatTicketMapRef = useRef({});
  const pendingQueue = useRef([]);
  const isProcessingQueue = useRef(false);
  const [isInitializingBill, setIsInitializingBill] = useState(false);

  // --- USER AUTHENTICATION ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setAuthLoading(false);
        return;
      }

      if (token) {
        try {
          const response = await fetch("/cinema/users/myInfo", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.result || data;
            localStorage.setItem("user", JSON.stringify(userData));
            setCurrentUser(userData);
          } else {
            console.warn("Token không hợp lệ");
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
        }
      }
      setAuthLoading(false);
    };

    fetchUserInfo();
  }, []);

  const currentUserId = currentUser ? (currentUser.userId || currentUser.id) : null;

  useEffect(() => {
    if (!authLoading && !currentUserId) {
      const timer = setTimeout(() => {
        alert("Vui lòng đăng nhập để đặt vé!");
        navigate("/login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authLoading, currentUserId, navigate]);

  // --- LOGIC LẤY PHIM TỪ URL ---
  const selectedMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    const params = new URLSearchParams(location.search);
    const urlMovieId = params.get("movieId");
    return movies.find((m) => String(m.id) === String(urlMovieId)) || movies[0];
  }, [movies, location.search]);

  useEffect(() => { fetchShowtimes(); }, [fetchShowtimes]);

  const availableCinemas = useMemo(() => cinemas?.filter(c => c.status === 'ACTIVE') || [], [cinemas]);
  const next7Days = useMemo(() => getNext7Days(), []);

  // --- LOGIC LỌC SUẤT CHIẾU ---
  const availableTimes = useMemo(() => {
    if (!selectedMovie || !selectedCinemaId || !selectedDate || !showtimes) return [];

    const currentCinemaObj = cinemas.find(c => String(getCinemaId(c)) === String(selectedCinemaId));
    if (!currentCinemaObj) return [];

    const targetMovie = (selectedMovie.title || "").trim().toLowerCase();
    const targetCinema = (currentCinemaObj.name || "").trim().toLowerCase();

    return showtimes.filter((s) => {
      const sMovie = String(s.movie || "").trim().toLowerCase();
      const sCinema = String(s.cinema || "").trim().toLowerCase();
      const sDate = String(s.date || "");
      const isMovieMatch = sMovie === targetMovie || sMovie.includes(targetMovie);
      const isCinemaMatch = sCinema.includes(targetCinema) || targetCinema.includes(sCinema);
      return isMovieMatch && isCinemaMatch && sDate === selectedDate;
    }).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  }, [showtimes, selectedMovie, selectedCinemaId, selectedDate, cinemas]);

  // Hàm Reset trạng thái
  const handleReset = () => {
    if (typeof resetSeatState === 'function') resetSeatState();
    clearCurrentBill();
    setSelectedSeatIds([]);
    setSelectedSeatNames([]);
    setBookedSeatIds([]);
    seatTicketMapRef.current = {};
    pendingQueue.current = [];
    isProcessingQueue.current = false;
    setIsSyncing(false); // Reset loading state
    localStorage.removeItem("activeBillId");
  };

  useEffect(() => { setSelectedDate(""); setSelectedShowtimeId(""); handleReset(); }, [selectedCinemaId]);
  useEffect(() => { setSelectedShowtimeId(""); handleReset(); }, [selectedDate]);

  // --- INIT TRANSACTION ---
  useEffect(() => {
    let isActive = true;
    const initializeTransaction = async () => {
      handleReset();
      if (!selectedShowtimeId || authLoading || !currentUserId) return;

      setIsInitializingBill(true);
      try {
        const showtimeObj = availableTimes.find(s => s.id === selectedShowtimeId);
        if (!showtimeObj) throw new Error("Không tìm thấy thông tin suất chiếu");

        const realRoomId = showtimeObj.roomId
            || (showtimeObj.room ? showtimeObj.room.id : null)
            || (showtimeObj.room ? showtimeObj.room.roomId : null);

        if (!realRoomId) throw new Error("Lỗi dữ liệu: Không tìm thấy ID phòng chiếu");

        const [_, soldTickets] = await Promise.all([
          fetchSeatsByRoom(realRoomId),
          getTicketsByShowtime(selectedShowtimeId)
        ]);

        if (isActive) {
          const soldIds = Array.isArray(soldTickets) ? soldTickets.map(t => {
            return t.seatId || (t.seat ? t.seat.seatId : null) || (t.seat ? t.seat.id : null);
          }).filter(Boolean) : [];

          setBookedSeatIds(soldIds);

          const newBillPayload = {
            userId: currentUserId,
            paymentMethod: "",
            ticketId: [],
            comboId: [],
            paymentAt: ""
          };
          const createdBill = await createBill(newBillPayload);

          if (createdBill && (createdBill.result || createdBill.id)) {
            const bId = createdBill.result ? (createdBill.result.billId || createdBill.result.id) : createdBill.id;
            localStorage.setItem("activeBillId", bId);
          }
        }
      } catch (error) {
        console.error("Init Transaction Error:", error);
        if (isActive) setSelectedShowtimeId("");
      } finally {
        if (isActive) setIsInitializingBill(false);
      }
    };

    initializeTransaction();
    return () => { isActive = false; };
  }, [selectedShowtimeId, currentUserId, authLoading]);

  // --- QUEUE PROCESSOR (Đã tối ưu UX) ---
  const processQueue = async () => {
    if (isProcessingQueue.current || pendingQueue.current.length === 0) {
      // Nếu không còn việc để làm thì tắt loading
      if (pendingQueue.current.length === 0) setIsSyncing(false);
      return;
    }

    isProcessingQueue.current = true;
    setIsSyncing(true); // Bật loading ngay khi bắt đầu xử lý

    const task = pendingQueue.current[0];
    try {
      if (!currentBill) throw new Error("Chưa có hóa đơn (Bill chưa tạo)");

      const billId = currentBill.billId || currentBill.id;

      if (task.type === 'ADD') {
        const ticketPayload = {
          userId: currentUserId,
          seatId: task.seatId,
          ticketName: `Vé ${task.seatName}`,
          showtimeId: selectedShowtimeId,
          price: pricePerSeat,
          billId: billId
        };
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
      console.error("Lỗi xử lý ghế:", error);
      if (task.type === 'ADD') {
        setSelectedSeatIds(prev => prev.filter(id => id !== task.seatId));
        setSelectedSeatNames(prev => prev.filter(name => name !== task.seatName));
      }
      pendingQueue.current.shift();
    } finally {
      isProcessingQueue.current = false;
      // Tiếp tục xử lý nếu còn hàng đợi, ngược lại thì tắt loading
      if (pendingQueue.current.length > 0) {
        processQueue();
      } else {
        setIsSyncing(false); // ✅ Đã xử lý xong hết, tắt loading
      }
    }
  };

  const handleToggleSeat = (seatId, seatName) => {
    if (isInitializingBill || !currentBill) {
      alert("Hệ thống đang khởi tạo đơn hàng, vui lòng chờ giây lát...");
      return;
    }

    // ✅ Bật Syncing ngay khi người dùng click
    setIsSyncing(true);

    const isSelected = selectedSeatIds.includes(seatId);

    if (isSelected) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seatId));
      setSelectedSeatNames(prev => prev.filter(name => name !== seatName));
      pendingQueue.current.push({ type: 'REMOVE', seatId, seatName });
    } else {
      if (selectedSeatIds.length >= 8) {
        alert("Bạn chỉ được chọn tối đa 8 ghế!");
        setIsSyncing(false); // Tắt loading nếu lỗi
        return;
      }
      setSelectedSeatIds(prev => [...prev, seatId]);
      setSelectedSeatNames(prev => [...prev, seatName]);
      pendingQueue.current.push({ type: 'ADD', seatId, seatName });
    }
    processQueue();
  };

  const handleContinue = () => {
    // Không cần alert nữa, vì nút đã bị disable khi isSyncing = true
    if (isSyncing || pendingQueue.current.length > 0) return;

    if (!currentBill) {
      alert("Lỗi phiên làm việc. Vui lòng tải lại trang.");
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

  if (authLoading || !selectedMovie) return (
      <div className="min-h-screen flex items-center justify-center gap-2">
        <Loader2 className="animate-spin text-red-600" />
        <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Banner Phim */}
          <div className="bg-gradient-to-r from-red-900 to-red-600 rounded-2xl shadow-xl p-6 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <img src={selectedMovie.image} alt={selectedMovie.title} className="w-32 h-48 object-cover rounded-lg shadow-lg border-2 border-white/30" />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">{selectedMovie.title}</h1>
                <p className="opacity-90 flex items-center justify-center md:justify-start gap-2">
                  <Ticket size={16}/>
                  {selectedMovie.durationDisplay || "120 phút"} | Khởi chiếu: {selectedMovie.releaseDate}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Chọn Thông Tin */}
            <div className="lg:col-span-4 space-y-4">
              {/* Bước 1: Chọn Rạp */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">1</span>Chọn Rạp</h3>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsCinemaDropdownOpen(!isCinemaDropdownOpen)} className="w-full p-3 rounded-lg border flex items-center justify-between hover:border-red-400 transition">
                    <span className="flex items-center gap-2 truncate font-medium text-gray-700">
                        <MapPin className="w-4 h-4 text-red-500" />
                      {currentCinemaName || "Vui lòng chọn rạp chiếu"}
                    </span>
                    {isCinemaDropdownOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {isCinemaDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                        {availableCinemas.map(c => (
                            <button key={getCinemaId(c)} onClick={() => handleSelectCinema(c)} className="w-full text-left p-3 hover:bg-red-50 border-b border-gray-50 flex justify-between group">
                              <span className="font-medium text-gray-700 group-hover:text-red-600">{c.name}</span>
                            </button>
                        ))}
                      </div>
                  )}
                </div>
              </div>

              {/* Bước 2: Chọn Ngày */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">2</span>Chọn Ngày</h3>
                <div className="grid grid-cols-3 gap-2">
                  {next7Days.map(date => (
                      <button key={date} onClick={() => setSelectedDate(date)}
                              className={`py-2 px-1 rounded-lg text-sm border flex flex-col items-center transition-all ${selectedDate === date ? "bg-red-600 text-white border-red-600 shadow-md" : "bg-white text-gray-600 hover:border-red-300"}`}>
                        <span className="font-bold">{new Date(date).getDate()}/{new Date(date).getMonth() + 1}</span>
                      </button>
                  ))}
                </div>
              </div>

              {/* Bước 3: Chọn Giờ */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">3</span>Chọn Giờ</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.length > 0 ? availableTimes.map(t => (
                      <button key={t.id} onClick={() => setSelectedShowtimeId(t.id)}
                              className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${selectedShowtimeId === t.id ? "border-red-600 bg-red-600 text-white shadow-md scale-105" : "bg-gray-50 border-transparent text-gray-700 hover:border-red-300"}`}>
                        {t.startTime.slice(0, 5)}
                      </button>
                  )) : <p className="col-span-3 text-sm text-gray-400 text-center italic">Không có suất chiếu phù hợp</p>}
                </div>
              </div>
            </div>

            {/* Main Content: Sơ đồ ghế */}
            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span> Sơ đồ ghế
                  </h2>
                  {isInitializingBill && <span className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full animate-pulse"><Loader2 size={12} className="animate-spin"/> Đang tải dữ liệu phòng...</span>}
                </div>

                <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-xl border border-gray-200 min-h-[450px] overflow-hidden relative">
                  {selectedShowtimeId ? (
                      !isInitializingBill && dbSeats.length > 0 ? (
                          <SeatMap seatDataFromDB={dbSeats} selectedIds={selectedSeatIds} bookedSeatIds={bookedSeatIds} onToggle={handleToggleSeat} isDisabled={isInitializingBill} />
                      ) : (
                          <div className="text-center text-gray-400">
                            {isInitializingBill ? <div className="flex flex-col items-center"><Loader2 className="animate-spin w-8 h-8 mb-2 text-red-500"/><p>Đang tải ghế...</p></div> : "Không có dữ liệu ghế cho phòng này"}
                          </div>
                      )
                  ) : (
                      <div className="text-center">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-2"/>
                        <p className="text-gray-400">Vui lòng chọn Suất chiếu để xem sơ đồ ghế</p>
                      </div>
                  )}
                </div>

                {/* Footer Tổng kết */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Ghế đang chọn:</p>
                      <p className="font-bold text-lg text-gray-900 break-words min-h-[1.75rem]">
                        {selectedSeatNames.length > 0 ? selectedSeatNames.join(", ") : <span className="text-gray-300 italic">Chưa chọn ghế</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Tổng tạm tính:</p>
                      <p className="font-bold text-red-600 text-3xl tracking-tight">{formatVND(total)}</p>
                    </div>
                  </div>

                  {/* 👇 NÚT TIẾP TỤC ĐÃ ĐƯỢC CẢI TIẾN UX 👇 */}
                  <button onClick={handleContinue} disabled={selectedSeatIds.length === 0 || isSyncing}
                          className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-lg transition-all
                              ${selectedSeatIds.length === 0 || isSyncing
                              ? "bg-gray-400 text-gray-200 cursor-not-allowed shadow-none"
                              : "bg-red-600 text-white shadow-red-600/30 hover:bg-red-700 active:scale-[0.99]"
                          }`}>
                    {isSyncing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Đang đồng bộ vé...</span>
                        </>
                    ) : (
                        <>
                          TIẾP TỤC CHỌN COMBO <ArrowRight size={20} strokeWidth={2.5} />
                        </>
                    )}
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