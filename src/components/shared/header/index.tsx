import Container from "@/components/ui/container";
import Profile from "@/components/shared/header/Profile";
import NavMenuToggle from "@/components/shared/header/NavMenuToggle";
import ThemeToggle from "@/components/shared/header/ThemeToggle";
import Notifications from "@/components/shared/notifications/Notifications";
import SystemStatusBadge from "@/components/shared/header/SystemStatusBadge";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full bg-popover/90 backdrop-blur-md border-b border-border/40 py-3 shadow-xs z-40 print:hidden">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NavMenuToggle />
            <SystemStatusBadge />
          </div>

          <div className="flex items-center gap-x-3 ml-auto">
            <ThemeToggle />
            <Notifications />
            <Profile />
          </div>
        </div>
      </Container>
    </header>
  );
}
