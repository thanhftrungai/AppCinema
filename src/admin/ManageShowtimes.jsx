import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  Monitor,
  Plus,
  Search,
  Loader2,
  MousePointerClick,
  Info,
  AlertTriangle, // Icon cảnh báo
  PlayCircle     // Icon đang chiếu
} from "lucide-react";

// Import các Modal
import CreateShowtimeModal from "./modals/CreateShowtimeModal";
import ShowtimeDetailModal from "./modals/ShowtimeDetailModal";

// Import Context
import { useShowtimeContext } from "../context/ShowtimeContext";
import { useCinemaContext } from "../context/CinemaContext";
import { useRoomContext } from "../context/RoomContext";

export const ManageShowtimes = () => {
  // 1. Lấy dữ liệu từ Context
  const { showtimes, isLoading, refreshShowtimes } = useShowtimeContext();
  const { cinemas } = useCinemaContext();
  const { rooms } = useRoomContext();

  // 2. State quản lý thời gian và bộ lọc
  const [currentDate, setCurrentDate] = useState(new Date());

  // State bộ lọc
  const [filterCinemaId, setFilterCinemaId] = useState("");
  const [filterRoomId, setFilterRoomId] = useState("");
  const [filterMovieName, setFilterMovieName] = useState("");

  // 3. State quản lý Modal
  // Modal tạo mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Modal chi tiết (Sửa/Xóa)
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---

  // Lọc phòng theo rạp đã chọn
  const filteredRoomsForFilter = rooms.filter(room =>
      !filterCinemaId || String(room.cinemaId) === String(filterCinemaId)
  );

  // Lọc danh sách suất chiếu
  const filteredShowtimes = showtimes.filter(showtime => {
    // Nếu chưa chọn Rạp hoặc Phòng -> Không hiển thị gì
    if (!filterCinemaId || !filterRoomId) {
      return false;
    }

    // Lọc theo Rạp
    if (filterCinemaId) {
      const selectedCinema = cinemas.find(c => String(c.cinemaId) === String(filterCinemaId));
      if (selectedCinema && showtime.cinema !== selectedCinema.name) return false;
    }
    // Lọc theo Phòng
    if (filterRoomId) {
      const selectedRoom = rooms.find(r => String(r.roomId) === String(filterRoomId));
      if (selectedRoom && showtime.room !== selectedRoom.name) return false;
    }
    // Lọc theo Tên phim
    if (filterMovieName && !showtime.movie.toLowerCase().includes(filterMovieName.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Tính toán danh sách 7 ngày trong tuần hiện tại
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Bắt đầu từ thứ 2
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // --- HELPER FUNCTIONS ---

  // Hàm refresh dữ liệu sau khi Sửa/Xóa
  const handleDataRefresh = () => {
    if (refreshShowtimes) {
      refreshShowtimes();
    } else {
      window.location.reload();
    }
  };

  // Tính giờ kết thúc (HH:mm)
  const getEndTimeStr = (startTime, durationMinutes) => {
    if(!startTime) return "";
    const [h, m] = startTime.split(":").map(Number);
    const endTotal = h*60 + m + durationMinutes;
    const endH = Math.floor(endTotal / 60) % 24;
    const endM = endTotal % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  const PIXEL_PER_MINUTE = 1.8;

  // Tính vị trí top và height cho thẻ suất chiếu
  const getPositionStyle = (startTime, duration) => {
    if (!startTime) return { top: 0, height: 0 };
    const startHour = 8; // Lịch bắt đầu từ 8h sáng
    const [h, m] = startTime.split(":").map(Number);
    const totalMinutesFromStart = (h - startHour) * 60 + m;

    return {
      top: `${totalMinutesFromStart * PIXEL_PER_MINUTE}px`,
      height: `${duration * PIXEL_PER_MINUTE}px`,
    };
  };

  // So sánh ngày
  const isSameDay = (d1, d2Str) => {
    if (!d1 || !d2Str) return false;
    const d2 = new Date(d2Str);
    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
  };

  // Màu mặc định theo loại phim (Legacy)
  const getMovieColor = (type) => {
    if(type === "3D") return "bg-blue-100 border-blue-300 text-blue-800";
    if(type === "IMAX") return "bg-purple-100 border-purple-300 text-purple-800";
    return "bg-green-100 border-green-300 text-green-800"; // 2D thường
  };

  // --- LOGIC MÀU SẮC & TRẠNG THÁI MỚI ---
  const getShowtimeStatusInfo = (showtime) => {
    // 1. Ưu tiên cao nhất: Trạng thái INACTIVE (Ngừng hoạt động)
    if (showtime.status === "INACTIVE") {
      return {
        className: "bg-red-50 border-red-300 text-red-800",
        icon: <AlertTriangle size={12} className="text-red-600" />,
        label: "Ngừng hoạt động"
      };
    }

    // 2. Xử lý theo thời gian thực
    const now = new Date();
    // Giả sử showtime.date là "YYYY-MM-DD" và showtime.startTime là "HH:mm"
    const startDateTime = new Date(`${showtime.date}T${showtime.startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + showtime.duration * 60000);

    // Case A: Đã chiếu xong (Quá khứ)
    if (now > endDateTime) {
      return {
        className: "bg-gray-100 border-gray-300 text-gray-500 grayscale opacity-80",
        icon: null,
        label: "Đã chiếu"
      };
    }

    // Case B: Đang chiếu (Hiện tại)
    if (now >= startDateTime && now <= endDateTime) {
      return {
        className: "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400 shadow-md z-20",
        icon: <PlayCircle size={12} className="text-amber-700 animate-pulse" />,
        label: "Đang chiếu"
      };
    }

    // Case C: Sắp chiếu (Tương lai) -> Dùng màu theo loại phim
    const defaultColor = getMovieColor(showtime.type);
    return {
      className: defaultColor,
      icon: null,
      label: "Sắp chiếu"
    };
  };

  // --- HANDLERS ---

  // Click vào ô trống trên lịch để Tạo mới
  const handleCellClick = (date, e) => {
    if (e.target !== e.currentTarget) return;

    if (!filterRoomId) {
      alert("Vui lòng chọn 'Phòng chiếu' cụ thể trên bộ lọc để sử dụng tính năng click tạo nhanh!");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const minutesFromStart = clickY / PIXEL_PER_MINUTE;
    const startHour = 8;
    const totalMinutes = (startHour * 60) + minutesFromStart;

    // Làm tròn thời gian đến 5 phút gần nhất
    const h = Math.floor(totalMinutes / 60);
    let m = Math.floor(totalMinutes % 60);
    m = Math.round(m / 5) * 5;
    if (m === 60) m = 55;

    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const dateStr = date.toISOString().split('T')[0];

    setModalInitialData({
      roomId: filterRoomId,
      cinemaId: filterCinemaId,
      showDate: dateStr,
      startTime: timeStr
    });

    setIsCreateModalOpen(true);
  };

  // Mở modal tạo mới bằng nút bấm
  const handleOpenModalManually = () => {
    setModalInitialData(null);
    setIsCreateModalOpen(true);
  }

  // Click vào suất chiếu để xem Chi tiết
  const handleShowtimeClick = (showtime) => {
    setSelectedShowtime(showtime);
    setIsDetailModalOpen(true);
  };

  const today = new Date();

  return (
      <div className="space-y-6 h-screen flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lịch Chiếu Phim</h2>
            <p className="text-sm text-slate-600 mt-1">Sắp xếp trực quan theo thời gian thực</p>
          </div>
          <div className="flex gap-3">
            <button
                onClick={handleOpenModalManually}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} /> Thêm suất chiếu
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Lọc Rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Rạp chiếu <span className="text-red-500">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={filterCinemaId}
                  onChange={(e) => {
                    setFilterCinemaId(e.target.value);
                    setFilterRoomId(""); // Reset phòng khi đổi rạp
                  }}
              >
                <option value="">-- Chọn rạp --</option>
                {cinemas.map(c => (
                    <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lọc Phòng */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Phòng chiếu <span className="text-red-500">*</span></label>
            <div className="relative">
              <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                  className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${!filterCinemaId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={filterRoomId}
                  onChange={(e) => setFilterRoomId(e.target.value)}
                  disabled={!filterCinemaId}
              >
                <option value="">-- Chọn phòng --</option>
                {filteredRoomsForFilter.map(r => (
                    <option key={r.roomId} value={r.roomId}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lọc Tên Phim */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Phim</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                  type="text"
                  placeholder="Tìm tên phim..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filterMovieName}
                  onChange={(e) => setFilterMovieName(e.target.value)}
              />
            </div>
          </div>

          {/* Navigator (Chuyển tuần) */}
          <div className="flex items-center justify-between bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(currentDate.getDate() - 7);
                  setCurrentDate(newDate);
                }}
                className="p-1.5 hover:bg-white rounded-md transition-shadow shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <CalendarIcon size={16} />
              {weekDays.length > 0 && `${weekDays[0].getDate()}/${weekDays[0].getMonth()+1} - ${weekDays[6].getDate()}/${weekDays[6].getMonth()+1}`}
          </span>
            <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(currentDate.getDate() + 7);
                  setCurrentDate(newDate);
                }}
                className="p-1.5 hover:bg-white rounded-md transition-shadow shadow-sm"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
          {isLoading && (
              <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
          )}

          {/* Header Ngày (Thứ 2, Thứ 3...) */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <div className="w-16 border-r border-slate-200 flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200">
              {weekDays.map((date, index) => {
                const isToday = isSameDay(date, today.toISOString());
                return (
                    <div key={index} className={`py-3 text-center ${isToday ? 'bg-blue-50' : ''}`}>
                      <p className="text-xs font-semibold text-slate-500 uppercase">
                        {new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(date)}
                      </p>
                      <p className={`text-lg font-bold mt-1 ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>
                        {date.getDate()}
                      </p>
                    </div>
                );
              })}
            </div>
          </div>

          {/* Body Lịch (Scrollable) */}
          <div className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex min-h-[1200px]">
              {/* Cột Time Axis (8:00 - 23:00) */}
              <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-white z-10 sticky left-0">
                {Array.from({ length: 16 }).map((_, i) => {
                  const hour = i + 8;
                  return (
                      <div key={hour} className="h-[108px] border-b border-slate-100 text-right pr-2 pt-2 relative">
                        <span className="text-xs text-slate-400 font-medium -top-3 relative block">{hour}:00</span>
                      </div>
                  );
                })}
              </div>

              {/* Grid Content */}
              <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200 relative">

                {/* --- MÀN HÌNH CHỜ (Khi chưa chọn rạp/phòng) --- */}
                {/* Đã chỉnh: justify-start và pt-[108px] để hiện ở vị trí 9h */}
                {(!filterCinemaId || !filterRoomId) && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-[108px] bg-white/60 backdrop-blur-sm">
                      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Info className="w-7 h-7 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa chọn Rạp & Phòng</h3>
                        <p className="text-sm text-slate-500">
                          Vui lòng chọn <strong>Rạp chiếu</strong> và <strong>Phòng chiếu</strong> ở thanh công cụ phía trên để quản lý lịch.
                        </p>
                      </div>
                    </div>
                )}

                {/* Dòng kẻ ngang (Background Lines) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="h-[108px] border-b border-slate-100 w-full"></div>
                  ))}
                </div>

                {/* Render các cột ngày và suất chiếu */}
                {weekDays.map((dayDate, dayIndex) => {
                  const dayShowtimes = filteredShowtimes.filter(s => isSameDay(dayDate, s.date));

                  return (
                      <div
                          key={dayIndex}
                          className="relative h-full group hover:bg-slate-50/30 transition-colors cursor-crosshair"
                          onClick={(e) => handleCellClick(dayDate, e)}
                      >
                        {/* Hướng dẫn khi hover vào ô trống */}
                        {filterRoomId && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center z-0">
                                <span className="bg-blue-600/10 text-blue-600 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                                <MousePointerClick size={14} className="inline mr-1"/>
                                Thêm suất chiếu
                                </span>
                            </div>
                        )}

                        {/* Render từng suất chiếu trong ngày */}
                        {dayShowtimes.map((showtime) => {
                          const style = getPositionStyle(showtime.startTime, showtime.duration);
                          const endTimeDisplay = showtime.endTime ? showtime.endTime.substring(0,5) : getEndTimeStr(showtime.startTime, showtime.duration);

                          // Lấy thông tin trạng thái và màu sắc mới
                          const statusInfo = getShowtimeStatusInfo(showtime);

                          return (
                              <div
                                  key={showtime.id}
                                  style={style}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowtimeClick(showtime); // Mở Modal chi tiết
                                  }}
                                  className={`absolute inset-x-1 rounded-md border p-2 text-xs cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between overflow-hidden ${statusInfo.className}`}
                                  title={`${showtime.movie} (${statusInfo.label})`}
                              >
                                <div>
                                  {/* Tên phim + Icon trạng thái */}
                                  <div className="flex justify-between items-start gap-1">
                                    <div className="font-bold truncate text-sm flex-1">{showtime.movie}</div>
                                    {statusInfo.icon && (
                                        <div className="flex-shrink-0 mt-0.5">
                                          {statusInfo.icon}
                                        </div>
                                    )}
                                  </div>

                                  {/* Giờ chiếu */}
                                  <div className="flex items-center gap-1 mt-1 opacity-90">
                                    <Clock size={10} />
                                    <span>{showtime.startTime.substring(0,5)} - {endTimeDisplay}</span>
                                  </div>
                                </div>

                                {/* Thông tin phòng & thời lượng */}
                                <div className="mt-1 border-t border-black/10 pt-1 flex justify-between items-center opacity-80">
                                  <span className="font-semibold truncate pr-1">{showtime.room}</span>
                                  <span>{showtime.duration}p</span>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* --- CÁC MODAL --- */}

        {/* Modal Tạo mới */}
        <CreateShowtimeModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            initialData={modalInitialData}
        />

        {/* Modal Chi tiết (Sửa/Xóa) */}
        <ShowtimeDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            showtime={selectedShowtime}
            onUpdateSuccess={handleDataRefresh}
        />
      </div>
  );
};

export default ManageShowtimes;