import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun, FaBell } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  // State for toggling mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  // State for toggling profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State for dark/light theme (loaded from localStorage)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Toggle mobile menu
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  // Toggle profile dropdown
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  // Toggle theme (dark/light)
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Apply theme change to <html> element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="relative bg-gray-800/50 backdrop-blur-md border-b border-white/10 z-50 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ================= LEFT: Mobile toggle ================= */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobile}
              type="button"
              className="relative inline-flex items-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* ================= CENTER: Logo + Nav ================= */}
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                My Blog
              </span>
            </Link>

            {/* Desktop navigation (hidden on small screens) */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="rounded-md bg-gray-900/50 px-3 py-2 text-sm font-medium text-white"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  About
                </Link>
                <Link
                  to="/projects"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Projects
                </Link>
              </div>
            </div>
          </div>

          {/* ================= SEARCH BAR (only on md+) ================= */}
          <div className="hidden md:block">
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="relative flex items-center p-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
                }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.vaule)}
                  className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                />
                <AiOutlineSearch className="absolute left-3 text-gray-400 text-lg" />
              </div>
            </form>
          </div>

          {/* ================= RIGHT: Actions ================= */}
          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 transition"
            >
              {darkMode ? (
                <FaMoon className="text-gray-300 text-lg" />
              ) : (
                <FaSun className="text-yellow-500 text-lg" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500">
              <FaBell size={18} />
              {/* Red dot indicator */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="User"
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
              </button>

              {/* Dropdown menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/sign-out"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5"
          >
            About
          </Link>
          <Link
            to="/projects"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5"
          >
            Projects
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
