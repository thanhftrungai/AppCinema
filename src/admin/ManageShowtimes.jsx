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
} from "lucide-react";

export const ManageShowtimes = () => {
  // Helper: Tạo ngày động theo tuần hiện tại để dữ liệu mẫu luôn hiển thị đúng
  const getDynamicDate = (dayOffset) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (CN) -> 6 (T7)
    // Tính khoảng cách tới Thứ 2 đầu tuần
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + distanceToMonday + dayOffset);

    // Format YYYY-MM-DD
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 1. Dữ liệu mẫu (Sử dụng hàm getDynamicDate để ngày luôn khớp với tuần thực tế)
  const [showtimes] = useState([
    {
      id: 1,
      movie: "Avatar 3",
      cinema: "CGV Vincom",
      room: "Phòng 1",
      date: getDynamicDate(0), // Thứ 2 tuần này
      startTime: "09:00",
      duration: 180,
      type: "2D",
    },
    {
      id: 2,
      movie: "Fast & Furious 11",
      cinema: "CGV Vincom",
      room: "Phòng 1",
      date: getDynamicDate(0), // Thứ 2 tuần này
      startTime: "13:00",
      duration: 135,
      type: "IMAX",
    },
    {
      id: 3,
      movie: "The Batman 2",
      cinema: "CGV Vincom",
      room: "Phòng 1",
      date: getDynamicDate(1), // Thứ 3 tuần này
      startTime: "10:30",
      duration: 160,
      type: "2D",
    },
    {
      id: 4,
      movie: "Avatar 3",
      cinema: "CGV Vincom",
      room: "Phòng 1",
      date: getDynamicDate(1), // Thứ 3 tuần này
      startTime: "19:00",
      duration: 180,
      type: "3D",
    },
    {
      id: 5,
      movie: "Doraemon",
      cinema: "CGV Vincom",
      room: "Phòng 1",
      date: getDynamicDate(2), // Thứ 4 tuần này
      startTime: "08:30",
      duration: 90,
      type: "2D",
    },
  ]);

  // 2. State quản lý thời gian: Sử dụng ngày hiện tại thực tế
  const [currentDate, setCurrentDate] = useState(new Date());

  // Tính toán weekDays (Các ngày trong tuần)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    // Điều chỉnh để tuần bắt đầu từ Thứ 2 (Monday)
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // Hàm tiện ích: Tính toán thời gian kết thúc
  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes + durationMinutes);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm tiện ích: Tính toán vị trí top và height cho block
  const getPositionStyle = (startTime, duration) => {
    if (!startTime) return { top: 0, height: 0 };
    const startHour = 8; // Lịch bắt đầu từ 8:00 sáng
    const [h, m] = startTime.split(":").map(Number);
    const totalMinutesFromStart = (h - startHour) * 60 + m;

    const PIXEL_PER_MINUTE = 1.8;

    return {
      top: `${totalMinutesFromStart * PIXEL_PER_MINUTE}px`,
      height: `${duration * PIXEL_PER_MINUTE}px`,
    };
  };

  // So sánh ngày (bỏ qua giờ) an toàn
  const isSameDay = (d1, d2Str) => {
    if (!d1 || !d2Str) return false;
    const d2 = new Date(d2Str);
    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
  };

  const getMovieColor = (type) => {
    switch (type) {
      case "IMAX": return "bg-purple-100 border-purple-300 text-purple-800";
      case "3D": return "bg-blue-100 border-blue-300 text-blue-800";
      default: return "bg-green-100 border-green-300 text-green-800";
    }
  };

  // Ngày hiện tại (để highlight)
  const today = new Date();

  return (
      <div className="space-y-6 h-screen flex flex-col">
        {/* 1. HEADER & ACTIONS */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lịch Chiếu Phim</h2>
            <p className="text-sm text-slate-600 mt-1">
              Sắp xếp trực quan theo thời gian thực
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Filter size={18} /> Bộ lọc nâng cao
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Plus size={18} /> Thêm suất chiếu
            </button>
          </div>
        </div>

        {/* 2. FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
              Rạp chiếu
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white">
                <option>CGV Vincom Center</option>
                <option>Lotte Cinema</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
              Phòng chiếu
            </label>
            <div className="relative">
              <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white">
                <option>Phòng 01 (IMAX)</option>
                <option>Phòng 02 (Standard)</option>
                <option>Phòng 03 (Gold Class)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
              Phim
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white">
                <option>Tất cả phim</option>
                <option>Avatar 3</option>
                <option>Fast & Furious 11</option>
              </select>
            </div>
          </div>

          {/* Date Navigator */}
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
              {weekDays.length > 0 &&
                  `${weekDays[0].toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})} - ${weekDays[6].toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}`
              }
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

        {/* 3. CALENDAR GRID */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Header Ngày */}
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

              {/* Cột Time Axis */}
              <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-white z-10 sticky left-0">
                {Array.from({ length: 16 }).map((_, i) => {
                  const hour = i + 8;
                  return (
                      <div key={hour} className="h-[108px] border-b border-slate-100 text-right pr-2 pt-2 relative">
                    <span className="text-xs text-slate-400 font-medium -top-3 relative block">
                      {hour}:00
                    </span>
                      </div>
                  );
                })}
              </div>

              {/* Grid Content */}
              <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200 relative">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="h-[108px] border-b border-slate-100 w-full"></div>
                  ))}
                </div>

                {weekDays.map((dayDate, dayIndex) => {
                  const dayShowtimes = showtimes.filter(s => isSameDay(dayDate, s.date));

                  return (
                      <div key={dayIndex} className="relative h-full group hover:bg-slate-50/50 transition-colors">
                        {dayShowtimes.map((showtime) => {
                          const style = getPositionStyle(showtime.startTime, showtime.duration);
                          const endTime = getEndTime(showtime.startTime, showtime.duration);
                          const colorClass = getMovieColor(showtime.type);

                          return (
                              <div
                                  key={showtime.id}
                                  style={style}
                                  className={`absolute inset-x-1 rounded-md border p-2 text-xs cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all z-10 flex flex-col justify-between overflow-hidden ${colorClass}`}
                                  title={`${showtime.movie} (${showtime.startTime} - ${endTime})`}
                              >
                                <div>
                                  <div className="font-bold truncate text-sm">{showtime.movie}</div>
                                  <div className="flex items-center gap-1 mt-1 opacity-90">
                                    <Clock size={10} />
                                    <span>{showtime.startTime} - {endTime}</span>
                                  </div>
                                </div>

                                <div className="mt-1 border-t border-black/10 pt-1 flex justify-between items-center opacity-80">
                                  <span className="font-semibold">{showtime.type}</span>
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
      </div>
  );
};

export default ManageShowtimes;