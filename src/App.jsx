import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AllPhim from "./pages/AllPhim";
import CardPhim from "./pages/CardPhim";
import Booking from "./pages/Booking";
import News from "./pages/News";
import Cinemas from "./pages/Cinemas";
import BookingHistory from "./pages/BookingHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route "/" sẽ hiển thị Home.jsx */}
        <Route path="/" element={<Home />} />
        <Route path="/all" element={<AllPhim />} />
        <Route path="/movie/:id" element={<CardPhim />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/news" element={<News />} />
        <Route path="/cinemas" element={<Cinemas />} />
        <Route path="/booking-history" element={<BookingHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
