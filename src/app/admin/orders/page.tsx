"use client";

import { useState } from "react";
import OrderList from "@/components/admin/orders/OrderList";
import OrderFilter from "@/components/admin/orders/OrderFilter";

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      <OrderFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="mt-6">
        <OrderList filters={filters} />
      </div>
    </>
  );
}