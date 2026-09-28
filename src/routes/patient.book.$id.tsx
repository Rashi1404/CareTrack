import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/lib/app-store";
import { dateLabel, dayCode, nextDates, shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/book/$id")({
  head: () => ({
    meta: [
      { title: "Book Appointment — CareTrack" },
      {
        name: "description",
        content: "Choose an OPD date and time slot and confirm your appointment at SRMS IMS Hospital.",
      },
      { property: "og:title", content: "Book Appointment — CareTrack" },
      { property: "og:description", content: "Pick a date, slot and reason for your OPD visit." },
    ],
  }),
  component: BookAppointment,
});

function BookAppointment() {
  const { id } = useParams({ from: "/patient/book/$id" });
  const navigate = useNavigate();
  const { doctors, book, appointments } = useApp();
  const doctor = doctors.find((d) => d.id === id);

  const days = nextDates(12).filter((d) => doctor?.availableDays.includes(dayCode(d)));
  const [date, setDate] = useState(days[0] ?? "");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!doctor) {
    return (
      <AppShell title="Doctor not found">
        <Button asChild>
          <Link to="/patient/find">Back to search</Link>
        </Button>
      </AppShell>
    );
  }

  const takenSlots = appointments
    .filter((a) => a.doctorId === doctor.id && a.date === date && a.status !== "Cancelled")
    .map((a) => a.time);

  const validate = () => {
    if (!date) return "Choose an appointment date";
    if (!time) return "Choose a time slot";
    if (reason.trim().length < 10) return "Describe your reason in at least 10 characters";
    return "";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    setError(msg);
    if (msg) return;
    setConfirmOpen(true);
  };

  const confirm = () => {
    setSaving(true);
    setTimeout(() => {
      const appt = book({ doctorId: doctor.id, date, time, reason: reason.trim() });
      setSaving(false);
      toast.success("Appointment booked");
      navigate({ to: "/patient/confirmation/$id", params: { id: appt.id } });
    }, 700);
  };

  return (
    <AppShell title="Book appointment" subtitle={`${doctor.name} · ${doctor.department}`}>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/patient/doctor/$id" params={{ id: doctor.id }}>
          <ArrowLeft className="mr-2 size-4" /> Back to profile
        </Link>
      </Button>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" noValidate>
        <Card className="border-border">
          <CardContent className="space-y-6 p-6">
            <div>
              <Label className="text-base">Select a date</Label>
              <p className="text-sm text-muted-foreground">
                OPD days for {doctor.name}: {doctor.availableDays.join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {days.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-2.5 text-sm transition-colors",
                      date === d
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <span className="block text-xs opacity-75">{dayCode(d)}</span>
                    {shortDate(d)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base">Select a time slot</Label>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {doctor.slots.map((s) => {
                  const taken = takenSlots.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={taken}
                      onClick={() => setTime(s)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm transition-colors",
                        taken && "cursor-not-allowed border-border bg-muted text-muted-foreground line-through",
                        !taken && time === s && "border-primary bg-primary text-primary-foreground",
                        !taken && time !== s && "border-border hover:bg-secondary",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-base">
                Reason for visit
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="e.g. Persistent chest discomfort while climbing stairs for two weeks"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="border-border">
            <CardContent className="space-y-3 p-5 text-sm">
              <p className="font-semibold">Booking summary</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor</span>
                <span className="text-right font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{doctor.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{date ? dateLabel(date) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slot</span>
                <span className="font-medium">{time || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium">{doctor.room}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">Consultation fee</span>
                <span className="font-semibold">₹{doctor.fee}</span>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <CalendarCheck className="mr-2 size-4" />
                )}
                Confirm booking
              </Button>
              <p className="text-xs text-muted-foreground">
                Pay at the OPD counter while checking in. Free cancellation any time before your slot.
              </p>
            </CardContent>
          </Card>
        </aside>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {doctor.name} · {date && dateLabel(date)} at {time}. A token number will be issued
              immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Confirm booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
