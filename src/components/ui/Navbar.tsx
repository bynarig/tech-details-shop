"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { categories } from "@/lib/data";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/');
    }
  };
  
  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isMenuOpen ? 'block' : 'hidden'}`}>

            <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2">
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link href={`/category/${category.slug}`}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>


          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">Tech Details Shop</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">

          <li>
            <details>
              <summary>Categories</summary>
              <ul className="p-2 bg-base-100 z-50">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>

        </ul>
      </div>
      <div className="navbar-end">
        <div className="form-control mr-2 hidden sm:block">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        
        {/* Authentication-based UI */}
        {user ? (
          // User is logged in - Show user dropdown
          <div className="dropdown dropdown-end mx-2">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full flex items-center justify-center bg-primary text-primary-content">
                {user.name ? user.name.charAt(0).toUpperCase() : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2">
                <span>Hello, {user.name || 'User'}</span>
              </li>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/account/orders">My Orders</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          // User is not logged in - Show login button
          <Link href="/login" className="btn btn-primary btn-sm mx-2">
            Login
          </Link>
        )}
        
        {/* Shopping cart - Always visible */}
        <Link href="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="badge badge-sm indicator-item">3</span>
          </div>
        </Link>
      </div>
    </div>
  );
}