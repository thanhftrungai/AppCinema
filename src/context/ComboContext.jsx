/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback } from "react";
import { request } from "../utils/request";

const ComboContext = createContext();

export const useComboContext = () => useContext(ComboContext);

export const ComboProvider = ({ children }) => {
    const [combos, setCombos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Helper xử lý response chung
    const handleResponse = async (response) => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Lỗi API: ${response.status}`);
        }
        const data = await response.json();
        // Kiểm tra logic code từ backend (nếu có)
        if (data.code !== undefined && data.code !== 0 && data.code !== 1000) {
            throw new Error(data.message || "Thao tác thất bại");
        }
        return data;
    };

    // 1. GET: Lấy danh sách
    const fetchCombos = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await request("/cinema/combos", { method: "GET" });
            const data = await handleResponse(response);
            setCombos(data.result || []);
        } catch (error) {
            console.error("Lỗi tải combo:", error);
            // setCombos([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. POST: Tạo mới
    const createCombo = useCallback(async (comboData) => {
        // comboData: { name, description, price }
        const response = await request("/cinema/combos", {
            method: "POST",
            body: JSON.stringify(comboData)
        });
        const data = await handleResponse(response);
        await fetchCombos(); // Tải lại danh sách sau khi tạo
        return data;
    }, [fetchCombos]);

    // 3. PUT: Cập nhật
    const updateCombo = useCallback(async (id, comboData) => {
        const response = await request(`/cinema/combos/${id}`, {
            method: "PUT",
            body: JSON.stringify(comboData)
        });
        const data = await handleResponse(response);
        await fetchCombos();
        return data;
    }, [fetchCombos]);

    // 4. DELETE: Xóa
    const deleteCombo = useCallback(async (id) => {
        const response = await request(`/cinema/combos/${id}`, {
            method: "DELETE"
        });
        const data = await handleResponse(response);
        await fetchCombos();
        return data;
    }, [fetchCombos]);

    return (
        <ComboContext.Provider value={{
            combos,
            isLoading,
            fetchCombos,
            createCombo,
            updateCombo,
            deleteCombo
        }}>
            {children}
        </ComboContext.Provider>
    );
};