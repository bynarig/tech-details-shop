"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  useEffect(() => {
    // Verify the token is valid before showing the form
    const verifyToken = async () => {
      if (!token) {
        setError("Missing reset token");
        setIsChecking(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        const data = await response.json();
        
        if (response.ok && data.valid) {
          setIsValidToken(true);
        } else {
          setError(data.error || "Invalid or expired token");
        }
      } catch (error) {
        setError("Failed to verify reset token");
      } finally {
        setIsChecking(false);
      }
    };
    
    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Clear the form
        setPassword("");
        setConfirmPassword("");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
            <h2 className="card-title text-2xl mb-6 text-center">Reset Your Password</h2>
            
            {isChecking ? (
              <div className="flex justify-center my-8">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-3">Verifying your reset link...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                
                {success ? (
                  <div className="alert alert-success mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span>Password reset successful!</span>
                      <p className="text-sm">Redirecting to login page...</p>
                    </div>
                  </div>
                ) : isValidToken ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your new password"
                        className="input input-bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                    
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">Confirm New Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm your new password"
                        className="input input-bordered"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                    
                    <div className="form-control mt-6">
                      <button
                        type="submit"
                        className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center my-4">
                    <p>This password reset link is invalid or has expired.</p>
                    <Link href="/forgot-password" className="btn btn-primary mt-4">
                      Request a new link
                    </Link>
                  </div>
                )}
              </>
            )}
            
            <div className="mt-6 text-center">
              <Link href="/login" className="link link-primary">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}