import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-store";
import { dateLabel, initials } from "@/lib/format";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Medical Information — CareTrack" },
      {
        name: "description",
        content: "Keep your contact details, blood group, allergies and conditions up to date.",
      },
      { property: "og:title", content: "Profile — CareTrack" },
      { property: "og:description", content: "Your contact and medical information." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, patients, updatePatient, appointments } = useApp();
  const id = user?.id ?? "p1";
  const patient = patients.find((p) => p.id === id);

  const [form, setForm] = useState({
    name: patient?.name ?? user?.name ?? "",
    age: String(patient?.age ?? ""),
    gender: patient?.gender ?? "",
    phone: patient?.phone ?? "",
    email: patient?.email ?? user?.email ?? "",
    bloodGroup: patient?.bloodGroup ?? "",
    allergies: patient?.allergies ?? "",
    conditions: patient?.conditions ?? "",
    address: patient?.address ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<"email"|"password"|"name"|"phone"|"age", string>>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<"email"|"password"|"name"|"phone"|"age", string>> = {};
    if (form.name.trim().length < 3) next.name = "Enter your full name";
    if (!/^\d{1,3}$/.test(form.age) || Number(form.age) < 1) next.age = "Enter a valid age";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^[+\d][\d\s]{8,}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updatePatient(id, { ...form, age: Number(form.age) });
      setSaving(false);
      toast.success("Profile updated");
    }, 600);
  };

  const visits = appointments.filter((a) => a.patientId === id && a.status === "Completed").length;

  return (
    <AppShell title="Profile" subtitle="Contact and medical information">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto size-20">
              <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                {initials(form.name || "Patient")}
              </AvatarFallback>
            </Avatar>
            <p className="mt-4 text-lg font-semibold">{form.name}</p>
            <p className="text-sm text-muted-foreground">{form.email}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Patient ID {id.toUpperCase()}</Badge>
              <Badge variant="outline">Blood group {form.bloodGroup || "—"}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Visits</p>
                <p className="font-display text-xl font-bold">{visits}</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Registered</p>
                <p className="mt-1 text-xs font-medium">
                  {patient ? dateLabel(patient.registered) : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <form onSubmit={save} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" value={form.age} onChange={(e) => set("age", e.target.value)} />
                  {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blood">Blood group</Label>
                  <Input
                    id="blood"
                    value={form.bloodGroup}
                    onChange={(e) => set("bloodGroup", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile number</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pemail">Email</Label>
                  <Input id="pemail" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="allergies">Known allergies</Label>
                <Textarea
                  id="allergies"
                  rows={2}
                  value={form.allergies}
                  onChange={(e) => set("allergies", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="conditions">Existing conditions</Label>
                <Textarea
                  id="conditions"
                  rows={3}
                  value={form.conditions}
                  onChange={(e) => set("conditions", e.target.value)}
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
