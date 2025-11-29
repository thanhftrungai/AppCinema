import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const articles = [
  {
    id: 1,
    title: "10 bộ phim hành động đáng xem nhất năm",
    cover: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&h=500&fit=crop",
    excerpt: "Danh sách tổng hợp những bộ phim hành động đỉnh cao, không thể bỏ lỡ.",
    date: "28/11/2025",
  },
  {
    id: 2,
    title: "Review Oppenheimer: Kiệt tác sử thi của Nolan",
    cover: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=800&h=500&fit=crop",
    excerpt: "Một bộ phim giàu chiều sâu với nhịp kể cuốn hút và diễn xuất ấn tượng.",
    date: "20/11/2025",
  },
  {
    id: 3,
    title: "Dune Part Two: Thế giới sa mạc trở lại",
    cover: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=500&fit=crop",
    excerpt: "Tiếp nối câu chuyện với quy mô lớn hơn, hoành tráng hơn.",
    date: "05/11/2025",
  },
];

const News = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tin tức phim</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <article key={a.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
              <img src={a.cover} alt={a.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{a.date}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-gray-600 text-sm">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default News;
