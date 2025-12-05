import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

const DeleteCinemaModal = ({ isOpen, onClose, onSuccess, cinema }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");

            // Gọi API Xóa Rạp
            const response = await fetch(`/cinema/cinemas/${cinema.cinemaId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // Kiểm tra status code (200-299 là thành công)
            if (response.ok) {
                alert("Xóa rạp thành công!");
                onSuccess(); // Refresh danh sách
                onClose();
            } else {
                const data = await response.json();
                alert(data.message || "Xóa thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Lỗi kết nối server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa rạp?</h3>

                    <p className="text-gray-500 mb-6">
                        Bạn có chắc chắn muốn xóa rạp <span className="font-bold text-gray-800">"{cinema?.name}"</span>?
                        <br />
                        Các phòng chiếu và lịch chiếu liên quan cũng có thể bị ảnh hưởng.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            {isLoading ? "Đang xóa..." : "Xóa ngay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCinemaModal;