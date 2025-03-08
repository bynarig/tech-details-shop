import { AuthProvider } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Details Shop",
  description: "Your one-stop shop for phone parts and accessories",
};


// Example usage in app startup
// import { initializeServices } from '@/lib/initialiseServices';

// // This won't throw errors, just report status
// initializeServices().then(status => {
//   console.log('Service initialization complete');
//   console.log('Database connected:', status.dbConnected);
// }).catch(err => {
//   console.error('Unexpected error during initialization:', err);
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}