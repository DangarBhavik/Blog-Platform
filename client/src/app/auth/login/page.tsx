'use client';

import useLogin from "@/hooks/auth/useLogin";
import { useState } from "react";
import Link from "next/link";
import { 
  FiMail, 
  FiLock, 
  FiLogIn, 
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiArrowLeft
} from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    setTouched({ email: true, password: true });
    
    mutate({
      email,
      password,
    });
  };

  const getEmailError = () => {
    if (!touched.email) return "";
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const getPasswordError = () => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-amber-100/20 via-transparent to-amber-100/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors duration-200 mb-6 group"
        >
          <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-100/50">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-500 shadow-lg mb-4">
              <HiOutlineSparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-stone-500 mt-2 text-sm">
              Sign in to continue your creative journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Authentication Failed</p>
                <p className="text-xs text-red-600 mt-1">
                  {(error as any).response?.data?.message || error.message || "Invalid email or password. Please try again."}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setTouched({ ...touched, email: true });
                  }}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm
                    ${emailError && touched.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-stone-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent'
                    }`}
                />
              </div>
              {emailError && touched.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-amber-600 hover:text-amber-700 transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) setTouched({ ...touched, password: true });
                  }}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm
                    ${passwordError && touched.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-stone-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  )}
                </button>
              </div>
              {passwordError && touched.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="h-3 w-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isPending || !isFormValid}
              className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-stone-600 mt-6">
            Dont have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
            >
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}