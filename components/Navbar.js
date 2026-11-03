"use client";

import styles from "./Navbar.module.css";
import Link from 'next/link';
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNavbar = () => {
    setIsNavOpen(false);
  };

  return (
    <header className={`${styles.header} bg-gradient-to-r from-cyan-500 to-violet-400 text-white px-4 py-2`}>
      <Link onClick={closeNavbar} href="/" className="font-['0xProtoNerdFont']">Mike Terekhov</Link>
      <nav className={`${styles.nav} ${isNavOpen ? styles.open : ""}`}>
        <div className="font-['0xProtoNerdFont']"> 
          <Link onClick={closeNavbar} href="/" className="font-['0xProtoNerdFont']">Home</Link>
          <Link onClick={closeNavbar} href="/books" className="font-['0xProtoNerdFont']">Books</Link> 
          <Link onClick={closeNavbar} href="/projects" className="font-['0xProtoNerdFont']">Projects</Link>
          <Link onClick={closeNavbar} href="/work" className="font-['0xProtoNerdFont']">Work Experience</Link>
          <Link onClick={closeNavbar} href="/resilientai" className="font-['0xProtoNerdFont']">ResilientAI</Link>
          {/* <Link onClick={closeNavbar} href="/terminal" className="font-['0xProtoNerdFont']">Terminal</Link> */}
        </div>
        <button className={`${styles.button} ${styles.close}`} onClick={closeNavbar} aria-label="Close navigation">
          <FaTimes />
        </button>
      </nav>
      <button className={styles.button} onClick={toggleNavbar} aria-label="Toggle navigation" aria-expanded={isNavOpen}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
