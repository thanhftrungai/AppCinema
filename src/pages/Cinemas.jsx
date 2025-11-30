import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const cinemas = [
  { id: "cgv-times", name: "CGV Times City", address: "458 Minh Khai, Hai Bà Trưng, Hà Nội" },
  { id: "bhd-vincom", name: "BHD Star Vincom", address: "54 Nguyễn Chí Thanh, Đống Đa, Hà Nội" },
  { id: "galaxy-ngu-quyen", name: "Galaxy Nguyễn Du", address: "116 Nguyễn Du, Quận 1, TP.HCM" },
  { id: "lotte-go-vap", name: "Lotte Gò Vấp", address: "242 Nguyễn Văn Lượng, Gò Vấp, TP.HCM" },
  { id: "beta-mydinh", name: "Beta Mỹ Đình", address: "Mỹ Đình, Nam Từ Liêm, Hà Nội" },
  { id: "mega-gs", name: "Mega GS Cao Thắng", address: "19 Cao Thắng, Quận 3, TP.HCM" },
];

const Cinemas = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Hệ thống rạp</h1>

        <div className="space-y-4">
          {cinemas.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={`https://picsum.photos/seed/${c.id}/200/140`}
                  alt={c.name}
                  className="w-full sm:w-[220px] h-[140px] object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-gray-600 mt-1 text-sm">{c.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">2D</span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">3D</span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">IMAX</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cinemas;
