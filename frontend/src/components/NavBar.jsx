import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../services/api";
import { logout } from "../store/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore, clear state regardless
    }
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "bg-white/90 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[4.75rem]">
            {/* Logo Section */}
            <div className="flex items-center gap-12">
              <Link
                to={isLoggedIn ? "/dashboard" : "/"}
                className="flex items-center gap-3.5 group relative"
                onMouseEnter={() => setHoveredNav("logo")}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {/* Animated Background Glow */}
                <div
                  className={`absolute -inset-4 bg-gradient-to-r from-teal-100/0 via-teal-100/40 to-emerald-100/0 rounded-3xl blur-2xl transition-all duration-700 ${
                    hoveredNav === "logo"
                      ? "opacity-100 scale-105"
                      : "opacity-0 scale-95"
                  }`}
                />

                {/* Logo Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-emerald-400/30 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500 opacity-75 group-hover:opacity-100 group-hover:scale-110" />
                  <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(20,184,166,0.12)] border border-teal-100 group-hover:shadow-[0_12px_40px_rgba(20,184,166,0.2)] group-hover:border-teal-200 transition-all duration-500">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-inner transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Logo Text */}
                <div className="flex flex-col min-w-0 relative">
                  <span className="text-[22px] font-bold tracking-tight text-slate-800 leading-tight">
                    Chain<span className="text-teal-600">Vault</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
                    Secure Document Storage
                  </span>
                  {/* Active Indicator */}
                  <div className="absolute -bottom-1 left-0 h-[2px] w-8 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12" />
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              {isLoggedIn && (
                <div className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1 rounded-2xl border border-slate-200/60 shadow-sm">
                  {[
                    {
                      to: "/dashboard",
                      label: "Dashboard",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      ),
                    },
                    {
                      to: "/upload",
                      label: "Upload",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive(item.to)
                          ? "text-teal-700 bg-white shadow-[0_4px_20px_rgba(20,184,166,0.1)] border border-teal-100"
                          : "text-slate-500 hover:text-slate-800 hover:bg-white/80 border border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      {isActive(item.to) && (
                        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
              {/* Verify Link */}
              <Link
                to="/verify"
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive("/verify")
                    ? "text-teal-700 bg-teal-50/80 shadow-[0_4px_20px_rgba(20,184,166,0.08)] border border-teal-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="hidden md:inline font-medium">Verify</span>
              </Link>

              {/* Desktop Auth Section */}
              <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                  <>
                    {/* User Profile Card */}
                    <div className="flex items-center gap-3.5 pl-3.5 pr-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-300">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-teal-500/20">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <div className="relative">
                            <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full border-[2.5px] border-white shadow-sm" />
                            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 leading-tight">
                          {user?.name || "User"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium leading-tight">
                          Active now
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-300 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-50/80 border border-transparent hover:border-rose-200 transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Log out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      className="relative px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300"
                    >
                      Sign in
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-slate-400 rounded-full transition-all duration-300 group-hover:w-1/2" />
                    </Link>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-500" />
                      <Link
                        to="/register"
                        className="relative px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Get Started
                        <svg
                          className="inline-block w-4 h-4 ml-1.5 -mr-1 transform group-hover:translate-x-0.5 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-3.5">
                  <span
                    className={`absolute left-0 h-[2.5px] bg-current rounded-full transform transition-all duration-300 ${
                      isMobileMenuOpen ? "w-5 rotate-45 top-[5px]" : "w-5 top-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-[2.5px] bg-current rounded-full transform transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "w-5 -rotate-45 top-[5px]"
                        : "w-3.5 top-[5px] ml-auto right-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
            isMobileMenuOpen ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 space-y-2 bg-white/98 backdrop-blur-2xl border-t border-slate-200 shadow-2xl">
            {isLoggedIn ? (
              <>
                {/* User Info Card */}
                <div className="flex items-center gap-4 px-5 py-4 mb-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-teal-500/20">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className="w-4 h-4 bg-emerald-400 rounded-full border-[3px] border-white shadow-sm" />
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Active session
                    </span>
                  </div>
                </div>

                {/* Mobile Nav Links */}
                {[
                  {
                    to: "/dashboard",
                    label: "Dashboard",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    ),
                  },
                  {
                    to: "/upload",
                    label: "Upload Document",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    ),
                  },
                  {
                    to: "/verify",
                    label: "Verify Document",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      isActive(item.to)
                        ? "text-teal-700 bg-teal-50 border border-teal-100 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {isActive(item.to) && (
                      <svg
                        className="w-4 h-4 ml-auto text-teal-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </Link>
                ))}

                {/* Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Account
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3.5 w-full px-5 py-3.5 rounded-2xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Mobile Guest Menu */}
                <Link
                  to="/verify"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Verify Document
                </Link>

                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Sign in
                </Link>

                <div className="pt-2">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-500" />
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl text-white font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/20 transition-all duration-300"
                    >
                      Get Started Free
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[4.75rem]" />
    </>
  );
};

export default NavBar;
