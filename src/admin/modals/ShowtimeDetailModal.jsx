import React, { useState, useEffect, useMemo } from 'react';
import { X, Trash2, Edit, Save, Calendar, Clock, MapPin, Film, Loader2, AlertCircle } from 'lucide-react';
import { useRoomContext } from '../../context/RoomContext';
import { useShowtimeContext } from '../../context/ShowtimeContext';
import { useMovieContext } from '../../context/MovieContext'; // Cần import Context Phim

const ShowtimeDetailModal = ({ isOpen, onClose, showtime }) => {
    // 1. Lấy các hàm từ Context
    const { updateShowtime, deleteShowtime } = useShowtimeContext();
    const { rooms } = useRoomContext();
    const { movies } = useMovieContext(); // Lấy danh sách phim để tra cứu ID

    // 2. State nội bộ
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        movieId: '',
        roomId: '',
        status: 'ACTIVE',
        showDate: '',
        startTime: ''
    });

    // 3. EFFECT: Load dữ liệu vào form khi mở modal
    useEffect(() => {
        if (showtime && isOpen) {
            let currentMovieId = showtime.movieId;

            // --- LOGIC QUAN TRỌNG: TÌM ID PHIM NẾU THIẾU ---
            // Nếu API get list không trả về movieId, ta tìm trong list movies dựa vào tên
            if (!currentMovieId && movies.length > 0) {
                const foundMovie = movies.find(m => m.title === showtime.movie);
                if (foundMovie) {
                    currentMovieId = foundMovie.id || foundMovie.movieId;
                }
            }
            // -----------------------------------------------

            setFormData({
                movieId: currentMovieId || '',
                roomId: showtime.roomId,
                status: showtime.status || 'ACTIVE',
                showDate: showtime.date,
                startTime: showtime.startTime
            });
            setIsEditing(false);
        }
    }, [showtime, isOpen, movies]);

    // 4. LOGIC: Tìm CinemaId của suất chiếu hiện tại
    // (Để lọc danh sách phòng, chỉ cho phép chuyển sang phòng khác CÙNG RẠP)
    const derivedCinemaId = useMemo(() => {
        if (showtime?.cinemaId) return showtime.cinemaId;
        // Nếu thiếu cinemaId, tra cứu ngược từ roomId
        if (showtime?.roomId && rooms.length > 0) {
            const foundRoom = rooms.find(r => String(r.roomId) === String(showtime.roomId));
            return foundRoom?.cinemaId;
        }
        return null;
    }, [showtime, rooms]);

    // Lọc danh sách phòng theo rạp đã tìm được
    const currentCinemaRooms = useMemo(() => {
        return rooms.filter(r =>
            derivedCinemaId && String(r.cinemaId) === String(derivedCinemaId)
        );
    }, [rooms, derivedCinemaId]);


    // 5. HANDLER: Xóa suất chiếu
    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa suất chiếu này không?")) return;

        setIsLoading(true);
        try {
            await deleteShowtime(showtime.id);
            onClose();
        } catch (error) {
            alert(error.message || "Lỗi khi xóa");
        } finally {
            setIsLoading(false);
        }
    };

    // 6. HANDLER: Cập nhật suất chiếu
    const handleUpdate = async () => {
        // Validate
        if (!formData.movieId) {
            alert("Lỗi dữ liệu: Không tìm thấy ID phim. Vui lòng tải lại trang.");
            return;
        }

        setIsLoading(true);
        try {
            const bodyData = {
                movieId: formData.movieId,
                roomId: parseInt(formData.roomId),
                status: formData.status,
                showDate: formData.showDate,
                startTime: formData.startTime
            };

            await updateShowtime(showtime.id, bodyData);

            setIsEditing(false);
            onClose();
        } catch (error) {
            alert(error.message || "Lỗi cập nhật");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !showtime) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">
                        {isEditing ? 'Chỉnh Sửa Suất Chiếu' : 'Chi Tiết Suất Chiếu'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Cảnh báo nếu không tìm thấy ID phim (Data lỗi) */}
                    {isEditing && !formData.movieId && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
                            <AlertCircle size={16} />
                            Không tìm thấy ID phim. Không thể cập nhật.
                        </div>
                    )}

                    {/* Tên phim (Read-only) */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Film className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                            <label className="text-xs font-bold text-blue-500 uppercase block mb-1">Phim</label>
                            <p className="text-lg font-bold text-slate-900">{showtime.movie}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Ngày chiếu */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                                <Calendar size={14} /> Ngày chiếu
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.showDate}
                                    onChange={e => setFormData({...formData, showDate: e.target.value})}
                                />
                            ) : (
                                <p className="font-medium text-slate-800 text-lg border-b border-dashed border-slate-200 pb-1">{formData.showDate}</p>
                            )}
                        </div>

                        {/* Giờ chiếu */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                                <Clock size={14} /> Giờ bắt đầu
                            </label>
                            {isEditing ? (
                                <input
                                    type="time"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.startTime}
                                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                                />
                            ) : (
                                <p className="font-medium text-slate-800 text-lg border-b border-dashed border-slate-200 pb-1">{formData.startTime}</p>
                            )}
                        </div>
                    </div>

                    {/* Phòng chiếu */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                            <MapPin size={14} /> Phòng chiếu
                        </label>
                        {isEditing ? (
                            <select
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.roomId}
                                onChange={e => setFormData({...formData, roomId: e.target.value})}
                            >
                                {currentCinemaRooms.length > 0 ? (
                                    currentCinemaRooms.map(r => (
                                        <option key={r.roomId} value={r.roomId}>{r.name}</option>
                                    ))
                                ) : (
                                    <option value={formData.roomId}>{showtime.room} (Hiện tại)</option>
                                )}
                            </select>
                        ) : (
                            <p className="font-medium text-slate-800 text-lg border-b border-dashed border-slate-200 pb-1">
                                {showtime.room} <span className="text-sm text-slate-400 font-normal">({showtime.cinema})</span>
                            </p>
                        )}
                    </div>

                    {/* Trạng thái */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Trạng thái</label>
                        {isEditing ? (
                            <select
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                                <option value="INACTIVE">Ngưng hoạt động (INACTIVE)</option>
                            </select>
                        ) : (
                            <div>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${formData.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formData.status}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isLoading || !formData.movieId}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Lưu thay đổi</>}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-red-600 bg-red-50 font-medium hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} /> Xóa
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Edit size={18} /> Chỉnh sửa
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowtimeDetailModal;