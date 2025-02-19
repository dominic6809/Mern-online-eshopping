/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Tags, Package, Boxes, Users, ClipboardList } from "lucide-react";

const MenuItem = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
      ${isActive 
        ? 'bg-blue-50 text-blue-600 font-medium'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </NavLink>
);

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/categorylist", icon: Tags, label: "Categories" },
    { to: "/admin/productlist", icon: Package, label: "Create Product" },
    { to: "/admin/allproductslist", icon: Boxes, label: "All Products" },
    { to: "/admin/userlist", icon: Users, label: "Users" },
    { to: "/admin/orderlist", icon: ClipboardList, label: "Orders" },
  ];

  return (
    <>
      {/* Blur Overlay */}
      {/* {isMenuOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm transition-all duration-300 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )} */}

      {/* Hamburger Button - Always visible in top right */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Slide-out Menu */}
      <div className={`
        fixed top-0 right-0 h-full bg-white w-80 shadow-2xl transform transition-transform duration-300 ease-in-out z-40
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Close button inside menu */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your store</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </MenuItem>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;