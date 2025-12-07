/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const ShowtimeContext = createContext();

export const useShowtimeContext = () => useContext(ShowtimeContext);

export const ShowtimeProvider = ({ children }) => {
    const [showtimes, setShowtimes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        };
    };

    const handleResponse = async (response) => {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (!response.ok || (data.code !== undefined && data.code !== 0)) {
            throw new Error(data.message || "Lỗi thao tác API");
        }
        return data;
    };

    const calculateDuration = (startStr, endStr) => {
        if (!startStr || !endStr) return 0;
        const [h1, m1] = startStr.split(':').map(Number);
        const [h2, m2] = endStr.split(':').map(Number);
        let minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (minutes < 0) minutes += 24 * 60;
        return minutes;
    };

    // 1. GET: Lấy tất cả suất chiếu
    const fetchShowtimes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/cinema/showtimes", {
                headers: getAuthHeaders(),
            });
            const data = await handleResponse(response);

            const mappedData = (data.result || []).map(item => ({
                id: item.showtimeId,
                // Map các ID quan trọng để dùng cho Edit/Delete
                movieId: item.movieId || (item.movie ? item.movie.id : null), // Fallback an toàn
                roomId: item.roomId || (item.room ? item.room.roomId : null),
                cinemaId: item.cinemaId || (item.room && item.room.cinema ? item.room.cinema.cinemaId : null),
                status: item.status,

                movie: item.title,
                cinema: item.cinemaName,
                room: item.name,
                date: item.showDate,
                startTime: item.startTime,
                endTime: item.endTime,
                duration: calculateDuration(item.startTime, item.endTime),
                type: item.name && item.name.includes("3D") ? "3D" : (item.name && item.name.includes("IMAX") ? "IMAX" : "2D")
            }));

            setShowtimes(mappedData);
        } catch (err) {
            console.error("Lỗi tải lịch chiếu:", err);
            setError(err.message);
            setShowtimes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. POST
    const createShowtime = async (showtimeData) => {
        const response = await fetch("/cinema/showtimes", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(showtimeData)
        });
        const data = await handleResponse(response);
        await fetchShowtimes();
        return data;
    };

    // 3. PUT
    const updateShowtime = async (id, showtimeData) => {
        const response = await fetch(`/cinema/showtimes/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(showtimeData)
        });
        const data = await handleResponse(response);
        await fetchShowtimes();
        return data;
    };

    // 4. DELETE
    const deleteShowtime = async (id) => {
        const response = await fetch(`/cinema/showtimes/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        await fetchShowtimes();
        return data;
    };

    useEffect(() => {
        fetchShowtimes();
    }, [fetchShowtimes]);

    return (
        <ShowtimeContext.Provider value={{
            showtimes,
            isLoading,
            error,
            fetchShowtimes,
            createShowtime,
            updateShowtime,
            deleteShowtime
        }}>
            {children}
        </ShowtimeContext.Provider>
    );
};