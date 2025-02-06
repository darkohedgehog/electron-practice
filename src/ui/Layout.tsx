import React from "react";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { ModeToggle } from "./components/mode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fixed ModeToggle kao direktan dete - na nivou root */}
      <div className="fixed top-5 right-4 z-50">
        <ModeToggle />
      </div>

      <SidebarProvider>
        <AppSidebar />
        <main className="relative min-h-screen">
          <SidebarTrigger />
          <div className="p-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
