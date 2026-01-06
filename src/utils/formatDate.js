// Hàm format ngày giờ Việt Nam (dd/MM/yyyy HH:mm)
export const formatDateTime = (dateInput) => {
    if (!dateInput) return "";

    const date = new Date(dateInput);

    // Kiểm tra nếu date không hợp lệ
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Dùng định dạng 24h
        timeZone: "Asia/Ho_Chi_Minh" // Ép về múi giờ Việt Nam
    }).format(date);
};

// Hàm format ngày (dd/MM/yyyy)
export const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh"
    }).format(date);
};