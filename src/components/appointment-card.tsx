import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarClock, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/app-store";
import { dateLabel, dayCode, nextDates, shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/mock-data";

export function AppointmentCard({ appt }: { appt: Appointment }) {
  const { doctors, cancel, reschedule } = useApp();
  const doctor = doctors.find((d) => d.id === appt.doctorId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);

  const active = appt.status !== "Completed" && appt.status !== "Cancelled";
  const days = nextDates(10).filter((d) => doctor?.availableDays.includes(dayCode(d)));

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold">{doctor?.name}</p>
            <p className="truncate text-sm text-muted-foreground">{doctor?.department}</p>
          </div>
          <StatusBadge status={appt.status} />
        </div>

        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <CalendarClock className="size-4 shrink-0" />
            {dateLabel(appt.date)} · {appt.time}
          </p>
          <p className="flex items-center gap-2">
            <Ticket className="size-4 shrink-0" /> Token {appt.token}
          </p>
          <p className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="size-4 shrink-0" /> {doctor?.room}
          </p>
        </div>

        <p className="mt-3 text-sm">{appt.reason}</p>

        {appt.notes && (
          <div className="mt-3 rounded-lg bg-secondary p-3 text-sm">
            <p className="font-medium">Visit notes</p>
            <p className="mt-1 text-muted-foreground">{appt.notes}</p>
            {appt.prescription && (
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium text-foreground">Prescription:</span>{" "}
                {appt.prescription}
              </p>
            )}
          </div>
        )}

        {active && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to="/patient/track/$id" params={{ id: appt.id }}>
                Track appointment
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRescheduleOpen(true)}>
              Reschedule
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmOpen(true)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Your slot with {doctor?.name} on {dateLabel(appt.date)} at {appt.time} will be released
              to other patients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                cancel(appt.id);
                toast.success("Appointment cancelled");
              }}
            >
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reschedule appointment</DialogTitle>
            <DialogDescription>
              Pick another OPD day and slot for {doctor?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Date</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm",
                      date === d ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {shortDate(d)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Time slot</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {doctor?.slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTime(s)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-sm",
                      time === s ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                reschedule(appt.id, date, time);
                setRescheduleOpen(false);
                toast.success(`Moved to ${dateLabel(date)} at ${time}`);
              }}
            >
              Confirm new slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
