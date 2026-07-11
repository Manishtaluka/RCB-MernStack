import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../redux/slices/cartSlice.js";
import { logout as logoutAction } from "../redux/slices/authSlice.js";
import { logoutUser } from "../api/authApi.js";

const navLinkClass = ({ isActive }) =>
  `font-poppins font-bold transition-colors ${
    isActive ? "text-rcb-gold" : "text-white hover:text-rcb-gold"
  }`;

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the request fails, clear local state so the UI reflects logout
    } finally {
      dispatch(logoutAction());
      navigate("/");
    }
  };

  return (
    <nav className="w-full bg-transparent">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="https://i.pinimg.com/originals/7c/d7/eb/7cd7ebcfa9f8d976b74535181907fe79.png"
            alt="RCB logo"
            className="h-24"
          />
          <h1 className="font-impact font-black text-3xl text-white">
            #PLAY <span className="text-rcb-gold">BOLD</span>
          </h1>
        </Link>

        <div className="flex flex-wrap items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/store" className={navLinkClass}>
            Store
          </NavLink>
          <NavLink to="/scores" className={navLinkClass}>
            Scores
          </NavLink>
          <NavLink to="/news" className={navLinkClass}>
            News
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
          <Link to="/cart" className="relative font-poppins font-bold text-white hover:text-rcb-gold">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-rcb-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/account" className="font-poppins font-bold text-white hover:text-rcb-gold">
                {user?.name?.split(" ")[0] || "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="font-poppins font-bold text-white/70 hover:text-rcb-gold text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-poppins font-bold bg-rcb-gold text-black italic px-4 py-2 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
