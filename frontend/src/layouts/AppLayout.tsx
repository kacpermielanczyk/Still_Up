import { Outlet } from "react-router";

import SideMenu from "@/components/menu/SideMenu";

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh w-full bg-background">
      <SideMenu />

      <main className="min-w-0 flex-1 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
