"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

interface OrderListProps {
  filters: {
    status: string;
    dateFrom: string;
    dateTo: string;
    search: string;
  };
}

export default function OrderList({ filters }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      
      try {
        // Build query params
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        
        if (filters.status) {
          params.append('status', filters.status);
        }
        
        if (filters.dateFrom) {
          params.append('dateFrom', filters.dateFrom);
        }
        
        if (filters.dateTo) {
          params.append('dateTo', filters.dateTo);
        }
        
        if (filters.search) {
          params.append('search', filters.search);
        }
        
        const response = await fetch(`/api/admin/orders?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
          setTotalPages(data.totalPages);
        } else {
          setError("Failed to load orders");
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currentPage, filters]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error my-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
        <p className="mt-2 text-lg">No orders found</p>
        <p className="text-gray-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover">
                <td className="font-medium">#{order.orderNumber}</td>
                <td>
                  <div>{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td>{order.items}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>{formatDate(order.date)}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link 
                    href={`/admin/orders/${order.id}`} 
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center p-4">
          <div className="join">
            <button 
              className="join-item btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              «
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              className="join-item btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}