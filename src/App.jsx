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

// 1. IMPORT USER PROVIDER
import { UserProvider } from "./context/UserContext"; // Hãy chắc chắn đường dẫn đúng folder context của bạn

// Component bảo vệ route admin - chỉ kiểm tra đăng nhập
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Component bảo vệ route yêu cầu đăng nhập
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
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

      {/* 2. ADMIN ROUTES - ĐƯỢC BỌC BỞI USER PROVIDER */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            {/* UserProvider chỉ hoạt động trong khu vực Admin */}
            <UserProvider>
              <AdminLayout />
            </UserProvider>
          </ProtectedAdminRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
