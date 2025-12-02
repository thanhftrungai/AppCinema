import React, { useState } from "react";
import { X, Loader2, Save } from "lucide-react";

const CreateMovieModal = ({ isOpen, onClose, onSuccess }) => {
    // 1. Khởi tạo State cho Form
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        releaseDate: "",
        rating: 0,
        typeNames: "", // Nhập chuỗi (VD: "Action, Drama"), sẽ convert sang mảng khi gửi
        image: "",
        trailer: "",
        director: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    // Xử lý khi nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Lấy token từ LocalStorage
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Bạn chưa đăng nhập hoặc phiên đăng nhập hết hạn.");
                setIsLoading(false);
                return;
            }

            // Xử lý dữ liệu trước khi gửi (convert số và mảng)
            const payload = {
                ...formData,
                duration: Number(formData.duration),
                rating: Number(formData.rating),
                // Chuyển chuỗi "Animation, Family" thành mảng ["Animation", "Family"]
                typeNames: formData.typeNames.split(",").map((t) => t.trim()).filter(Boolean),
            };

            // Gọi API (qua Proxy /cinema)
            const response = await fetch("/cinema/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Header quan trọng
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.code === 0) {
                alert("Thêm phim thành công!");
                // Reset form
                setFormData({
                    title: "", description: "", duration: "", releaseDate: "",
                    rating: 0, typeNames: "", image: "", trailer: "", director: ""
                });
                onSuccess(); // Gọi hàm refresh ở trang cha
                onClose();   // Đóng modal
            } else {
                setError(data.message || "Có lỗi xảy ra khi tạo phim.");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối đến server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header Modal */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-800">Thêm Phim Mới</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Hàng 1: Tên & Đạo diễn */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên phim *</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Zootopia 2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đạo diễn</label>
                            <input name="director" value={formData.director} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Jared Bush" />
                        </div>
                    </div>

                    {/* Hàng 2: Thời lượng, Ngày chiếu, Rating */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút) *</label>
                            <input required type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày công chiếu *</label>
                            <input required type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    {/* Thể loại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại (ngăn cách bằng dấu phẩy)</label>
                        <input name="typeNames" value={formData.typeNames} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Animation, Family, Comedy" />
                    </div>

                    {/* Link Ảnh & Trailer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Poster (URL)</label>
                            <input name="image" value={formData.image} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Trailer (Youtube URL)</label>
                            <input name="trailer" value={formData.trailer} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả nội dung</label>
                        <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nội dung phim..." />
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition">Hủy</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? "Đang xử lý..." : "Lưu Phim"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMovieModal;