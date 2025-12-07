import React, { useState, useEffect } from "react";
import { X, Save, Loader2, AlertCircle } from "lucide-react";
import { useShowtimeContext } from "../../context/ShowtimeContext";

const CreateShowtimeModal = ({ isOpen, onClose, initialData }) => {
    const { createShowtime } = useShowtimeContext();

    const [formData, setFormData] = useState({
        movieId: "",
        roomId: "",
        showDate: "",
        startTime: "",
    });

    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [allRooms, setAllRooms] = useState([]);

    const [selectedCinemaId, setSelectedCinemaId] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    });

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsFetching(true);
                try {
                    const [resMovies, resCinemas, resRooms] = await Promise.all([
                        fetch("/cinema/movies", { headers: getAuthHeaders() }),
                        fetch("/cinema/cinemas", { headers: getAuthHeaders() }),
                        fetch("/cinema/rooms", { headers: getAuthHeaders() })
                    ]);

                    const dataMovies = await resMovies.json();
                    const dataCinemas = await resCinemas.json();
                    const dataRooms = await resRooms.json();

                    if (dataMovies.code === 0) setMovies(dataMovies.result);
                    if (dataCinemas.code === 0) setCinemas(dataCinemas.result);

                    let roomsResult = [];
                    if (dataRooms.code === 0) {
                        roomsResult = dataRooms.result;
                        setAllRooms(roomsResult);
                    }

                    if (initialData) {
                        if (initialData.roomId) {
                            const targetRoom = roomsResult.find(r => String(r.roomId) === String(initialData.roomId));
                            if (targetRoom) {
                                setSelectedCinemaId(String(targetRoom.cinemaId));
                            }
                        } else if (initialData.cinemaId) {
                            setSelectedCinemaId(String(initialData.cinemaId));
                        }

                        setFormData({
                            movieId: "",
                            roomId: initialData.roomId || "",
                            showDate: initialData.showDate || new Date().toISOString().split('T')[0],
                            startTime: initialData.startTime || "09:00",
                        });
                    } else {
                        setFormData({
                            movieId: "",
                            roomId: "",
                            showDate: new Date().toISOString().split('T')[0],
                            startTime: "09:00",
                        });
                        setSelectedCinemaId("");
                    }

                } catch (err) {
                    console.error("Lỗi tải dữ liệu dropdown:", err);
                    setError("Không thể tải danh sách dữ liệu.");
                } finally {
                    setIsFetching(false);
                }
            };
            fetchData();
            setError(null);
        }
    }, [isOpen, initialData]);

    const filteredRooms = allRooms.filter(room =>
        selectedCinemaId && String(room.cinemaId) === String(selectedCinemaId)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.roomId) {
            setError("Vui lòng chọn phòng chiếu");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            await createShowtime(formData);
            onClose();
        } catch (err) {
            setError(err.message || "Lỗi khi tạo suất chiếu");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? "Tạo Suất Chiếu Nhanh" : "Thêm Suất Chiếu Mới"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {isFetching ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                        </div>
                    ) : (
                        <>
                            {/* Chọn Phim */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phim</label>
                                <select
                                    required
                                    autoFocus={!!initialData}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    value={formData.movieId}
                                    onChange={(e) => setFormData({...formData, movieId: e.target.value})}
                                >
                                    <option value="">-- Chọn phim --</option>
                                    {/* SỬA LỖI: Dùng m.movieId thay vì m.id */}
                                    {movies.map(m => (
                                        <option key={m.movieId} value={m.movieId}>{m.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Chọn Rạp */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rạp chiếu</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    value={selectedCinemaId}
                                    onChange={(e) => {
                                        setSelectedCinemaId(e.target.value);
                                        setFormData({...formData, roomId: ""});
                                    }}
                                >
                                    <option value="">-- Chọn rạp trước --</option>
                                    {/* Dùng c.cinemaId */}
                                    {cinemas.map(c => (
                                        <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Chọn Phòng */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phòng chiếu</label>
                                <select
                                    required
                                    disabled={!selectedCinemaId}
                                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${!selectedCinemaId ? 'bg-slate-100 cursor-not-allowed opacity-70' : ''}`}
                                    value={formData.roomId}
                                    onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                                >
                                    <option value="">
                                        {!selectedCinemaId ? "-- Vui lòng chọn rạp phía trên --" : "-- Chọn phòng --"}
                                    </option>
                                    {/* Dùng r.roomId */}
                                    {filteredRooms.map(r => (
                                        <option key={r.roomId} value={r.roomId}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ngày chiếu</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.showDate}
                                        onChange={(e) => setFormData({...formData, showDate: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isFetching}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Tạo suất chiếu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateShowtimeModal;