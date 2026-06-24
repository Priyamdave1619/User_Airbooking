"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, User, CreditCard,
  Plane, LogOut, KeyRound, Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/check-in", label: "Check-In" },
  { href: "/manage", label: "Manage Booking" },
  { href: "/offers", label: "Offers" },
  { href: "/travel-info", label: "Travel Info" },
  { href: "/flying-returns", label: "Flying Returns" },
];

const exploreLinks = [
  { href: "/blog", label: "Blog Grid" },
  { href: "/blog/pack-smarter-for-long-haul-flights", label: "Blog Detail" },
  { href: "/destinations", label: "Destination" },
  { href: "/packages", label: "Travel Guides" },
  { href: "/testimonials", label: "Testimonial" },
];

const profileMenuItems = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/my-bookings", label: "My Bookings", icon: Plane },
  { href: "/payment-history", label: "Payment History", icon: CreditCard },
  { href: "/change-password", label: "Change Password", icon: KeyRound },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isExploreActive = exploreLinks.some((l) => pathname.startsWith(l.href));

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "";

  return (
    <>
      {/* Spacer so content doesn't go under fixed header */}
      <div className="h-20" />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-2"
            : "py-3"
        )}
      >
        {/* Pill-shaped navbar container */}
        <div
          className={cn(
            "navbar-pill mx-auto flex items-center justify-between transition-all duration-300",
            scrolled
              ? "max-w-6xl px-4 shadow-2xl shadow-navy-900/20"
              : "max-w-7xl px-6 shadow-lg shadow-navy-900/10"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/original-logo.png"
              alt="SkyRoute Airlines"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-base font-bold text-navy-900 hidden sm:block">
              SkyRoute
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  isActive(link.href)
                    ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy-900"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Explore dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  isExploreActive
                    ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy-900"
                )}
              >
                Explore
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-200", exploreOpen && "rotate-180")}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-full mt-2 w-52 origin-top-left transition-all duration-200",
                  exploreOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
              >
                <div className="rounded-2xl border border-slate-100 bg-white py-2 shadow-xl shadow-navy-900/10">
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-150",
                        pathname === link.href
                          ? "bg-sky-50 text-sky-600 font-medium"
                          : "text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200",
                isActive("/contact")
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                  : "text-slate-700 hover:bg-slate-100 hover:text-navy-900"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Auth area */}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200",
                    profileOpen
                      ? "border-sky-400 bg-sky-50 text-sky-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                  )}
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.firstName}
                      width={26}
                      height={26}
                      className="h-6.5 w-6.5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-xs font-bold text-white">
                      {initials}
                    </span>
                  )}
                  {user.firstName}
                  <ChevronDown
                    size={12}
                    className={cn("transition-transform duration-200", profileOpen && "rotate-180")}
                  />
                </button>

                <div
                  className={cn(
                    "absolute right-0 top-full mt-2 w-60 origin-top-right transition-all duration-200",
                    profileOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="rounded-2xl border border-slate-100 bg-white py-2 shadow-xl shadow-navy-900/10">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-sm font-bold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-navy-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                            pathname === item.href
                              ? "bg-sky-50 text-sky-600 font-medium"
                              : "text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                          )}
                        >
                          <Icon size={15} />
                          {item.label}
                        </Link>
                      );
                    })}
                    <div className="mt-1 border-t border-slate-100 pt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="primary" className="rounded-full">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy-900 hover:bg-slate-100 transition-colors lg:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={cn(
            "mx-auto mt-2 max-w-7xl px-4 transition-all duration-300 lg:hidden",
            isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none h-0 overflow-hidden"
          )}
        >
          <div className="rounded-2xl border border-slate-100 bg-white py-4 px-4 shadow-xl shadow-navy-900/10">
            <div className="flex flex-col gap-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-150",
                    isActive(link.href)
                      ? "bg-sky-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-1 border-t border-slate-100 pt-2">
                <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Explore
                </p>
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-150",
                      pathname === link.href
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-150",
                    isActive("/contact") ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Contact
                </Link>
              </div>
              {user ? (
                <div className="mt-1 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-xs font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{user.firstName}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[160px]">{user.email}</p>
                    </div>
                  </div>
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        <Icon size={14} />
                        {item.label}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button size="sm" variant="primary" className="w-full rounded-full">
                      Login / Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
