import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import ChatWidget from "./components/chat/ChatWidget";

// Context providers
import { UserProvider } from "./context/UserContext";
import { BillProvider } from "./context/BillContext";
import { TicketProvider } from "./context/TicketContext";

// Guard admin routes
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guard user routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token")
  );
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const syncAuth = () => setAuthToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);
    window.addEventListener("visibilitychange", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
      window.removeEventListener("visibilitychange", syncAuth);
    };
  }, []);

  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
  }, [location.pathname]);

  return (
    // Wrap providers outside routes so booking screens can use shared data
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

        {/* Floating user chat widget, hidden on admin screens and when logged out */}
        {!isAdminRoute && authToken && <ChatWidget />}
      </TicketProvider>
    </BillProvider>
  );
}

export default App;
