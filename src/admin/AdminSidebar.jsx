import React from "react";
import {
  LayoutDashboard,
  Film,
  Calendar,
  Users,
  Settings,
  X,
  LogOut,
} from "lucide-react";

export const AdminSidebar = ({
  activeMenu,
  setActiveMenu,
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "movies", icon: Film, label: "Quản lý Phim" },
    { id: "cinemas", icon: Settings, label: "Quản lý Rạp" },
    { id: "showtimes", icon: Calendar, label: "Quản lý Suất chiếu" },
    { id: "bookings", icon: Calendar, label: "Quản lý Đặt vé" },
    { id: "users", icon: Users, label: "Quản lý Users" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Cinema Admin</h1>
            <p className="text-sm text-slate-400 mt-1">Quản trị hệ thống</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${
                    activeMenu === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-800 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">
                admin@cinema.com
              </p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};
