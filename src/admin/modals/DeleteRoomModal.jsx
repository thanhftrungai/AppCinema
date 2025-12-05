import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRoomContext } from "../../context/RoomContext";

const DeleteRoomModal = ({ isOpen, onClose, onSuccess, roomData }) => {
    const { deleteRoom } = useRoomContext(); // Lấy hàm delete từ context
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteRoom(roomData.roomId);
            onSuccess(); // Refresh list
            onClose();   // Close modal
        } catch (err) {
            setError(err.response?.data?.message || "Không thể xóa phòng này (có thể đang có lịch chiếu).");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden border-t-4 border-red-500">

                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">Xóa phòng chiếu?</h3>

                    <p className="text-slate-600 mb-6 text-sm">
                        Bạn có chắc muốn xóa phòng <strong>{roomData?.name}</strong>?<br/>
                        Hành động này không thể hoàn tác.
                    </p>

                    {error && (
                        <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded text-left">
                            Lỗi: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Xóa ngay"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DeleteRoomModal;