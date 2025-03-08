"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: "dashboard" },
  { name: "Orders", path: "/admin/orders", icon: "shopping_cart" },
  { name: "Categories", path: "/admin/categories", icon: "category" },
  { name: "Products", path: "/admin/products", icon: "inventory" },
  { name: "Users", path: "/admin/users", icon: "people" }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter(); // This was missing the import
  const { logout } = useAuth();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      // After logout, redirect to login page
      router.push('/login');
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <div className="w-64 bg-base-200 h-full flex flex-col">
      <div className="p-4 bg-primary text-primary-content">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      <ul className="menu p-4 space-y-1 flex-grow">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              href={item.path} 
              className={pathname === item.path ? "active" : ""}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="p-4 border-t">
        <Link href="/" className="btn btn-sm btn-outline w-full mb-2">
          <span className="material-symbols-outlined">storefront</span>
          View Store
        </Link>
        <button 
          className="btn btn-sm btn-outline btn-error w-full"
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
}