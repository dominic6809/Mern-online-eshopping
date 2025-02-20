/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { 
  Home, 
  ShoppingBag, 
  LogIn, 
  UserPlus, 
  ShoppingCart, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Menu,
  X,
  User
} from "lucide-react";
import FavoritesCount from "../Products/FavoritesCount";

const NavItem = ({ to, icon: Icon, label, badge, onClick }) => (
  <Link
    to={to}
    className="flex items-center group py-3 transition-all duration-300 hover:bg-gray-100 rounded-lg px-3"
    onClick={onClick}
  >
    <div className="relative flex items-center">
      <Icon className="w-6 h-6 mr-3 text-gray-700 transition-transform group-hover:scale-110" />
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
      {badge}
    </div>
  </Link>
);

const ADMIN_MENU_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard" },
];

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const cartItemsCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    if (!isNavOpen) {
      setDropdownOpen(false);
    }
    document.body.style.overflow = !isNavOpen ? 'hidden' : 'unset';
  };

  const CartBadge = cartItemsCount > 0 && (
    <span className="absolute -top-2 -right-2 px-2 py-1 text-xs text-white bg-pink-500 rounded-full">
      {cartItemsCount}
    </span>
  );

  return (
    <>
      {/* Overlay */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={toggleNav}
        />
      )}

      {/* Menu Button */}
      <button
        onClick={toggleNav}
        className="fixed top-2 left-1 z-50 p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-md"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Navigation Sidebar */}
      <nav 
        className={`fixed h-[calc(100vh-16px)] w-64 m-2 bg-slate-100 rounded-lg shadow-lg transition-all duration-300 ease-in-out py-6 px-4 flex flex-col justify-between z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 top-0 bottom-0 ${
          isNavOpen ? "left-0" : "-left-66"
        }`}
      >
        <div className="relative">
          <button
            onClick={toggleNav}
            className="absolute top-0 left-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          <div className="space-y-2 mt-12">
            <NavItem to="/" icon={Home} label="Home" onClick={toggleNav} />
            <NavItem to="/shop" icon={ShoppingBag} label="Shop" onClick={toggleNav} />
            <NavItem to="/cart" icon={ShoppingCart} label="Cart" badge={CartBadge} onClick={toggleNav} />
            <NavItem to="/favorite" icon={Heart} label="Favorites" badge={<FavoritesCount />} onClick={toggleNav} />
          </div>
        </div>

        <div className="relative">
          {userInfo ? (
            <div className="space-y-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <span className="text-sm font-medium truncate" icon={User}>{userInfo.username}</span>
                {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {dropdownOpen && (
                <div className="absolute bottom-full left-0 w-full bg-white rounded-lg overflow-hidden shadow-lg mb-2">
                  {userInfo.isAdmin && (
                    <>
                      {ADMIN_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={toggleNav}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-200" />
                    </>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={toggleNav}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleNav();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <NavItem to="/login" icon={LogIn} label="Login" onClick={toggleNav} />
              <NavItem to="/register" icon={UserPlus} label="Register" onClick={toggleNav} />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;