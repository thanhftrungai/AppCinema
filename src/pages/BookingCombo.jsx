import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useComboContext } from "../context/ComboContext";
import { useBillContext } from "../context/BillContext";
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle, X, CreditCard } from "lucide-react";
import { formatDateTime } from "../utils/formatDate"; // <--- Import hàm xử lý giờ

const formatVND = (v) => v.toLocaleString("vi-VN") + " đ";

const BookingCombo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy dữ liệu an toàn
    const stateData = location.state || {};
    const { seatTotal = 0, seatNames = [] } = stateData;

    const { combos, fetchCombos, isLoading: isComboLoading } = useComboContext();
    const {
        currentBill,
        setCurrentBill,
        getBillById,
        updateBill,
        createBillCombo,
        clearCurrentBill
    } = useBillContext();

    const [quantities, setQuantities] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(true);

    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- LOGIC KHÔI PHỤC SESSION ---
    useEffect(() => {
        const restoreSession = async () => {
            if (!location.state) { navigate("/"); return; }
            if (currentBill) { setIsRestoring(false); return; }

            const savedBillId = localStorage.getItem("activeBillId");
            if (savedBillId) {
                try {
                    const billData = await getBillById(savedBillId);
                    if (billData) setCurrentBill(billData);
                } catch (err) { navigate("/"); }
            } else { navigate("/"); }
            setIsRestoring(false);
        };
        fetchCombos();
        restoreSession();
    }, [fetchCombos, currentBill, location.state, getBillById, setCurrentBill, navigate]);

    // --- TÍNH TOÁN ---
    const handleQuantityChange = (comboId, delta) => {
        setQuantities(prev => {
            const currentQty = prev[comboId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            return { ...prev, [comboId]: newQty };
        });
    };

    const comboTotal = useMemo(() => {
        return combos.reduce((total, combo) => {
            const qty = quantities[combo.id || combo.comboId] || 0;
            return total + (qty * combo.price);
        }, 0);
    }, [combos, quantities]);

    const grandTotal = seatTotal + comboTotal;

    // --- BƯỚC 1: NHẤN NÚT THANH TOÁN -> MỞ MODAL ---
    const handleOpenConfirmation = () => {
        if (!currentBill) return;
        setIsModalOpen(true); // Chỉ mở modal, chưa gọi API
    };

    // --- BƯỚC 2: NGƯỜI DÙNG XÁC NHẬN TRONG MODAL -> GỌI API ---
    const processPayment = async () => {
        setIsProcessing(true);
        try {
            const billId = currentBill.billId || currentBill.id;

            // 1. Lưu Combo (Nếu có chọn)
            const comboRequests = Object.entries(quantities)
                .filter(([_, qty]) => qty > 0)
                .map(([comboId, qty]) => createBillCombo({ billId, comboId: parseInt(comboId), quantity: qty }));

            if (comboRequests.length > 0) await Promise.all(comboRequests);

            // 2. Cập nhật Bill (Finish & Current Time)
            const updatePayload = {
                userId: currentBill.userId || 1,
                paymentMethod: "BANKING", // Có thể thay đổi tùy UI
                paymentStatus: "DONE", // <--- YÊU CẦU: Pending -> Finished
                paymentAt: new Date().toISOString(), // <--- YÊU CẦU: Giờ hiện tại (Backend nhận UTC)
            };

            await updateBill(billId, updatePayload);

            // Thành công
            alert("🎉 ĐẶT VÉ THÀNH CÔNG! Cảm ơn bạn đã sử dụng dịch vụ.");

            // Dọn dẹp
            localStorage.removeItem("activeBillId");
            clearCurrentBill();
            navigate("/");
            // Hoặc navigate("/booking-history") nếu muốn user xem lại vé

        } catch (error) {
            alert(`Lỗi thanh toán: ${error.message}`);
            setIsProcessing(false);
            setIsModalOpen(false); // Đóng modal nếu lỗi để user thử lại
        }
    };

    if (isRestoring || isComboLoading) {
        return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-red-600"/></div>;
    }

    // Lọc danh sách combo đã chọn để hiển thị trong Modal
    const selectedCombosList = combos.filter(c => (quantities[c.id || c.comboId] || 0) > 0);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans relative">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 pointer-events-auto">
                {/* Nút Back & Tiêu đề */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow hover:bg-gray-50">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Bước 2: Chọn Bắp & Nước</h1>
                </div>

                {/* Giao diện chính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List Combo */}
                    <div className="lg:col-span-2 space-y-4">
                        {combos.map(combo => {
                            const id = combo.id || combo.comboId;
                            const qty = quantities[id] || 0;
                            return (
                                <div key={id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
                                    <img src={combo.image || "https://placehold.co/150x150?text=Combo"} alt={combo.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{combo.name}</h3>
                                        <p className="font-bold text-red-600">{formatVND(combo.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                                        <button onClick={() => handleQuantityChange(id, -1)} className="w-8 h-8 bg-white font-bold" disabled={qty === 0}>-</button>
                                        <span className="w-8 text-center font-bold">{qty}</span>
                                        <button onClick={() => handleQuantityChange(id, 1)} className="w-8 h-8 bg-blue-600 text-white font-bold">+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Panel Tổng kết */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                            <h3 className="text-xl font-bold mb-4 flex gap-2"><ShoppingBag/> Tạm tính</h3>
                            <div className="space-y-3 mb-6 border-b pb-6 text-sm">
                                <div className="flex justify-between"><span>Ghế ({seatNames.length}):</span><span className="font-bold">{seatNames.join(", ")}</span></div>
                                <div className="flex justify-between"><span>Combo:</span><span>{formatVND(comboTotal)}</span></div>
                            </div>
                            <div className="flex justify-between items-end mb-6"><span className="font-bold text-lg">Tổng cộng:</span><span className="font-bold text-red-600 text-2xl">{formatVND(grandTotal)}</span></div>

                            {/* Nút mở Modal */}
                            <button onClick={handleOpenConfirmation} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition">
                                TIẾP TỤC THANH TOÁN
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* --- MODAL XÁC NHẬN THANH TOÁN --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <CreditCard size={20}/> Xác nhận thanh toán
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-red-700 p-1 rounded-full"><X size={20}/></button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 space-y-4">
                            {/* Thông tin vé */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Ghế đã chọn:</p>
                                <p className="font-bold text-gray-800 text-lg">{seatNames.join(", ")}</p>
                                <p className="text-right font-medium text-gray-600 mt-1">{formatVND(seatTotal)}</p>
                            </div>

                            {/* Thông tin Combo */}
                            {selectedCombosList.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">Bắp & Nước:</p>
                                    <ul className="space-y-2">
                                        {selectedCombosList.map(c => (
                                            <li key={c.id} className="flex justify-between text-sm">
                                                <span>{quantities[c.id || c.comboId]}x {c.name}</span>
                                                <span className="font-medium">{formatVND(c.price * quantities[c.id || c.comboId])}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Thông tin thời gian (Đã sửa UTC+7) */}
                            <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
                                <span>Thời gian thanh toán:</span>
                                <span className="font-medium text-gray-800">{formatDateTime(new Date())}</span>
                            </div>

                            {/* Tổng tiền chốt */}
                            <div className="flex justify-between items-end pt-2">
                                <span className="font-bold text-gray-800 text-xl">Tổng thanh toán:</span>
                                <span className="font-bold text-red-600 text-3xl">{formatVND(grandTotal)}</span>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={processPayment}
                                disabled={isProcessing}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg flex items-center justify-center gap-2 transition"
                            >
                                {isProcessing ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>}
                                XÁC NHẬN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingCombo;