// src/app/layout.tsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen flex flex-col">
          <Navigation />
          {/* <-- give the main area a little extra room at bottom */}
          <main className="flex-1 pb-24">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
