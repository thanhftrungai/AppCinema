import React, { useState } from "react";
import { Menu } from "lucide-react";

// Import các component con
import { AdminSidebar } from "./AdminSidebar";
import { AdminDashboard } from "./AdminDashboard";
import { ManageMovies } from "./ManageMovies";
import { ManageCinemas } from "./ManageCinemas";
import { ManageShowtimes } from "./ManageShowtimes";
import { ManageBookings } from "./ManageBookings";
import { ManageUsers } from "./ManageUsers";

export const AdminLayout = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hàm quyết định hiển thị component nào dựa trên menu đang chọn
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <AdminDashboard />;
      case "movies":
        return <ManageMovies />;
      case "cinemas":
        return <ManageCinemas />;
      case "showtimes":
        return <ManageShowtimes />;
      case "bookings":
        return <ManageBookings />;
      case "users":
        return <ManageUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Toggle (chỉ hiện trên màn hình nhỏ) */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-semibold text-slate-900">Admin Panel</span>
        </div>

        {/* Nội dung thay đổi (Scrollable) */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
