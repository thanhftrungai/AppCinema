/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback } from "react";
import { request } from "../utils/request";

const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);

  const handleResponse = async (response) => {
    if (!response.ok) {
      const text = await response.text();
      const errData = text ? JSON.parse(text) : {};
      // Ném lỗi cụ thể nếu gặp 403 Forbidden (User thường không được gọi API của Admin)
      if (response.status === 403) {
        throw new Error("Bạn không có quyền truy cập dữ liệu này.");
      }
      throw new Error(errData.message || `Lỗi API: ${response.status}`);
    }
    const data = await response.json();
    if (data.code !== undefined && data.code !== 0 && data.code !== 1000) {
      throw new Error(data.message || "Thao tác thất bại");
    }
    return data;
  };

  // --- 1. LẤY TẤT CẢ BILL (Dành cho ADMIN) ---
  const fetchAllBills = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await request("/cinema/bills", { method: "GET" });
      const data = await handleResponse(response);
      setBills(data.result || []);
    } catch (error) {
      console.error("Lỗi tải hóa đơn (Admin):", error);
      // Không setBills([]) ở đây để tránh xoá dữ liệu nếu chỉ lỗi mạng tạm thời
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 2. [MỚI] LẤY BILL THEO USER ID (Dành cho Khách hàng xem lịch sử) ---
  const fetchBillsByUserId = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Gọi vào API mới bạn vừa tạo ở Backend: /bills/user/{userId}
      const response = await request(`/cinema/bills/user/${userId}`, { method: "GET" });
      const data = await handleResponse(response);
      setBills(data.result || []);
    } catch (error) {
      console.error("Lỗi tải lịch sử giao dịch:", error);
      setBills([]); // Nếu lỗi thì coi như không có lịch sử
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 3. LẤY CHI TIẾT 1 BILL (Theo ID Hóa đơn) ---
  const getBillById = useCallback(async (billId) => {
    // Sửa lại đường dẫn chuẩn: /bills/{billId}
    const response = await request(`/cinema/bills/${billId}`, { method: "GET" });
    const data = await handleResponse(response);
    return data.result || data;
  }, []);

  // --- 4. TẠO BILL ---
  const createBill = useCallback(async (billData) => {
    const response = await request("/cinema/bills", {
      method: "POST",
      body: JSON.stringify(billData),
    });
    const data = await handleResponse(response);
    if (data.result) setCurrentBill(data.result);
    return data;
  }, []);

  // --- 5. CẬP NHẬT BILL ---
  const updateBill = useCallback(async (billId, billData) => {
    const response = await request(`/cinema/bills/${billId}`, {
      method: "PUT",
      body: JSON.stringify(billData),
    });
    const data = await handleResponse(response);
    return data;
  }, []);

  // --- 6. TẠO BILL COMBO ---
  const createBillCombo = useCallback(async (billComboData) => {
    const response = await request("/cinema/bill-combos", {
      method: "POST",
      body: JSON.stringify(billComboData),
    });
    const data = await handleResponse(response);
    return data;
  }, []);

  const clearCurrentBill = useCallback(() => {
    setCurrentBill(null);
  }, []);

  // Mặc định fetchBills sẽ gọi fetchAllBills (dùng cho trang Admin)
  const refreshBills = useCallback(() => fetchAllBills(), [fetchAllBills]);

  return (
      <BillContext.Provider
          value={{
            bills,
            isLoading,
            currentBill,
            setCurrentBill,
            clearCurrentBill,
            fetchBills: refreshBills,      // Hàm cũ (cho Admin)
            fetchBillsByUserId,            // Hàm MỚI (cho User xem lịch sử)
            getBillById,
            createBill,
            updateBill,
            createBillCombo
          }}
      >
        {children}
      </BillContext.Provider>
  );
};

export const useBillContext = () => useContext(BillContext);