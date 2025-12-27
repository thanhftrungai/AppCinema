/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";

const BillContext = createContext();

// [QUAN TRỌNG] Thêm tiền tố /cinema để khớp với Proxy
const API_BASE = "/cinema";

export const BillProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper: Lấy header có Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Helper: Xử lý response chung
  const handleResponse = async (response) => {
    const text = await response.text();
    try {
      const data = text ? JSON.parse(text) : {};
      if (
        !response.ok ||
        (data.code !== undefined && data.code !== 0 && data.code !== 1000)
      ) {
        throw new Error(data.message || "Lỗi thao tác API");
      }
      return data.result || data;
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
      throw new Error("Lỗi kết nối Server (Phản hồi không hợp lệ)");
    }
  };

  // 1. GET: Lấy tất cả hóa đơn
  const fetchAllBills = async () => {
    setIsLoading(true);
    try {
      // [SỬA] Thêm API_BASE
      const response = await fetch(`${API_BASE}/bills`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      // Xử lý riêng cho hàm này vì nó set state trực tiếp
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok && (data.code === 0 || data.code === 1000)) {
        setBills(data.result || []);
      } else {
        console.warn("Không tải được hóa đơn:", data.message);
        setBills([]);
      }
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. GET: Lấy chi tiết hóa đơn
  const getBillById = async (billId) => {
    const response = await fetch(`${API_BASE}/bills/${billId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  };

  // 3. POST: Tạo hóa đơn mới
  const createBill = async (billData) => {
    const response = await fetch(`${API_BASE}/bills`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(billData),
    });
    return await handleResponse(response);
  };

  // 4. PUT: Cập nhật hóa đơn
  const updateBill = async (billId, billData) => {
    const response = await fetch(`${API_BASE}/bills/${billId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(billData),
    });
    return await handleResponse(response);
  };

  // Tự động load khi mount (nếu cần)
  useEffect(() => {
    // fetchAllBills();
  }, []);

  const refreshBills = () => fetchAllBills();

  return (
    <BillContext.Provider
      value={{
        bills,
        isLoading,
        fetchBills: refreshBills,
        getBillById,
        createBill,
        updateBill,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBillContext = () => useContext(BillContext);
