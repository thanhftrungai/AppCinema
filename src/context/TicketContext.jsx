/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback } from "react";
import { request } from "../utils/request";

const TicketContext = createContext();

export const useTicketContext = () => useContext(TicketContext);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. TẠO VÉ LẺ (Quan trọng: Wrapped useCallback)
  const createSingleTicket = useCallback(async (ticketData) => {
    const response = await request("/cinema/tickets", {
      method: "POST",
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) throw new Error("Lỗi kết nối API tạo vé");

    const data = await response.json();
    if (data.code !== 0 && data.code !== 1000) {
      throw new Error(data.message || "Tạo vé thất bại");
    }

    return data.result; // Trả về object ticket
  }, []);

  // 2. XÓA VÉ LẺ
  const deleteTicket = useCallback(async (ticketId) => {
    const response = await request(`/cinema/tickets/${ticketId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      console.warn("API xóa vé báo lỗi, nhưng UI vẫn sẽ cập nhật");
      return null;
    }
    return await response.json();
  }, []);

  // 3. LẤY VÉ ĐÃ BÁN
  const getTicketsByShowtime = useCallback(async (showtimeId) => {
    try {
      const response = await request(`/cinema/tickets/showtime/${showtimeId}`, {
        method: "GET"
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error("Lỗi lấy vé đã bán:", error);
      return [];
    }
  }, []);

  return (
      <TicketContext.Provider value={{
        tickets,
        isLoading,
        createSingleTicket,
        deleteTicket,
        getTicketsByShowtime
      }}>
        {children}
      </TicketContext.Provider>
  );
};