"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order } from "@/types";

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const response = await fetch('/api/admin/orders?limit=5');
        if (response.ok) {
          const data = await response.json();
          // Extract the orders array from the response object
          setOrders(data.orders || []); // Use data.orders instead of data directly
        } else {
          setError("Failed to load recent orders");
        }
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRecentOrders();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge-success';
      case 'processing':
        return 'badge-info';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="flex justify-center my-4">
          <span className="loading loading-spinner"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <Link href="/admin/orders" className="btn btn-sm btn-link">
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover">
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatDate(order.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}