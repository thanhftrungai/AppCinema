export const request = async (endpoint, options = {}) => {
    // 1. Lấy token từ local storage
    const token = localStorage.getItem("token");

    // 2. Chuẩn bị Header
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(endpoint, {
            ...options,
            headers,
        });

        // 3. Xử lý lỗi 401 (Hết hạn token)
        if (response.status === 401) {
            // Xóa sạch dữ liệu
            localStorage.removeItem("token");
            localStorage.removeItem("authenticated");
            localStorage.removeItem("username");

            // Hiện Alert chặn màn hình
            // Code sẽ dừng ở dòng này cho đến khi User bấm "OK"
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