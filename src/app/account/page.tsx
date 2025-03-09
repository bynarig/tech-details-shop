"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      }
      setIsAuthChecked(true);
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        console.log("Logout successful, redirecting to home");
        router.push('/');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading state while auth is being checked
  if (loading || (!user && !isAuthChecked)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen container mx-auto px-4 py-10 flex justify-center items-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Loading your account...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user && isAuthChecked) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen container mx-auto px-4 py-10">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">My Account</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="text-xl font-bold mb-2">Personal Information</h3>
                    <div className="mb-4">
                      <p className="font-semibold">Name:</p>
                      <p>{user?.name}</p>
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold">Email:</p>
                      <p>{user?.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button className="btn btn-primary btn-sm">
                        Edit Profile
                      </button>
                      <button className="btn btn-outline btn-sm">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-base-200 mt-6">
                  <div className="card-body">
                    <h3 className="text-xl font-bold mb-2">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-primary">
                              <Link href="/account/orders/123" className="link">ORD-123456</Link>
                            </td>
                            <td>March 5, 2025</td>
                            <td>
                              <span className="badge badge-success">Delivered</span>
                            </td>
                            <td>$149.99</td>
                          </tr>
                          <tr>
                            <td className="text-primary">
                              <Link href="/account/orders/124" className="link">ORD-123457</Link>
                            </td>
                            <td>February 28, 2025</td>
                            <td>
                              <span className="badge badge-info">Shipped</span>
                            </td>
                            <td>$89.99</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-center mt-2">
                      <Link href="/account/orders" className="link link-primary">
                        View All Orders
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="text-xl font-bold mb-2">Account Actions</h3>
                    <div className="flex flex-col gap-2">
                      <Link href="/account/orders" className="btn btn-outline btn-block justify-start">
                        My Orders
                      </Link>
                      <Link href="/account/wishlist" className="btn btn-outline btn-block justify-start">
                        Wishlist
                      </Link>
                      <Link href="/account/addresses" className="btn btn-outline btn-block justify-start">
                        Addresses
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="btn btn-error btn-outline btn-block justify-start mt-4"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}