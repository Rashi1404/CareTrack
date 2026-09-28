import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { intent?: string } =>
    typeof search["intent"] === "string" ? { intent: search["intent"] } : {},
  head: () => ({
    meta: [
      { title: "Login or Register — CareTrack | SRMS IMS Hospital" },
      {
        name: "description",
        content:
          "Sign in to CareTrack as a patient, doctor or administrator to book and track OPD appointments.",
      },
      { property: "og:title", content: "Login — CareTrack" },
      {
        property: "og:description",
        content: "Access your CareTrack patient, doctor or administrator workspace.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLES: { id: Role; label: string; icon: typeof UserRound; hint: string; demo: string }[] = [
  { id: "patient", label: "Patient", icon: UserRound, hint: "Book & track visits", demo: "aarav.sharma@example.com" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, hint: "Queue & records", demo: "a.mehrotra@srmsims.hospital" },
  { id: "admin", label: "Administrator", icon: ShieldCheck, hint: "Hospital oversight", demo: "admin@srmsims.hospital" },
];

const HOME: Record<Role, string> = { patient: "/patient", doctor: "/doctor", admin: "/admin" };

function LoginPage() {
  const { intent } = Route.useSearch();
  const navigate = useNavigate();
  const { login, register } = useApp();

  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState(ROLES[0]!.demo);
  const [password, setPassword] = useState("caretrack123");
  const [errors, setErrors] = useState<Partial<Record<"email"|"password"|"name"|"phone"|"age", string>>>({});
  const [loading, setLoading] = useState(false);

  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rErrors, setRErrors] = useState<Partial<Record<"email"|"password"|"name"|"phone"|"age", string>>>({});

  const pickRole = (r: Role) => {
    setRole(r);
    setEmail(ROLES.find((x) => x.id === r)?.demo ?? "");
    setErrors({});
  };

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<"email"|"password"|"name"|"phone"|"age", string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      const session = login(role, email);
      setLoading(false);
      toast.success(`Welcome back, ${session.name}`);
      navigate({
        to: role === "patient" && intent === "book" ? "/patient/find" : HOME[role],
      });
    }, 700);
  };

  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<"email"|"password"|"name"|"phone"|"age", string>> = {};
    if (rName.trim().length < 3) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(rEmail)) next.email = "Enter a valid email address";
    if (!/^[+\d][\d\s]{8,}$/.test(rPhone)) next.phone = "Enter a valid phone number";
    if (rPassword.length < 6) next.password = "Password must be at least 6 characters";
    setRErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      register(rName.trim(), rEmail);
      setLoading(false);
      toast.success("Registration complete. Welcome to CareTrack.");
      navigate({ to: "/patient" });
    }, 800);
  };

  return (
    <div className="hero-surface min-h-screen">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Brand />
        <Button variant="ghost" asChild>
          <Link to="/">Back to site</Link>
        </Button>
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 pb-16 pt-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <div className="hidden lg:block">
          <h1 className="text-3xl font-bold leading-tight">
            One login for patients, doctors and hospital administration.
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Sign in as a patient, doctor, or administrator to access the matching CareTrack workspace.
          </p>
          <ul className="mt-8 space-y-4">
            {ROLES.map((r) => (
              <li key={r.id} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card shadow-[var(--shadow-soft)]">
                  <r.icon className="size-4 text-primary" />
                </span>
                <div>
                  <p className="font-medium">{r.label}</p>
                  <p className="text-sm text-muted-foreground">{r.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <p className="text-sm font-medium">I am signing in as</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => pickRole(r.id)}
                      className={cn(
                        "rounded-xl border p-3 text-center transition-colors",
                        role === r.id
                          ? "border-primary bg-secondary"
                          : "border-border hover:bg-secondary/60",
                      )}
                    >
                      <r.icon
                        className={cn(
                          "mx-auto size-5",
                          role === r.id ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="mt-2 block text-xs font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={submitLogin} className="mt-6 space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={submitRegister} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="rname">Full name</Label>
                    <Input
                      id="rname"
                      value={rName}
                      onChange={(e) => setRName(e.target.value)}
                      placeholder="e.g. Kavita Nigam"
                    />
                    {rErrors.name && <p className="text-xs text-destructive">{rErrors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="remail">Email</Label>
                    <Input
                      id="remail"
                      value={rEmail}
                      onChange={(e) => setREmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                    {rErrors.email && <p className="text-xs text-destructive">{rErrors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rphone">Mobile number</Label>
                    <Input
                      id="rphone"
                      value={rPhone}
                      onChange={(e) => setRPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                    {rErrors.phone && <p className="text-xs text-destructive">{rErrors.phone}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rpassword">Create password</Label>
                    <Input
                      id="rpassword"
                      type="password"
                      value={rPassword}
                      onChange={(e) => setRPassword(e.target.value)}
                    />
                    {rErrors.password && (
                      <p className="text-xs text-destructive">{rErrors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Create patient account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
