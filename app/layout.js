import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Mike Terekhov',
  description: 'Personal portfolio website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="font-['0xProtoNerdFont'] dark:bg-gray-900 dark:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
