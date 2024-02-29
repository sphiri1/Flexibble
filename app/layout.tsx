

import './global.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthContextProvider } from '@/components/AuthContext';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Flexibble',
  description: 'Showcase and descove remarkable developer projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
        <Navbar />
        <main>
          {children}
          <Analytics />
        </main>
        <Footer />
        </AuthContextProvider>
      </body>
    </html>
  )
}
