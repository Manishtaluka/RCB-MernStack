import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/posts", label: "News" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/matches", label: "Matches" },
];

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded font-poppins font-bold text-sm ${
    isActive ? "bg-rcb-gold text-black" : "text-white hover:bg-white/10"
  }`;

export default function AdminLayout() {
  return (
    <div className="container mx-auto pt-28 pb-16 flex flex-col md:flex-row gap-6 min-h-[70vh]">
      <aside className="md:w-48 flex md:flex-col gap-2 flex-wrap">
        <h2 className="hidden md:block font-poppins font-bold text-rcb-gold text-lg mb-2">
          Admin
        </h2>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            {l.label}
          </NavLink>
        ))}
      </aside>

      <main className="flex-1 bg-black/50 backdrop-blur rounded-lg p-6">
        <Outlet />
      </main>
    </div>
  );
}
