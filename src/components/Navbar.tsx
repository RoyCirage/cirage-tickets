"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    pathname.startsWith(path) ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800";

  const isAdmin = session?.user.role === "ADMIN";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo + desktop nav */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/dashboard" className="font-semibold text-gray-900 tracking-tight whitespace-nowrap">
              Cirage Paris <span className="text-gray-400 font-normal hidden sm:inline">/ Tickets</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
              <Link href="/tickets" className={isActive("/tickets")}>Tickets</Link>
              {isAdmin && <Link href="/admin" className={isActive("/admin")}>Admin</Link>}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/tickets/new"
              className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              + New
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-medium text-xs">
                {session?.user.name?.[0]?.toUpperCase()}
              </div>
              <span className="hidden md:block">{session?.user.name}</span>
              <span className="text-gray-300">·</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-gray-400 hover:text-gray-600"
              >
                Sign out
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-1.5 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white py-2 px-4 space-y-1">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`block py-2 text-sm ${isActive("/dashboard")}`}
          >
            Dashboard
          </Link>
          <Link
            href="/tickets"
            onClick={() => setMobileOpen(false)}
            className={`block py-2 text-sm ${isActive("/tickets")}`}
          >
            Tickets
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm ${isActive("/admin")}`}
            >
              Admin
            </Link>
          )}
          <div className="border-t border-gray-100 pt-2 mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-medium text-xs">
                {session?.user.name?.[0]?.toUpperCase()}
              </div>
              <span>{session?.user.name}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
              }
