import React, { useState, useEffect } from "react";
import { X, Loader2, Save, ChevronDown, Check } from "lucide-react";

const EditCinemaModal = ({ isOpen, onClose, onSuccess, cinema }) => {
    // 1. State form
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        status: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // State cho Custom Dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 2. Danh sách lựa chọn Status (Có màu và icon)
    const statusOptions = [
        { value: "ACTIVE", label: "Đang hoạt động", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: "🟢" },
        { value: "MAINTENANCE", label: "Đang bảo trì", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", icon: "🟠" },
        { value: "INACTIVE", label: "Ngưng hoạt động", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "🔴" }
    ];

    // Lấy option hiện tại để hiển thị ra ngoài
    const currentOption = statusOptions.find(opt => opt.value === formData.status) || statusOptions[0];

    // 3. Đổ dữ liệu cũ vào Form khi mở Modal
    useEffect(() => {
        if (isOpen && cinema) {
            setFormData({
                name: cinema.name || "",
                address: cinema.address || "",
                status: cinema.status || "ACTIVE",
            });
        }
    }, [cinema, isOpen]);

    // Reset dropdown khi đóng modal
    useEffect(() => {
        if (!isOpen) setIsDropdownOpen(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`/cinema/cinemas/${cinema.cinemaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Cập nhật rạp thành công!");
                onSuccess(); // Refresh danh sách
                onClose();   // Đóng modal
            } else {
                const data = await response.json();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[110vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        Cập nhật: <span className="text-blue-600">{cinema?.name}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Custom Dropdown Trạng thái */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái hoạt động</label>

                            {/* Nút bấm hiển thị giá trị hiện tại */}
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-all ${currentOption.bg} ${currentOption.border} ${currentOption.color}`}
                            >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-lg">{currentOption.icon}</span>
                    {currentOption.label}
                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Danh sách thả xuống */}
                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop vô hình để click ra ngoài thì đóng */}
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>

                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100">
                                        {statusOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, status: option.value }));
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50
                          ${formData.status === option.value ? "bg-blue-50/50 text-blue-600 font-medium" : "text-gray-700"}
                        `}
                                            >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                            {option.label}
                        </span>
                                                {formData.status === option.value && <Check className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <p className="text-xs text-gray-500 mt-2 ml-1">
                                * Trạng thái sẽ ảnh hưởng đến khả năng đặt vé của khách hàng.
                            </p>
                        </div>
                        {/* Tên Rạp */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Rạp *</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Nhập tên rạp..."
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                            <textarea
                                required
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                placeholder="Nhập địa chỉ..."
                            />
                        </div>
                        {/* Footer Buttons */}
                        <div className="pt-6 flex justify-end gap-3 border-t mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70 shadow-sm hover:shadow"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCinemaModal;