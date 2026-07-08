"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { CONFIG } from "@/lib/config";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Equipment", href: "/equipment" },
  { name: "Exercises", href: "/exercises" },
  { name: "Nutrition", href: "/nutrition" },
  { name: "Tools", href: "/tools" },
  { name: "AI Coach", href: "/ai-coach" },
  { name: "Contact", href: "/#contact" },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, signOut, loading, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass backdrop-blur-2xl shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center transition-all duration-500 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo + Brand */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={
                !isScrolled
                  ? { y: [0, -4, 0] }
                  : { y: 0 }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/gym56-logo.png"
                alt="GYM 56 - Forged Strength"
                width={80}
                height={80}
                className={`transition-all duration-500 ${
                  isScrolled ? "h-10 w-auto" : "h-14 w-auto"
                }`}
                priority
              />
            </motion.div>
            <span className="md:hidden text-lg sm:text-xl font-extrabold tracking-tight">
              <span className="text-white">GYM</span>
              <span className="text-[#DC2626]">56</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {/* Desktop auth area */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-24 h-9 rounded-full animate-shimmer" aria-hidden="true" />
              ) : !user ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <a
                    href={CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#DC2626]/30 active:scale-[0.97]"
                  >
                    Contact on WhatsApp
                  </a>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-haspopup="true"
                    aria-expanded={isProfileMenuOpen}
                    aria-controls="profile-menu"
                    aria-label="Account menu"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all"
                  >
                    <User size={18} aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-300">
                      {user?.email?.split("@")[0] || "Profile"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        id="profile-menu"
                        role="menu"
                        aria-label="Account options"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 glass rounded-xl border border-white/10 overflow-hidden shadow-xl"
                      >
                        {isAdmin && (
                          <Link
                            href="/admin"
                            role="menuitem"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          role="menuitem"
                          onClick={() => {
                            signOut();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="true"
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <motion.div
              className="px-4 py-6 space-y-1"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={staggerItem}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 mt-2 border-t border-white/10 space-y-3">
                {loading ? (
                  <div className="w-full h-10 rounded-full animate-shimmer" aria-hidden="true" />
                ) : !user ? (
                  <div className="space-y-3 px-4">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <a
                      href={CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 text-lg font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-full transition-all active:scale-[0.97]"
                    >
                      Contact on WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="px-4">
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-0 py-2 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
