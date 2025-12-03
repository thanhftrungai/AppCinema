import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Monitor } from "lucide-react";

export const ManageScreeningRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Phòng 1",
      cinema: "CGV Nguyễn Du",
      capacity: 120,
      type: "2D",
      status: "active",
      rows: 10,
      seatsPerRow: 12,
    },
    {
      id: 2,
      name: "Phòng 2",
      cinema: "CGV Nguyễn Du",
      capacity: 150,
      type: "3D",
      status: "active",
      rows: 12,
      seatsPerRow: 13,
    },
    {
      id: 3,
      name: "Phòng IMAX",
      cinema: "CGV Vincom",
      capacity: 200,
      type: "IMAX",
      status: "maintenance",
      rows: 15,
      seatsPerRow: 14,
    },
    {
      id: 4,
      name: "Phòng VIP",
      cinema: "Lotte Cinema",
      capacity: 80,
      type: "VIP",
      status: "active",
      rows: 8,
      seatsPerRow: 10,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    cinema: "",
    capacity: "",
    type: "2D",
    status: "active",
    rows: "",
    seatsPerRow: "",
  });

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.cinema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.cinema ||
      !formData.capacity ||
      !formData.rows ||
      !formData.seatsPerRow
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingRoom) {
      setRooms(
        rooms.map((room) =>
          room.id === editingRoom.id ? { ...formData, id: room.id } : room
        )
      );
    } else {
      const newId =
        rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
      setRooms([...rooms, { ...formData, id: newId }]);
    }
    resetForm();
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData(room);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng chiếu này?")) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cinema: "",
      capacity: "",
      type: "2D",
      status: "active",
      rows: "",
      seatsPerRow: "",
    });
    setEditingRoom(null);
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "maintenance":
        return "Bảo trì";
      case "inactive":
        return "Ngừng hoạt động";
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "2D":
        return "bg-blue-100 text-blue-800";
      case "3D":
        return "bg-purple-100 text-purple-800";
      case "IMAX":
        return "bg-orange-100 text-orange-800";
      case "VIP":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý Phòng chiếu
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý thông tin phòng chiếu và sức chứa
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Thêm phòng chiếu
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên phòng, rạp, loại phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Monitor size={24} />
                  <h3 className="text-lg font-bold">{room.name}</h3>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                    room.type
                  )}`}
                >
                  {room.type}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-1">{room.cinema}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Sức chứa</p>
                  <p className="text-lg font-bold text-slate-900">
                    {room.capacity}
                  </p>
                  <p className="text-xs text-slate-500">chỗ ngồi</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Cấu hình</p>
                  <p className="text-lg font-bold text-slate-900">
                    {room.rows} x {room.seatsPerRow}
                  </p>
                  <p className="text-xs text-slate-500">hàng x ghế</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    room.status
                  )}`}
                >
                  {getStatusText(room.status)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Monitor size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Không tìm thấy phòng chiếu
          </h3>
          <p className="text-slate-600">
            Thử thay đổi từ khóa tìm kiếm hoặc thêm phòng chiếu mới
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingRoom ? "Chỉnh sửa phòng chiếu" : "Thêm phòng chiếu mới"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tên phòng *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Phòng 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rạp chiếu *
                  </label>
                  <input
                    type="text"
                    value={formData.cinema}
                    onChange={(e) =>
                      setFormData({ ...formData, cinema: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: CGV Nguyễn Du"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Loại phòng *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Số hàng ghế *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.rows}
                    onChange={(e) =>
                      setFormData({ ...formData, rows: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Số ghế mỗi hàng *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.seatsPerRow}
                    onChange={(e) =>
                      setFormData({ ...formData, seatsPerRow: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tổng sức chứa *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 120"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Gợi ý:{" "}
                  {formData.rows && formData.seatsPerRow
                    ? formData.rows * formData.seatsPerRow
                    : 0}{" "}
                  ghế (dựa trên cấu hình)
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingRoom ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
