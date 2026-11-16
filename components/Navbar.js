"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Home"],
  ["/projects", "Projects"],
  ["/work", "Experience"],
  ["/books", "Books"],
  ["/resilientai", "ResilientAI"],
  ["/Mike%20Terekhov%20Resume.pdf", "Resume"],
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="site-header">
      <Link href="/" className="site-brand" onClick={() => setOpen(false)}>Mike Terekhov</Link>
      <button
        className={`mobile-menu-toggle${open ? " is-open" : ""}`}
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-site-nav"
        onClick={() => setOpen(value => !value)}
      >
        <span /><span /><span />
      </button>
      <nav className="site-nav desktop-site-nav" aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link key={href} href={href}
            target={label === "Resume" ? "_blank" : undefined}
            rel={label === "Resume" ? "noopener noreferrer" : undefined}
            aria-current={pathname === href ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <nav id="mobile-site-nav" className={`mobile-site-nav${open ? " is-open" : ""}`}
        aria-label="Mobile navigation" aria-hidden={!open} inert={!open}>
        <div className="mobile-site-nav-inner">
          <p className="eyebrow">Navigation</p>
          {links.map(([href, label], index) => (
            <Link key={href} href={href}
              target={label === "Resume" ? "_blank" : undefined}
              rel={label === "Resume" ? "noopener noreferrer" : undefined}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}>
              <span className="mobile-nav-index">{String(index + 1).padStart(2, "0")}</span>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
