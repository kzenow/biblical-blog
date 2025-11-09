import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biblical Blog - Faith and Reflection',
  description: 'A blog dedicated to biblical teachings and spiritual reflections',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-serif">
        <div className="min-h-screen flex flex-col">
          <header className="bg-biblical-burgundy text-biblical-parchment py-6 shadow-lg">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-biblical text-center">
                Biblical Blog
              </h1>
              <p className="text-center text-biblical-sand mt-2">
                Reflections on Faith and Scripture
              </p>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-biblical-deepBrown text-biblical-parchment py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Biblical Blog. All rights reserved.
              </p>
              <p className="text-xs mt-2 text-biblical-sand">
                &quot;Thy word is a lamp unto my feet, and a light unto my path.&quot; - Psalm 119:105
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
