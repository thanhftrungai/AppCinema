import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Calendar, MapPin, Ticket, Film, RefreshCcw } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

// Import Context
import { useBillContext } from "../context/BillContext";

const BookingHistory = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    // 👇 SỬA Ở ĐÂY: Chỉ lấy fetchBillsByUserId, KHÔNG lấy fetchBills
    const { bills, fetchBillsByUserId, isLoading: isBillLoading } = useBillContext();

    // 1. Lấy thông tin User và gọi API lấy Bill
    useEffect(() => {
        const initData = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            let currentUser = null;

            // Ưu tiên lấy User từ LocalStorage cho nhanh
            if (storedUser) {
                currentUser = JSON.parse(storedUser);
                setUserInfo(currentUser);
            }

            // Nếu có Token mà chưa có User, gọi API myInfo để lấy User
            if (token && !currentUser) {
                try {
                    const res = await fetch("/cinema/users/myInfo", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        currentUser = data.result || data;
                        setUserInfo(currentUser);
                        localStorage.setItem("user", JSON.stringify(currentUser));
                    }
                } catch (error) {
                    console.error("Lỗi lấy thông tin user:", error);
                }
            }

            // 👇 QUAN TRỌNG: Chỉ gọi API Bill khi đã CÓ User ID
            if (currentUser?.userId || currentUser?.id) {
                const userId = currentUser.userId || currentUser.id;
                // Gọi API dành riêng cho User (/cinema/bills/user/{id})
                fetchBillsByUserId(userId);
            } else {
                // Nếu không có user thì không gọi gì cả -> Tránh lỗi 403
            }

            setIsUserLoading(false);
        };

        initData();
    }, [fetchBillsByUserId]);

    // --- Logic xử lý hiển thị (Mapping Data) ---
    const historyData = useMemo(() => {
        if (!bills || bills.length === 0) return [];

        // Sort theo thời gian mới nhất
        return [...bills]
            .sort((a, b) => new Date(b.paymentAt || b.createdAt) - new Date(a.paymentAt || a.createdAt))
            .map(bill => {
                // Lấy thông tin từ vé đầu tiên để hiển thị đại diện
                const firstTicket = bill.ticketIds && bill.ticketIds.length > 0 ? bill.ticketIds[0] : null;

                // Xử lý fallback nếu dữ liệu null
                const movieName = firstTicket?.ticketName || "Vé xem phim";

                // Format ghế: A1, A2...
                const seats = bill.ticketIds?.map(t => {
                    // Logic này tùy thuộc vào response của API trả về ticketName hay seatCode
                    // Ví dụ ticketName là "Vé A1", ta cắt chuỗi để lấy A1
                    return t.ticketName.replace("Vé ", "") || "Ghế";
                }).join(", ");

                // Format Combo
                const combos = bill.billComboIds?.map(c => `${c.quantity}x Combo`).join(", ");

                return {
                    id: bill.id || bill.billId || "N/A",
                    movie: movieName,
                    // Nếu API trả về tên rạp trong ticket thì dùng, không thì để trống
                    cinema: "Rạp chiếu phim",
                    datetime: bill.paymentAt ? new Date(bill.paymentAt).toLocaleString('vi-VN') : "Chưa thanh toán",
                    seats: seats + (combos ? ` + ${combos}` : ""),
                    total: bill.totalAmount || 0,
                    status: bill.paymentStatus === "DONE" ? "THÀNH CÔNG" : "ĐANG XỬ LÝ"
                };
            });
    }, [bills]);

    const formatVND = (v) => (v ? v.toLocaleString("vi-VN") + " đ" : "0 đ");

    // Xử lý Loading
    if (isUserLoading || (isBillLoading && bills.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="container mx-auto px-4 py-10 flex-1">
                <div className="flex justify-between items-center mb-8 border-l-4 border-red-600 pl-4">
                    <h1 className="text-3xl font-bold text-gray-900">Lịch sử giao dịch</h1>
                    {userInfo && (
                        <button
                            onClick={() => fetchBillsByUserId(userInfo.userId || userInfo.id)}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
                        >
                            <RefreshCcw size={18} /> Cập nhật
                        </button>
                    )}
                </div>

                {!userInfo ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem lịch sử.</p>
                        <Link to="/login" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Đăng nhập ngay</Link>
                    </div>
                ) : historyData.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Bạn chưa có lịch sử đặt vé nào.</p>
                        <Link to="/" className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-lg">
                            Đặt vé ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {historyData.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between hover:shadow-lg transition-all duration-200 group">
                                <div className="flex gap-6">
                                    <div className="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 transition-colors">
                                        <Film className="text-gray-400 group-hover:text-red-500" size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded tracking-wider ${item.status === 'THÀNH CÔNG' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status}
                      </span>
                                            <span className="text-xs text-gray-400">Mã đơn: #{item.id}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                            {item.movie}
                                        </h3>
                                        <div className="space-y-1.5 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-red-500" />
                                                <span>{item.datetime}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Ticket size={16} className="text-red-500" />
                                                <span>Chi tiết: <b className="text-gray-900">{item.seats}</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 md:mt-0 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                                    <span className="text-xs text-gray-500 mb-1">Tổng tiền</span>
                                    <span className="text-2xl font-bold text-red-600">
                    {formatVND(item.total)}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BookingHistory;