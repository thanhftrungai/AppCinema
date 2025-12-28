import React from "react";
import { Loader2, MapPin } from "lucide-react";
// Import Context
import { useCinemaContext } from "../context/CinemaContext";
// Import Layout components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Cinemas = () => {
  const { cinemas, isLoading } = useCinemaContext();

  // Lọc các rạp đang hoạt động
  const activeCinemas = cinemas.filter((c) => c.status === "ACTIVE");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-slate-500">Đang tải danh sách rạp...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống rạp</h1>
        <p className="text-gray-600 mb-8">
          Danh sách các rạp chiếu phim hiện có trên toàn quốc
        </p>

        {activeCinemas.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow">
            Hiện tại chưa có rạp nào đang hoạt động.
          </div>
        ) : (
          <div className="space-y-4">
            {activeCinemas.map((c) => (
              <div
                key={c.cinemaId}
                // Thêm cursor-pointer để người dùng biết thẻ này có thể click (nếu sau này bạn muốn link tới trang chi tiết)
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 group cursor-default"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* --- PHẦN ẢNH --- */}
                  <div className="relative overflow-hidden rounded-lg w-full sm:w-[220px] h-[140px] flex-shrink-0">
                    <img
                      // Sử dụng loremflickr với từ khóa 'cinema,theater'
                      // lock={c.cinemaId} giúp giữ ảnh cố định cho từng rạp, không bị đổi mỗi lần reload
                      src={`https://loremflickr.com/440/280/cinema,theater?lock=${c.cinemaId}`}
                      alt={c.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* --- PHẦN NỘI DUNG --- */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {c.name}
                      </h3>
                    </div>

                    <div className="flex items-start gap-2 mt-2 text-gray-600 text-sm">
                      <MapPin
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-red-500"
                      />
                      <p>{c.address}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        2D
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                        3D
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                        Popcorn
                      </span>
                    </div>
                  </div>

                  {/* Đã xóa nút "Xem suất chiếu" ở đây */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cinemas;
