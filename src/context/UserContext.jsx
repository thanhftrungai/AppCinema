/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- SỬA Ở ĐÂY ---
  // Bỏ dòng API_URL cứng, dùng đường dẫn tương đối giống MovieContext
  // Thêm "/cinema" vào trước "/users"
  const API_ENDPOINT = "/cinema/users";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const handleResponse = async (response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new Error(data.message || `Lỗi API: ${response.status}`);
    }
    return data;
  };

  // 1. GET
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi endpoint tương đối
      const response = await fetch(API_ENDPOINT, {
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response);

      // Logic xử lý dữ liệu giữ nguyên
      const rawList = Array.isArray(data) ? data : data.result || [];
      const mappedData = rawList.map((item) => ({
        id: item.userId || item.id,
        username: item.username,
        email: item.email,
        roles: Array.isArray(item.roles)
          ? item.roles.map((r) => r.name || r).join(", ")
          : item.role || "USER",
        joinDate: item.createdAt || "N/A",
        status: item.enabled ? "Active" : "Active",
      }));

      setUsers(mappedData);
    } catch (err) {
      console.error("Lỗi tải users:", err);
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. DELETE
  const deleteUser = async (id) => {
    try {
      // Sửa endpoint xóa
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      await handleResponse(response);
      await fetchUsers();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 3. UPDATE
  const updateUser = async (id, userData) => {
    try {
      // Sửa endpoint sửa
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      await handleResponse(response);
      await fetchUsers();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{ users, isLoading, error, fetchUsers, deleteUser, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
