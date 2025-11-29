// Centralized mock data for movies and genres
// Use this across pages (Home, AllPhim, CardPhim) and components

export const genres = [
  "Tất cả",
  "Hành động",
  "Hài hước",
  "Kinh dị",
  "Tình cảm",
  "Khoa học viễn tưởng",
  "Phiêu lưu",
  "Chính kịch",
];

export const moviesNow = [
  {
    id: 1,
    title: "Avengers: Endgame",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    rating: 8.4,
    age: "13+",
    duration: "181 phút",
    releaseDate: "26/04/2024",
    genres: ["Hành động", "Khoa học viễn tưởng"],
    description:
      "Biệt đội Avengers tập hợp cho trận chiến cuối cùng nhằm đảo ngược mọi thứ mà Thanos đã gây ra.",
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    image:
      "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
    rating: 8.7,
    age: "13+",
    duration: "148 phút",
    releaseDate: "17/12/2024",
    genres: ["Hành động", "Phiêu lưu"],
    description:
      "Peter Parker đối mặt với đa vũ trụ cùng những kẻ phản diện huyền thoại trở lại.",
  },
  {
    id: 3,
    title: "Oppenheimer",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    rating: 8.5,
    age: "16+",
    duration: "180 phút",
    releaseDate: "21/07/2024",
    genres: ["Chính kịch"],
    description:
      "Câu chuyện về cha đẻ bom nguyên tử J. Robert Oppenheimer cùng những hệ lụy lịch sử.",
  },
  {
    id: 4,
    title: "The Batman",
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    rating: 7.9,
    age: "16+",
    duration: "176 phút",
    releaseDate: "04/03/2024",
    genres: ["Hành động", "Chính kịch"],
    description:
      "Batman đối đầu Riddler trong một Gotham tăm tối và đầy bí ẩn.",
  },
  {
    id: 5,
    title: "Dune: Part Two",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    rating: 8.8,
    age: "13+",
    duration: "166 phút",
    releaseDate: "01/03/2024",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu"],
    description:
      "Paul Atreides tiếp tục hành trình cùng người Fremen để trả thù cho gia tộc.",
  },
  {
    id: 6,
    title: "Barbie",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=600&fit=crop",
    rating: 7.2,
    age: "P",
    duration: "114 phút",
    releaseDate: "21/07/2024",
    genres: ["Hài hước", "Tình cảm"],
    description:
      "Barbie rời thế giới búp bê để khám phá hiện thực và ý nghĩa cuộc sống.",
  },
];

export const moviesUpcoming = [
  {
    id: 7,
    title: "Avatar 3",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    rating: 8.0,
    age: "13+",
    duration: "192 phút",
    releaseDate: "15/12/2024",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu"],
    description:
      "Phần tiếp theo của hành trình trên Pandora với những bộ tộc và bí ẩn mới.",
  },
  {
    id: 8,
    title: "Aquaman 2",
    image:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    rating: 7.8,
    age: "13+",
    duration: "164 phút",
    releaseDate: "22/12/2024",
    genres: ["Hành động", "Phiêu lưu"],
    description:
      "Aquaman trở lại để bảo vệ vương quốc Atlantis trước mối hiểm hoạ mới.",
  },
  {
    id: 9,
    title: "Wonka",
    image:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop",
    rating: 8.2,
    age: "P",
    duration: "116 phút",
    releaseDate: "29/12/2024",
    genres: ["Hài hước", "Phiêu lưu"],
    description:
      "Khởi nguồn của nhà phát minh chocolate Willy Wonka với câu chuyện đầy màu sắc.",
  },
  {
    id: 10,
    title: "Killers of the Flower Moon",
    image:
      "https://images.unsplash.com/photo-1533613220915-609f21a91335?w=400&h=600&fit=crop",
    rating: 8.3,
    age: "16+",
    duration: "206 phút",
    releaseDate: "05/01/2025",
    genres: ["Chính kịch"],
    description:
      "Tội ác nhắm vào người Osage và cuộc điều tra đã khai sinh ra FBI.",
  },
];

export const allMovies = [...moviesNow, ...moviesUpcoming];

export function filterMoviesByGenre(list, genre) {
  if (!genre || genre === "Tất cả") return list;
  return list.filter((m) => (m.genres || []).includes(genre));
}
