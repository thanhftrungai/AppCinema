/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [allRooms, setAllRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Helper: Lấy header có Token
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        };
    };

    // Helper: Xử lý response chung để code gọn hơn
    const handleResponse = async (response) => {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok || (data.code !== undefined && data.code !== 0)) {
            throw new Error(data.message || "Lỗi thao tác API");
        }
        return data;
    };

    // 1. GET: Lấy phòng (Giữ try/catch ở đây vì nó được gọi trong useEffect)
    const fetchAllRooms = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/cinema/rooms`);
            const data = await response.json();

            if (data.code === 0) {
                setAllRooms(data.result);
            } else {
                setAllRooms([]);
            }
        } catch (error) {
            console.error("Lỗi tải phòng:", error);
            setAllRooms([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. POST: Thêm phòng (Đã xóa try/catch thừa)
    const createRoom = async (roomData) => {
        const response = await fetch(`/cinema/rooms`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(roomData)
        });
        return await handleResponse(response);
    };

    // 3. PUT: Sửa phòng (Đã xóa try/catch thừa)
    const updateRoom = async (roomId, roomData) => {
        const response = await fetch(`/cinema/rooms/${roomId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(roomData)
        });
        return await handleResponse(response);
    };

    // 4. DELETE: Xóa phòng (Đã xóa try/catch thừa)
    const deleteRoom = async (roomId) => {
        const response = await fetch(`/cinema/rooms/${roomId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        return await handleResponse(response);
    };

    // Tự động gọi khi App chạy
    useEffect(() => {
        fetchAllRooms();
    }, []);

    const refreshRooms = () => fetchAllRooms();

    return (
        <RoomContext.Provider value={{
            rooms: allRooms,
            isLoading,
            fetchRooms: refreshRooms,
            createRoom,
            updateRoom,
            deleteRoom
        }}>
            {children}
        </RoomContext.Provider>
    );
};

// Export Hook
export const useRoomContext = () => useContext(RoomContext);