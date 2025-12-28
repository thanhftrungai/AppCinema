/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

const TicketContext = createContext();

// [QUAN TRỌNG] Thêm tiền tố /cinema
const API_BASE = "/cinema";

export const TicketProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

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
    } catch (err) {
      throw new Error("Lỗi kết nối Server");
    }
  };

  // 1. POST: Tạo vé mới
  const createTicket = async (ticketData) => {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData),
    });
    return await handleResponse(response);
  };

  // 2. GET: Lấy vé theo Suất Chiếu
  const getTicketsByShowtime = async (showtimeId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/tickets/showtime/${showtimeId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      // Với API public, đôi khi backend trả lỗi nếu ko có token,
      // nhưng ở đây ta cứ parse bình thường
      return await handleResponse(response);
    } catch (error) {
      console.error("Lỗi lấy vé theo suất chiếu:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // 3. GET: Lấy vé theo Hóa đơn
  const getTicketsByBill = async (billId) => {
    const response = await fetch(`${API_BASE}/tickets/bill/${billId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  };

  return (
    <TicketContext.Provider
      value={{
        isLoading,
        createTicket,
        getTicketsByShowtime,
        getTicketsByBill,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => useContext(TicketContext);
