import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock3, IndianRupee, Languages, MapPin, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/app-store";
import { initials } from "@/lib/format";
import { AvailabilityBadge } from "@/components/availability-badge";

export const Route = createFileRoute("/patient/doctor/$id")({
  head: () => ({
    meta: [
      { title: "Doctor Profile — CareTrack" },
      {
        name: "description",
        content: "Consultant profile with qualifications, OPD days, room number and fees.",
      },
      { property: "og:title", content: "Doctor Profile — CareTrack" },
      { property: "og:description", content: "Qualifications, OPD schedule and consultation fee." },
    ],
  }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { id } = useParams({ from: "/patient/doctor/$id" });
  const { doctors, appointments } = useApp();
  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <AppShell title="Doctor not found">
        <Card className="border-dashed">
          <CardContent className="p-10 text-center">
            <p className="font-medium">This doctor is no longer listed</p>
            <Button className="mt-4" asChild>
              <Link to="/patient/find">Back to search</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const booked = appointments.filter((a) => a.doctorId === doctor.id && a.status !== "Cancelled");

  return (
    <AppShell title={doctor.name} subtitle={doctor.department}>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/patient/find">
          <ArrowLeft className="mr-2 size-4" /> Back to search
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <Avatar className="size-16 shrink-0">
                <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                  {initials(doctor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">{doctor.name}</h2>
                <p className="truncate text-sm text-muted-foreground">{doctor.qualification}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{doctor.department}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Star className="size-3 fill-warning text-warning" /> {doctor.rating}
                  </Badge>
                  <Badge variant="outline">{doctor.experience} yrs experience</Badge>
                </div>
              </div>
            </div>

            <Separator className="my-5" />
            <h3 className="font-semibold">About</h3>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.about}</p>

            <Separator className="my-5" />
            <h3 className="font-semibold">Weekly OPD schedule</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span
                  key={d}
                  className={
                    doctor.availableDays.includes(d)
                      ? "rounded-lg bg-success/15 px-3 py-1.5 text-sm text-success"
                      : "rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                  }
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.slots.map((s) => (
                <span key={s} className="rounded-lg border border-border px-3 py-1.5 text-sm">
                  {s}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="border-border">
            <CardContent className="space-y-3 p-5 text-sm">
              <AvailabilityBadge doctor={doctor} />
              <p className="flex items-center gap-2">
                <IndianRupee className="size-4 text-muted-foreground" /> ₹{doctor.fee} consultation
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" /> {doctor.room}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="size-4 text-muted-foreground" /> ~
                {doctor.avgMinutesPerPatient} min per patient
              </p>
              <p className="flex items-center gap-2">
                <Languages className="size-4 text-muted-foreground" /> {doctor.languages.join(", ")}
              </p>
              <p className="text-muted-foreground">{booked.length} appointments scheduled overall</p>
              <Button className="w-full" asChild>
                <Link to="/patient/book/$id" params={{ id: doctor.id }}>
                  Book appointment
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
