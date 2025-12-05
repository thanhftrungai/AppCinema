import React, { createContext, useState, useEffect, useContext } from "react";

const CinemaContext = createContext();

export const CinemaProvider = ({ children }) => {
    const [cinemas, setCinemas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm fetch danh sách rạp
    const fetchCinemas = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/cinema/cinemas", {

            });

            const data = await response.json();

            if (data.code === 0) {
                setCinemas(data.result);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách rạp:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCinemas();
    }, []);

    // Hàm refresh để gọi lại khi thêm/sửa/xóa xong
    const refreshCinemas = () => fetchCinemas();

    return (
        <CinemaContext.Provider value={{ cinemas, isLoading, refreshCinemas }}>
            {children}
        </CinemaContext.Provider>
    );
};

export const useCinemaContext = () => useContext(CinemaContext);