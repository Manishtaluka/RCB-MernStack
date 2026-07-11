import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Account from "./pages/Account.jsx";
import Store from "./pages/Store.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Scores from "./pages/Scores.jsx";
import News from "./pages/News.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminPosts from "./pages/admin/AdminPosts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminMatches from "./pages/admin/AdminMatches.jsx";
import useSessionRestore from "./hooks/useSessionRestore.js";

export default function App() {
  useSessionRestore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<PostDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="matches" element={<AdminMatches />} />
        </Route>
      </Routes>
    </div>
  );
}
