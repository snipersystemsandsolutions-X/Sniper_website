import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import ScrollToTop from "./ScrollToTop"; // <-- ADD THIS

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop /> {/* <-- ADD THIS */}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
