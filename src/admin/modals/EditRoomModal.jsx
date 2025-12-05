import React, { useState, useEffect } from "react";
import { X, Save, Loader2, AlertCircle } from "lucide-react";
import { useRoomContext } from "../../context/RoomContext";

const EditRoomModal = ({ isOpen, onClose, onSuccess, roomData }) => {
    const { updateRoom } = useRoomContext(); // Lấy hàm update từ context

    const [formData, setFormData] = useState({
        name: "",
        status: "ACTIVE",
        // seatCount thường không cho sửa trực tiếp ở đây vì liên quan sơ đồ ghế
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load data cũ vào form
    useEffect(() => {
        if (roomData) {
            setFormData({
                name: roomData.name || "",
                status: roomData.status || "ACTIVE",
            });
            setError(null);
        }
    }, [roomData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await updateRoom(roomData.roomId, formData);
            onSuccess(); // Refresh list
            onClose();   // Close modal
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi cập nhật phòng.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">

                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Cập nhật Phòng chiếu</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* Tên phòng */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tên phòng</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="MAINTENANCE">Bảo trì</option>
                            <option value="INACTIVE">Ngưng hoạt động</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRoomModal;