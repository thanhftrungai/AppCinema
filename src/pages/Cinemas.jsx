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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinemas.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
              <p className="text-gray-600 mt-1 text-sm">{c.address}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cinemas;
