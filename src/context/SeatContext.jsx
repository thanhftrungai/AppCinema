import React, { createContext, useState, useContext, useCallback } from "react";
import { request } from "../utils/request";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- HÀM 1: Lấy danh sách ghế từ Server ---
    const fetchSeatsByRoom = useCallback(async (roomId) => {
        // console.log("LOG KIỂM TRA ROOM ID:", roomId);

        if (!roomId && roomId !== 0) { // Chấp nhận cả ID = 0 nếu hệ thống dùng index 0
            console.warn("Room ID bị thiếu, không gọi API");
            return;
        }

        setIsLoading(true);
        try {
            // 👇 SỬA LẠI ĐÚNG ĐƯỜNG DẪN API BẠN CUNG CẤP
            const response = await request(`/cinema/seats/room/${roomId}`, {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                // Xử lý dữ liệu trả về (thường là data.result hoặc data trực tiếp)
                const seatList = data.result || data;

                // Sắp xếp ghế theo ID tăng dần để hiển thị đẹp hơn
                const sortedSeats = Array.isArray(seatList) ? seatList.sort((a, b) => a.seatId - b.seatId) : [];
                setSeats(sortedSeats);
            } else {
                const errorText = await response.text();
                console.error(`Lỗi API lấy ghế (${response.status}):`, errorText);
                setSeats([]);
            }
        } catch (error) {
            console.error("Lỗi mạng khi tải ghế:", error);
            setSeats([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- HÀM 2: Chọn / Bỏ chọn ghế ---
    const toggleSeat = useCallback((seat) => {
        setSelectedSeats((prev) => {
            const isSelected = prev.find((s) => s.seatId === seat.seatId);
            if (isSelected) {
                return prev.filter((s) => s.seatId !== seat.seatId);
            } else {
                if (prev.length >= 8) {
                    alert("Bạn chỉ được chọn tối đa 8 ghế!");
                    return prev;
                }
                return [...prev, seat];
            }
        });
    }, []);

    // --- HÀM 3: Reset trạng thái (Dùng cho Booking.jsx) ---
    const resetSeatState = useCallback(() => {
        setSelectedSeats([]);
        setSeats([]);
    }, []);

    return (
        <SeatContext.Provider
            value={{
                seats,
                selectedSeats,
                isLoading,
                fetchSeatsByRoom,
                toggleSeat,
                resetSeatState,
                clearSelectedSeats: resetSeatState
            }}
        >
            {children}
        </SeatContext.Provider>
    );
};

export const useSeatContext = () => {
    return useContext(SeatContext);
};