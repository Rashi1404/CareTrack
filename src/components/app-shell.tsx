import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Users,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/lib/app-store";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/mock-data";

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };

const NAV: Record<Role, NavItem[]> = {
  patient: [
    { to: "/patient", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/patient/find", label: "Find a doctor", icon: Search },
    { to: "/patient/history", label: "Appointments", icon: CalendarDays },
    { to: "/patient/profile", label: "Profile", icon: UserRound },
  ],
  doctor: [{ to: "/doctor", label: "Doctor workspace", icon: ClipboardList, exact: true }],
  admin: [{ to: "/admin", label: "Administration", icon: Users, exact: true }],
};

export function AppShell({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { user, logout, notifications, markAllRead } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const role: Role = user?.role ?? "patient";
  const items = NAV[role];
  const mine = notifications.filter((n) => n.userId === (user?.id ?? "p1"));
  const unread = mine.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success("Signed out of CareTrack");
    navigate({ to: "/", replace: true });
  };

  const SideNav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Home className="size-4 shrink-0" />
        Public site
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
          <div className="px-1 py-2">
            <Brand />
          </div>
          <div className="mt-6 flex-1">{SideNav}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="icon" aria-label="Open menu">
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-4">
                    <div className="mb-6 mt-2">
                      <Brand />
                    </div>
                    {SideNav}
                  </SheetContent>
                </Sheet>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
                  {subtitle && (
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Sheet
                  open={bellOpen}
                  onOpenChange={(o) => {
                    setBellOpen(o);
                    if (o) markAllRead();
                  }}
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
                      <Bell className="size-5" />
                      {unread > 0 && (
                        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                          {unread}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
                    <div className="border-b border-border p-5">
                      <p className="font-display text-base font-semibold">Notifications</p>
                      <p className="text-xs text-muted-foreground">Appointment and queue updates</p>
                    </div>
                    <ScrollArea className="h-[calc(100vh-88px)]">
                      <div className="divide-y divide-border">
                        {mine.length === 0 && (
                          <p className="p-6 text-sm text-muted-foreground">
                            No notifications yet. Book an appointment to start receiving updates.
                          </p>
                        )}
                        {mine.map((n) => (
                          <div key={n.id} className="p-5">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{n.time}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                          {initials(user?.name ?? "Guest")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                        {user?.name ?? "Guest"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="capitalize">
                      {user?.name ?? "Guest"} · {role}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {role === "patient" && (
                      <DropdownMenuItem asChild>
                        <Link to="/patient/profile">Profile & medical info</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 size-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {action && <div className="mt-3 lg:hidden">{action}</div>}
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {action && <div className="mb-4 hidden justify-end lg:flex">{action}</div>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
