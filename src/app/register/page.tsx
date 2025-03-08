"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

// In the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault();
	setError("");
	setEmailExists(false);
  
	if (password !== confirmPassword) {
	  setError("Passwords do not match");
	  return;
	}
  
	setIsLoading(true);
  
	try {
	  const result = await register(name, email, password);
	  
	  if (result.success) {
		router.push('/account');
	  } else {
		// Check specifically for the EMAIL_EXISTS code
		if (result.code === 'EMAIL_EXISTS') {
		  setEmailExists(true);
		}
		setError(result.error || 'Registration failed');
	  }
	} catch (error) {
	  setError("An error occurred. Please try again later.");
	} finally {
	  setIsLoading(false);
	}
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 text-center">Create Account</h2>
            
            {error && (
              <div className={`alert ${emailExists ? 'alert-info' : 'alert-error'} mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={emailExists ? 
                    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : 
                    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                </svg>
                <span>{error}</span>
                {emailExists && (
                  <div>
                    <Link href="/login" className="btn btn-sm btn-primary ml-2">
                      Go to Login
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  className="input input-bordered" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="input input-bordered" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  className="input input-bordered" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="Confirm your password" 
                  className="input input-bordered" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
            
            <div className="divider">OR</div>
            
            <p className="text-center">
              Already have an account?
              <Link href="/login" className="link link-primary ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}