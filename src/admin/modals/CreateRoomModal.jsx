import React, { useState, useEffect } from "react";
import { X, Loader2, Save, AlertCircle } from "lucide-react";
import { useCinemaContext } from "../../context/CinemaContext";

const CreateRoomModal = ({ isOpen, onClose, onSuccess, preSelectedCinemaId }) => {
    const { cinemas } = useCinemaContext();

    // 1. Khởi tạo state hoàn toàn rỗng (không mặc định số ghế)
    const [formData, setFormData] = useState({
        name: "",
        cinemaId: "",
        seatCount: "", // Để chuỗi rỗng để bắt buộc nhập
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Nếu mở modal từ trang quản lý của 1 rạp cụ thể, tự điền ID rạp đó (tiện lợi)
    // Nhưng người dùng vẫn phải nhập tên phòng và số ghế
    useEffect(() => {
        if (isOpen) {
            setFormData((prev) => ({
                ...prev,
                cinemaId: preSelectedCinemaId || "", // Nếu có sẵn ID thì điền, không thì rỗng
            }));
            setError(""); // Reset lỗi cũ
        }
    }, [isOpen, preSelectedCinemaId]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // 2. Validate thủ công: Bắt buộc nhập đầy đủ
        if (!formData.name.trim() || !formData.cinemaId || !formData.seatCount) {
            setError("Vui lòng điền đầy đủ thông tin: Tên phòng, Rạp và Số ghế.");
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            // 3. Chuẩn bị payload (KHÔNG có status)
            const payload = {
                name: formData.name,
                cinemaId: Number(formData.cinemaId),
                seatCount: Number(formData.seatCount),
            };

            const response = await fetch("/cinema/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.code === 0) {
                alert("Thêm phòng thành công!");
                onSuccess(payload.cinemaId);
                onClose();
                // Reset về rỗng hoàn toàn
                setFormData({ name: "", cinemaId: preSelectedCinemaId || "", seatCount: "" });
            } else {
                setError(data.message || "Thêm thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-800">Thêm Phòng Chiếu</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Chọn Rạp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rạp chiếu <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="cinemaId"
                            value={formData.cinemaId}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                            disabled={!!preSelectedCinemaId} // Khóa nếu đã chọn từ bên ngoài
                        >
                            <option value="">-- Vui lòng chọn rạp --</option>
                            {cinemas.map((c) => (
                                <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tên Phòng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên Phòng <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Nhập tên phòng (VD: Phòng 01)"
                        />
                    </div>

                    {/* Số ghế (Không có giá trị mặc định) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tổng số ghế <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            name="seatCount"
                            value={formData.seatCount}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Nhập số lượng ghế..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Hệ thống sẽ tự động tạo sơ đồ ghế dựa trên số lượng này.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70 shadow-sm"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? "Đang tạo..." : "Tạo Phòng"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;