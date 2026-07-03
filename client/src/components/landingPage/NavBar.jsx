'use client';

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { 
  FiFeather, 
  FiEdit2, 
  FiMenu, 
  FiX, 
  FiHome, 
  FiBookOpen, 
  FiTag, 
  FiUsers,
  FiLogIn 
} from 'react-icons/fi';
import Link from 'next/link';

export default function NavBar() {
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Premium Version */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-400 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-amber-600 to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <FiFeather className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </div>
            <span className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
              Nexus<span className="bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">Blog</span>
            </span>
          </div>

          {/* Navigation - Centered with Premium Styling */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Home', icon: FiHome , href : '/'},
              { name: 'Blogs', icon: FiBookOpen ,href : '/posts'},
              { name: 'My Blogs', icon: FiTag ,href : '/my-posts'},
              { name: 'Authors', icon: FiUsers ,href : '/posts'}
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors duration-200 relative group flex items-center gap-1.5"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-linear-to-r from-amber-500 to-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Actions - Premium Styling */}
          <div className="flex items-center gap-4">
            {!user && (
              <a
                href="/auth/login"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors duration-200"
              >
                <FiLogIn className="h-4 w-4" />
                Sign In
              </a>
            )}
            
            {user && (
              <Link href='/create-post' className="hidden md:flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-stone-900 to-stone-800 rounded-full hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                <FiEdit2 className="h-4 w-4" />
                Write
              </Link>
            )}
            
            {user && (
              <div className="relative cursor-pointer group">
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-amber-200 group-hover:ring-amber-400 transition-all duration-300 shadow-sm">
                  <Image
                    src="https://i.pravatar.cc/150?img=8"
                    alt="Profile"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                {/* Premium indicator dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-5 w-5 text-stone-700" />
              ) : (
                <FiMenu className="h-5 w-5 text-stone-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-100/50 animate-slideDown">
            <div className="flex flex-col gap-2">
              {[
                { name: 'Home', icon: FiHome },
                { name: 'Stories', icon: FiBookOpen },
                { name: 'Categories', icon: FiTag },
                { name: 'Authors', icon: FiUsers }
              ].map((item) => (
                <button
                  key={item.name}
                  className="flex items-center gap-3 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-amber-50"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </button>
              ))}
              {!user && (
                <a
                  href="/auth/login"
                  className="flex items-center gap-3 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-amber-50"
                >
                  <FiLogIn className="h-4 w-4" />
                  Sign In
                </a>
              )}
              {user && (
                <button className="flex items-center justify-center gap-2 mx-3 mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-stone-900 to-stone-800 rounded-full hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-md">
                  <FiEdit2 className="h-4 w-4" />
                  Write
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}