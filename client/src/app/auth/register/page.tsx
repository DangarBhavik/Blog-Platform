'use client';

import useRegister from "@/hooks/auth/useRegister";
import { useState } from "react";
import Link from "next/link";
import { 
  FiMail, 
  FiLock, 
  FiUserPlus, 
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowLeft,
  FiCheckCircle
} from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const { mutate, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    
    if (isFormValid) {
      mutate({
        name,
        email,
        password,
      });
    }
  };

  const getNameError = () => {
    if (!touched.name) return "";
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
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
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) return "Password must contain both letters and numbers";
    return "";
  };

  const getConfirmPasswordError = () => {
    if (!touched.confirmPassword) return "";
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const nameError = getNameError();
  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const confirmPasswordError = getConfirmPasswordError();
  
  const isFormValid = name && email && password && confirmPassword && 
    !nameError && !emailError && !passwordError && !confirmPasswordError;

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
  const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 flex items-center justify-center px-4 relative overflow-hidden py-12">
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
              Join NexusBlog
            </h1>
            <p className="text-stone-500 mt-2 text-sm">
              Start your creative journey today
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Registration Failed</p>
                <p className="text-xs text-red-600 mt-1">
                  {(error as any).response?.data?.message || error.message || "Unable to create account. Please try again."}
                </p>
              </div>
            </div>
          )}

          {/* Success Message would go here */}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) setTouched({ ...touched, name: true });
                  }}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm
                    ${nameError && touched.name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-stone-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent'
                    }`}
                />
              </div>
              {nameError && touched.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="h-3 w-3" />
                  {nameError}
                </p>
              )}
            </div>

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
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
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
                  placeholder="Create a password"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-500">
                    Password strength: {strengthTexts[passwordStrength]}
                  </p>
                </div>
              )}
              
              {passwordError && touched.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="h-3 w-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCheckCircle className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (touched.confirmPassword) setTouched({ ...touched, confirmPassword: true });
                  }}
                  onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm
                    ${confirmPasswordError && touched.confirmPassword 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-stone-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  )}
                </button>
              </div>
              {confirmPasswordError && touched.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="h-3 w-3" />
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button 
              type="submit" 
              disabled={isPending || !isFormValid}
              className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <FiUserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-stone-200"></div>
            <span className="text-xs text-stone-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 border-t border-stone-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-200">
              <FaGoogle className="h-4 w-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-200">
              <FaGithub className="h-4 w-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-600">GitHub</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-stone-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}