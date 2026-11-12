import "./globals.css";
import Navbar from "@/components/Navbar";
export const metadata={title:{default:"Mike Terekhov",template:"%s | Mike Terekhov"},description:"Mike Terekhov — software engineering, machine learning, research, and projects."};
export default function RootLayout({children}){return <html lang="en"><body><Navbar/>{children}<footer className="site-footer"><span>© {new Date().getFullYear()} Mike Terekhov</span><span>Software · Research · Ideas</span></footer></body></html>}