"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function UserEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';
  
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isNew) {
      fetchUser();
    }
  }, [id, isNew]);
  
  async function fetchUser() {
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const userData = await response.json();
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setRole(userData.role);
    } catch (error: any) {
      console.error('Error fetching user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    
    if (isNew && !password) {
      setError('Password is required for new users');
      return;
    }
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setSaving(true);
    
    try {
      const userData = {
        name,
        email,
        role
      };
      
      if (password) {
        // Only include password if it's provided (for edits) or required (for new users)
        Object.assign(userData, { password });
      }
      
      let response;
      
      if (isNew) {
        // Create new user
        response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      } else {
        // Update existing user
        response = await fetch(`/api/admin/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save user');
      }
      
      // Redirect to users list on success
      router.push('/admin/users');
    } catch (error: any) {
      console.error('Error saving user:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create New User' : `Edit User: ${user?.name}`}
        </h1>
        <Link href="/admin/users" className="btn btn-outline">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Users
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select 
                className="select select-bordered"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  {isNew ? 'Password' : 'New Password (leave empty to keep current)'}
                </span>
              </label>
              <input 
                type="password" 
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={isNew}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input 
                type="password" 
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={isNew || !!password}
              />
            </div>
          </div>
          
          {!isNew && user && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-2">User Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Created:</span> {formatDate(user.createdAt)}
                </div>
                {user.updatedAt && (
                  <div>
                    <span className="font-semibold">Last Updated:</span> {formatDate(user.updatedAt)}
                  </div>
                )}
                <div>
                  <span className="font-semibold">ID:</span> {user.id}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <Link href="/admin/users" className="btn btn-outline mr-2">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                isNew ? 'Create User' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}