import "./globals.css";
import Navbar from "./components/Navbar";

export default function DashboardLayout({
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
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
