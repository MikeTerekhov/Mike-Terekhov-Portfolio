"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links=[["/","Home"],["/projects","Projects"],["/work","Experience"],["/books","Books"],["/resilientai","ResilientAI"],["/Mike%20Terekhov%20Resume.pdf","Résumé"]];
export default function Navbar(){const pathname=usePathname();return <header className="site-header"><Link href="/" className="site-brand">Mike Terekhov</Link><nav className="site-nav" aria-label="Primary navigation">{links.map(([href,label])=><Link key={href} href={href} target={label==="Résumé"?"_blank":undefined} rel={label==="Résumé"?"noopener noreferrer":undefined} aria-current={pathname===href?"page":undefined}>{label}</Link>)}</nav></header>}