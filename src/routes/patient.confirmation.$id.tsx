import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Ticket } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/lib/app-store";
import { dateLabel } from "@/lib/format";

export const Route = createFileRoute("/patient/confirmation/$id")({
  head: () => ({
    meta: [
      { title: "Appointment Confirmed — CareTrack" },
      {
        name: "description",
        content: "Your OPD appointment is confirmed with a token number, room and time slot.",
      },
      { property: "og:title", content: "Appointment Confirmed — CareTrack" },
      { property: "og:description", content: "Token number, room and slot for your OPD visit." },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { id } = useParams({ from: "/patient/confirmation/$id" });
  const { appointments, doctors } = useApp();
  const appt = appointments.find((a) => a.id === id);
  const doctor = doctors.find((d) => d.id === appt?.doctorId);

  if (!appt || !doctor) {
    return (
      <AppShell title="Appointment not found">
        <Card className="border-dashed">
          <CardContent className="p-10 text-center">
            <p className="font-medium">We couldn't find that booking</p>
            <Button className="mt-4" asChild>
              <Link to="/patient">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title="Appointment confirmed" subtitle="Save your token number for the OPD counter">
      <div className="mx-auto max-w-2xl">
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15">
              <CheckCircle2 className="size-7 text-success" />
            </span>
            <h2 className="mt-5 text-2xl font-bold">You're booked</h2>
            <p className="mt-2 text-muted-foreground">
              A confirmation has been sent to your registered email and mobile number.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Token number</p>
                <p className="font-display text-2xl font-bold">{appt.token}</p>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="mt-1 text-sm font-semibold">{dateLabel(appt.date)}</p>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="mt-1 text-sm font-semibold">{appt.time}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 rounded-xl border border-border p-5 text-left text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Doctor</span>
                <span className="text-right font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{doctor.department}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Reason</span>
                <span className="text-right font-medium">{appt.reason}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4" /> Room
                </span>
                <span className="font-medium">{doctor.room}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Ticket className="size-4" /> Fee payable
                </span>
                <span className="font-medium">₹{doctor.fee}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link to="/patient/track/$id" params={{ id: appt.id }}>
                  Track appointment
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/patient">Go to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
