// 👇 1. Lấy URL Backend từ biến môi trường
// - Trên Vercel: Nó sẽ lấy link https://cinema-web-mme8.onrender.com
// - Dưới Local: Nó sẽ là chuỗi rỗng "" (để tiếp tục dùng Proxy trong vite.config.js)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const request = async (endpoint, options = {}) => {
    // 2. Lấy token từ local storage
    const token = localStorage.getItem("token");

    // 3. Chuẩn bị Header
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // 👇 4. Ghép Base URL với Endpoint
    // Ví dụ: "" + "/cinema/users" (Local)
    // Hoặc: "https://...render.com" + "/cinema/users" (Vercel)
    const url = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, { // <-- Dùng biến 'url' mới tạo thay vì 'endpoint'
            ...options,
            headers,
        });

        // 5. Xử lý lỗi 401 (Hết hạn token)
        if (response.status === 401) {
            // Xóa sạch dữ liệu
            localStorage.removeItem("token");
            localStorage.removeItem("authenticated");
            localStorage.removeItem("username");
            // Xóa luôn các dữ liệu tạm booking nếu có
            localStorage.removeItem("activeBillId");
            localStorage.removeItem("user");

            // Hiện Alert chặn màn hình
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

            // Sau khi bấm OK thì chuyển về Login
            window.location.href = "/login";

            // Ném lỗi để dừng các xử lý phía sau
            return Promise.reject(new Error("Phiên đăng nhập hết hạn"));
        }

        return response;
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        throw error;
    }
};