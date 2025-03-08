"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  totalOrders?: number;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    
    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchTerm(search);
    if (role) setSelectedRole(role);
    
    fetchUsers();
  }, [searchParams]);
  
  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Build query params
      let url = `/api/admin/users?page=${currentPage}&limit=50`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedRole) url += `&role=${selectedRole}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/users?${params.toString()}`);
  }
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page on new search
    router.push(`/admin/users?${params.toString()}`);
  }
  
  function handleRoleFilter(role: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    params.set('page', '1'); // Reset to first page on filter change
    router.push(`/admin/users?${params.toString()}`);
  }
  
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove user from list
        setUsers(users.filter(user => user.id !== id));
        // Optionally refresh the list to update counts
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
  
  if (loading && users.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  
  if (error) {
    return <div className="alert alert-error">
      <span>{error}</span>
    </div>;
  }
  
  function getRoleBadgeClass(role: string) {
    switch(role) {
      case 'admin':
        return 'badge-primary';
      case 'user':
        return 'badge-secondary';
      default:
        return 'badge-neutral';
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Link href="/admin/users/new" className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>
          Add New User
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>
          
          {/* Role Filter */}
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="select select-bordered" 
              value={selectedRole}
              onChange={(e) => handleRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/users/${user.id}`}
                      className="btn btn-sm btn-info"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div>
            Showing {users.length} of {totalUsers} users
          </div>
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}