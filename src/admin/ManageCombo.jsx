import React, { useEffect, useState } from "react";
import { useComboContext } from "../context/ComboContext.jsx";
import { Plus, Edit, Trash2, X, Loader2, Popcorn } from "lucide-react";

// Helper format tiền Việt
const formatVND = (v) => v ? v.toLocaleString("vi-VN") + " đ" : "0 đ";

const ComboManagement = () => {
    const { combos, isLoading, fetchCombos, createCombo, updateCombo, deleteCombo } = useComboContext();

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Form Data
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        description: ""
    });

    // Load dữ liệu lần đầu
    useEffect(() => {
        fetchCombos();
    }, [fetchCombos]);

    // --- CÁC HÀM XỬ LÝ ---
    const handleOpenModal = (combo = null) => {
        if (combo) {
            // Chế độ Sửa: ComboId có thể là comboId hoặc id tùy backend trả về
            setEditingId(combo.comboId || combo.id);
            setFormData({
                name: combo.name || "",
                price: combo.price || 0,
                description: combo.description || ""
            });
        } else {
            // Chế độ Thêm mới
            setEditingId(null);
            setFormData({ name: "", price: 0, description: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await updateCombo(editingId, formData);
                alert("Cập nhật thành công!");
            } else {
                await createCombo(formData);
                alert("Thêm mới thành công!");
            }
            handleCloseModal();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa combo này không?")) {
            try {
                await deleteCombo(id);
                // alert("Đã xóa!"); // Context đã tự reload
            } catch (error) {
                alert("Xóa thất bại! Có thể combo này đang được sử dụng trong hóa đơn.");
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Combo & Bắp nước</h1>
                    <p className="text-sm text-gray-500">Thiết lập menu đồ ăn kèm cho rạp chiếu</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    <Plus size={20} /> Thêm Combo
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading && combos.length === 0 ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Minh họa</th>
                            <th className="p-4 border-b">Tên Combo</th>
                            <th className="p-4 border-b">Mô tả chi tiết</th>
                            <th className="p-4 border-b text-right">Đơn giá</th>
                            <th className="p-4 border-b text-center">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                        {combos.length > 0 ? combos.map((combo) => (
                            <tr key={combo.id || combo.comboId} className="hover:bg-blue-50/50 transition">
                                <td className="p-4 w-24">
                                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                                        <Popcorn size={24} />
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">{combo.name}</td>
                                <td className="p-4 text-gray-500 max-w-xs truncate">{combo.description}</td>
                                <td className="p-4 text-right font-bold text-gray-800">{formatVND(combo.price)}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleOpenModal(combo)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(combo.id || combo.comboId)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                    Chưa có combo nào. Hãy thêm mới!
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">
                                {editingId ? "Cập nhật Combo" : "Thêm Combo Mới"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Tên Combo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Combo <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                    placeholder="Ví dụ: Combo Bắp Nước 1"
                                />
                            </div>

                            {/* Giá */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="1000"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                    placeholder="0"
                                />
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                    placeholder="Ví dụ: 1 Bắp Ngọt Lớn + 2 Pepsi Vừa"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-70 transition flex justify-center items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                                    {editingId ? "Lưu thay đổi" : "Tạo mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComboManagement;