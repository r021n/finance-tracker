import type { ReactNode } from "react";
import SimpleBar from "simplebar-react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 min-h-0">
        <SimpleBar className="h-full">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </SimpleBar>
      </div>
    </div>
  );
}
