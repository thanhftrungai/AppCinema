import React, { useState } from "react";
import { MapPin, Edit, Trash2, Plus, Loader2 } from "lucide-react";
// Import Context
import { useCinemaContext } from "../context/CinemaContext";
// Import Modals
import CreateCinemaModal from "./modals/CreateCinemaModal";
import EditCinemaModal from "./modals/EditCinemaModal";
import DeleteCinemaModal from "./modals/DeleteCinemaModal";

export const ManageCinemas = () => {
    // Lấy dữ liệu từ Context
    const { cinemas, isLoading, refreshCinemas } = useCinemaContext();

    // State quản lý các Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCinema, setEditingCinema] = useState(null); // Lưu rạp đang sửa
    const [deletingCinema, setDeletingCinema] = useState(null); // Lưu rạp đang xóa

    // Tính toán thống kê
    const totalCinemas = cinemas.length;
    const activeCinemas = cinemas.filter((c) => c.status === "ACTIVE").length;

    // Hàm helper hiển thị Badge trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case "ACTIVE":
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Đang hoạt động</span>;
            case "MAINTENANCE":
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Bảo trì</span>;
            case "INACTIVE":
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">Ngưng hoạt động</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-slate-500">Đang tải danh sách rạp...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý Rạp Chiếu Phim</h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Quản lý thông tin các rạp chiếu phim trong hệ thống
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
                >
                    <Plus size={20} />
                    Thêm rạp mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-slate-600 text-sm">Tổng số rạp</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalCinemas}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-slate-600 text-sm">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{activeCinemas}</p>
                </div>
                {/* Các thống kê khác (có thể mở rộng sau) */}
            </div>

            {/* Cinemas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cinemas.map((cinema) => (
                    <div
                        key={cinema.cinemaId}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 pr-4">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate" title={cinema.name}>
                                        {cinema.name}
                                    </h3>
                                    <div className="flex items-start gap-2 text-slate-600 mb-2">
                                        <MapPin size={16} className="mt-1 flex-shrink-0 text-red-500" />
                                        <p className="text-sm line-clamp-2">{cinema.address}</p>
                                    </div>
                                </div>
                                {/* Hiển thị Badge trạng thái (Chỉ dùng 1 lần ở đây) */}
                                <div className="flex-shrink-0">
                                    {getStatusBadge(cinema.status)}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setEditingCinema(cinema)}
                                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <Edit size={16} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => setDeletingCinema(cinema)}
                                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <Trash2 size={16} />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CÁC MODAL --- */}

            {/* 1. Modal Thêm */}
            <CreateCinemaModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refreshCinemas}
            />

            {/* 2. Modal Sửa */}
            {editingCinema && (
                <EditCinemaModal
                    isOpen={true}
                    cinema={editingCinema}
                    onClose={() => setEditingCinema(null)}
                    onSuccess={refreshCinemas}
                />
            )}

            {/* 3. Modal Xóa */}
            {deletingCinema && (
                <DeleteCinemaModal
                    isOpen={true}
                    cinema={deletingCinema}
                    onClose={() => setDeletingCinema(null)}
                    onSuccess={refreshCinemas}
                />
            )}
        </div>
    );
};