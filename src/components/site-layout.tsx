import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, MapPin, Mail } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HOSPITAL } from "@/lib/mock-data";

const links = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Doctors" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link to="/login">Login / Register</Link>
            </Button>
            <Button asChild>
              <Link to="/login" search={{ intent: "book" }}>
                Book Appointment
              </Link>
            </Button>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <div className="mt-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/login">Login / Register</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/login" search={{ intent: "book" }}>
                      Book Appointment
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Brand />
            <p className="text-sm text-muted-foreground">
              Patient schedule tracking for the OPD, built for {HOSPITAL.name}.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">Quick links</p>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="block text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">Hours</p>
            <p className="text-muted-foreground">OPD · Mon–Sat, 9:00 AM – 6:00 PM</p>
            <p className="text-muted-foreground">Emergency · 24 × 7</p>
            <p className="text-muted-foreground">Sunday · Emergency only</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">Reach us</p>
            <p className="flex gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {HOSPITAL.address}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4 shrink-0" />
              {HOSPITAL.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 shrink-0" />
              {HOSPITAL.email}
            </p>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {HOSPITAL.app} · {HOSPITAL.name}.
        </div>
      </footer>
    </div>
  );
}
