import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AllPhim from "./pages/AllPhim";
import CardPhim from "./pages/CardPhim";
import Booking from "./pages/Booking";
import News from "./pages/News";
import Cinemas from "./pages/Cinemas";
import BookingHistory from "./pages/BookingHistory";
import AllUpcoming from "./pages/AllUpcoming";
import Account from "./pages/Account";
import { AdminLayout } from "./admin/AdminLayout";

// 1. IMPORT CÁC CONTEXT
import { UserProvider } from "./context/UserContext";
import { BillProvider } from "./context/BillContext"; // <--- Thêm dòng này
import { TicketProvider } from "./context/TicketContext"; // <--- Thêm dòng này

// Component bảo vệ route admin
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Component bảo vệ route user
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    /* 2. BỌC PROVIDER Ở NGOÀI CÙNG (HOẶC BAO QUANH ROUTES)
       Để Booking.jsx và BookingHistory.jsx có thể sử dụng createBill, createTicket...
    */
    <BillProvider>
      <TicketProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<AllPhim />} />
          <Route path="/upcoming" element={<AllUpcoming />} />
          <Route path="/movie/:id" element={<CardPhim />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/news" element={<News />} />
          <Route path="/cinemas" element={<Cinemas />} />

          {/* Protected User Routes */}
          <Route
            path="/booking-history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <UserProvider>
                  <AdminLayout />
                </UserProvider>
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TicketProvider>
    </BillProvider>
  );
}

export default App;
