import { Routes, Route } from "react-router-dom"; // ❌ Bỏ import BrowserRouter
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

function App() {
  return (
      // ❌ ĐÃ XÓA <BrowserRouter> ở đây vì main.jsx đã có rồi
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all" element={<AllPhim />} />
        <Route path="/upcoming" element={<AllUpcoming />} />
        <Route path="/movie/:id" element={<CardPhim />} />

        {/* Đã xóa dòng duplicate /upcoming ở đây */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/news" element={<News />} />
        <Route path="/cinemas" element={<Cinemas />} />
        <Route path="/booking-history" element={<BookingHistory />} />
      </Routes>
  );
}

export default App;