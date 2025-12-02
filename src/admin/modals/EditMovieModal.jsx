import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";

const EditMovieModal = ({ isOpen, onClose, onSuccess, movie }) => {
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        title: "", description: "", duration: "", releaseDate: "",
        rating: 0, typeNames: "", image: "", trailer: "", director: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // --- 1. GỌI HOOK TRƯỚC (ĐÚNG LUẬT REACT) ---
    useEffect(() => {
        // Chỉ cập nhật khi modal mở VÀ có dữ liệu movie
        if (isOpen && movie) {
            setFormData({
                title: movie.title || "",
                description: movie.description || "",
                duration: movie.duration ? parseInt(movie.duration) : 0,
                releaseDate: movie.releaseDate || "",
                rating: movie.rating || 0,
                typeNames: movie.types ? movie.types.join(", ") : "",
                image: movie.image || "",
                trailer: movie.trailer || "",
                director: movie.director || "",
            });
        }
    }, [movie, isOpen]); // Thêm isOpen vào dependency

    // --- 2. SAU KHI GỌI HẾT HOOKS MỚI ĐƯỢC RETURN ---
    if (!isOpen) return null;

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý Submit Form (PUT Request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Chuẩn bị payload
        const typeArray = formData.typeNames.split(",").map((t) => t.trim()).filter(Boolean);

        const payload = {
            ...formData,
            duration: Number(formData.duration),
            rating: Number(formData.rating),
            typeNames: typeArray, // API yêu cầu field là typeNames (mảng)
        };

        try {
            const token = localStorage.getItem("token");

            // --- GỌI API PUT ---
            // Đường dẫn: /cinema/movies/{id}
            const response = await fetch(`/cinema/movies/${movie.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok ) { // Check code tùy theo backend trả về
                alert("Cập nhật phim thành công!");
                onSuccess(); // Refresh danh sách
                onClose();
            } else {
                setError(data.message || "Cập nhật thất bại.");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        Cập nhật phim: <span className="text-blue-600">{movie?.title}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body (Form giống hệt Create, chỉ khác value lấy từ state đã pre-fill) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên phim</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đạo diễn</label>
                            <input name="director" value={formData.director} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                            <input required type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày chiếu</label>
                            <input required type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Thể loại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại (ngăn cách bởi dấu phẩy)</label>
                        <input name="typeNames" value={formData.typeNames} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Ảnh & Trailer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Poster</label>
                            <input name="image" value={formData.image} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Trailer</label>
                            <input name="trailer" value={formData.trailer} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition">Hủy</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMovieModal;