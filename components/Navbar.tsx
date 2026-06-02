"use client";

/**
 * Navbar.tsx — sticky top navigation, ported from the prototype's Navbar.js.
 *
 * The prototype tracked the "current screen" in a store to highlight the
 * active link. In Next.js the URL is that source of truth, so we read it with
 * usePathname() and use <Link> for real client-side navigation (with prefetch).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "./Modal";

const NAV_ITEMS = [
  { href: "/lessons", label: "Lessons" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { openModal } = useModal();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav>
      <Link href="/" className="nav-logo" aria-label="Go to homepage">
        日 <span>Nihongo</span>
      </Link>

      <div className="nav-links">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={isActive(href) ? "active" : ""}
            aria-current={isActive(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => openModal("login")}
        >
          Log in
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => openModal("signup")}
        >
          Start free trial
        </button>
      </div>
    </nav>
  );
}
