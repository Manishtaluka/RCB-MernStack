import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi.js";
import { logout } from "../redux/slices/authSlice.js";

export default function Account() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto pt-32 pb-16 min-h-[60vh]">
      <div className="max-w-md mx-auto bg-black/50 backdrop-blur rounded-lg p-8 text-center">
        <h1 className="font-poppins font-bold text-white text-3xl mb-6">
          My <span className="text-rcb-gold">Account</span>
        </h1>

        <div className="text-left font-poppins text-white/90 space-y-2 mb-8">
          <p>
            <span className="text-rcb-gold font-bold">Name:</span> {user?.name}
          </p>
          <p>
            <span className="text-rcb-gold font-bold">Email:</span> {user?.email}
          </p>
          <p>
            <span className="text-rcb-gold font-bold">Role:</span> {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-rcb-gold text-black font-poppins font-bold italic px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
