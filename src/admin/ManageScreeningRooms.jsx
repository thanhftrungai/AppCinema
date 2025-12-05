import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Monitor, Loader2, Building2 } from "lucide-react";
import { useCinemaContext } from "../context/CinemaContext";
import { useRoomContext } from "../context/RoomContext";

// Import Modals
import CreateRoomModal from "./modals/CreateRoomModal";
import EditRoomModal from "./modals/EditRoomModal";
import DeleteRoomModal from "./modals/DeleteRoomModal";

export const ManageScreeningRooms = () => {
  // 1. Context
  const { cinemas } = useCinemaContext();

  // --- SỬA ĐỔI 1: Dùng fetchRooms thay vì fetchRoomsByCinema ---
  const { rooms, isLoading, fetchRooms } = useRoomContext();

  // 2. State
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 3. State quản lý Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);

  // --- HANDLERS ---

  // Khi component load, đảm bảo đã lấy dữ liệu phòng
  useEffect(() => {
    fetchRooms();
  }, []);

  // --- SỬA ĐỔI 2: Khi chọn rạp, CHỈ set ID, KHÔNG gọi API ---
  const handleCinemaChange = (e) => {
    setSelectedCinemaId(e.target.value);
    // Không cần fetchRoomsByCinema(id) nữa vì ta đã có allRooms
  };

  // Callback refresh: Gọi fetchRooms để load lại toàn bộ danh sách
  const handleSuccess = () => {
    fetchRooms();
  };

  // --- SỬA ĐỔI 3: Logic lọc kết hợp (Rạp + Từ khóa) ---
  const filteredRooms = (rooms || []).filter((room) => {
    // Điều kiện 1: Phải thuộc rạp đang chọn (So sánh String để tránh lỗi kiểu số/chữ)
    // Lưu ý: Kiểm tra xem backend trả về là room.cinemaId hay room.cinema.id
    const matchesCinema = selectedCinemaId
        ? String(room.cinemaId) === String(selectedCinemaId)
        : false; // Nếu chưa chọn rạp thì không hiện gì

    // Điều kiện 2: Tìm theo tên
    const matchesSearch = room.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCinema && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 border-green-200";
      case "MAINTENANCE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INACTIVE": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Phòng chiếu</h1>
            <p className="text-slate-600 mt-1">Chọn rạp để xem danh sách phòng</p>
          </div>

          {selectedCinemaId && (
              <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                <Plus size={20} />
                Thêm phòng
              </button>
          )}
        </div>

        {/* --- SELECT CINEMA & SEARCH --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <select
                value={selectedCinemaId}
                onChange={handleCinemaChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="">-- Chọn rạp chiếu --</option>
              {cinemas.map((cinema) => (
                  <option key={cinema.cinemaId} value={cinema.cinemaId}>
                    {cinema.name}
                  </option>
              ))}
            </select>
          </div>

          {selectedCinemaId && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Tìm kiếm phòng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
          )}
        </div>

        {/* --- CONTENT AREA --- */}

        {/* Case 1: Chưa chọn rạp */}
        {!selectedCinemaId && (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-500">Vui lòng chọn rạp để quản lý phòng chiếu</p>
            </div>
        )}

        {/* Case 2: Đang tải */}
        {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-slate-500">Đang tải...</span>
            </div>
        )}

        {/* Case 3: Danh sách phòng */}
        {selectedCinemaId && !isLoading && (
            <>
              {filteredRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                        >
                          <div className="p-5">
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                  <Monitor size={20} className="text-slate-400"/>
                                  {room.name}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 pl-7">Số ghế: <span className="font-semibold text-slate-700">{room.seatCount}</span></p>
                              </div>
                              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(room.status)}`}>
                                {room.status === "ACTIVE" ? "Hoạt động" : room.status}
                              </div>
                            </div>

                            {/* Actions Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-slate-100 mt-2">
                              <button
                                  onClick={() => setEditingRoom(room)}
                                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Edit2 size={16} /> Sửa
                              </button>
                              <button
                                  onClick={() => setDeletingRoom(room)}
                                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Trash2 size={16} /> Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-10 text-slate-500">
                    {/* Hiển thị thông báo chính xác hơn */}
                    Chưa có phòng chiếu nào tại rạp này.
                  </div>
              )}
            </>
        )}

        {/* --- MODALS --- */}
        <CreateRoomModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleSuccess}
            preSelectedCinemaId={selectedCinemaId}
        />

        {editingRoom && (
            <EditRoomModal
                isOpen={!!editingRoom}
                onClose={() => setEditingRoom(null)}
                onSuccess={() => {
                  setEditingRoom(null);
                  handleSuccess();
                }}
                roomData={editingRoom}
            />
        )}

        {deletingRoom && (
            <DeleteRoomModal
                isOpen={!!deletingRoom}
                onClose={() => setDeletingRoom(null)}
                onSuccess={() => {
                  setDeletingRoom(null);
                  handleSuccess();
                }}
                roomData={deletingRoom}
            />
        )}
      </div>
  );
};