"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if the user is an admin, if not redirect to login
  useEffect(() => {
    // Only run the check when loading is complete
    if (!loading) {
      console.log("Auth state:", { user, loading, userRole: user?.role });
      
      if (!user) {
        // User is not logged in
        console.log("No user found, redirecting to login");
        router.push("/login?redirect=/admin");
        setIsAuthorized(false);
      } else if (user.role !== "admin") {
        // User is logged in but not an admin
        console.log("User is not admin, redirecting to home");
        router.push("/");
        setIsAuthorized(false);
      } else {
        // User is admin, allow access
        console.log("Admin user confirmed, allowing access");
        setIsAuthorized(true);
      }
      
      setAuthChecked(true);
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading || isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Don't render anything during redirect
  if (!isAuthorized && authChecked) {
    return null;
  }

  // Render admin content
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
}