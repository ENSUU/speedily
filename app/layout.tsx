"use client";

import "./globals.css";

import Navbar from "./components/Navbar";
import { UserProvider } from "./_context/userContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main className="h-dvh flex flex-col justify-center items-center">
          <UserProvider>
            <Navbar />
            {children}
          </UserProvider>
        </main>
      </body>
    </html>
  );
}
