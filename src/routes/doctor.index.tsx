import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Clock3, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/lib/app-store";
import { dateLabel } from "@/lib/format";
import { today, TRACK_STAGES, type Appointment } from "@/lib/mock-data";

export const Route = createFileRoute("/doctor/")({
  head: () => ({
    meta: [
      { title: "Doctor Workspace — CareTrack" },
      {
        name: "description",
        content:
          "Today's OPD list, live patient queue, visit notes, weekly availability and patient records.",
      },
      { property: "og:title", content: "Doctor Workspace — CareTrack" },
      { property: "og:description", content: "Manage your OPD queue and patient records." },
    ],
  }),
  component: DoctorWorkspace,
});

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ALL_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

function DoctorWorkspace() {
  const { user, doctors, patients, appointments, advance, updateVisit, setAvailability } = useApp();
  const doctorId = user?.id ?? "d1";
  const doctor = (doctors.find((d) => d.id === doctorId) ?? doctors[0])!;

  const mine = appointments.filter((a) => a.doctorId === doctor.id);
  const todays = mine
    .filter((a) => a.date === today && a.status !== "Cancelled")
    .sort((a, b) => a.token - b.token);
  const queue = todays.filter((a) => a.status !== "Completed");
  const done = todays.filter((a) => a.status === "Completed");

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [days, setDays] = useState<string[]>(doctor.availableDays);
  const [slots, setSlots] = useState<string[]>(doctor.slots);

  const patientName = (pid: string) => patients.find((p) => p.id === pid)?.name ?? "Patient";

  const openVisit = (a: Appointment) => {
    setSelected(a);
    setNotes(a.notes ?? "");
    setPrescription(a.prescription ?? "");
  };

  const saveVisit = () => {
    if (!selected) return;
    if (notes.trim().length < 5) {
      toast.error("Add a short visit note before completing");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateVisit(selected.id, notes.trim(), prescription.trim());
      setSaving(false);
      setSelected(null);
      toast.success("Visit updated and marked completed");
    }, 600);
  };

  const stats = [
    { icon: CalendarCheck, label: "Today's appointments", value: todays.length },
    { icon: Users, label: "In queue", value: queue.length },
    { icon: CheckCircle2, label: "Completed today", value: done.length },
    { icon: Clock3, label: "Avg. consult", value: `${doctor.avgMinutesPerPatient} min` },
  ];

  return (
    <AppShell title={`Good day, ${doctor.name}`} subtitle={`${doctor.department} · ${doctor.room}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-5">
              <s.icon className="size-5 text-accent-foreground" />
              <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="today" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="queue">Patient queue</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="records">Patient records</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          {todays.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                No appointments scheduled for today.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {todays.map((a) => (
                <Card key={a.id} className="border-border">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{patientName(a.patientId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Token {a.token} · {a.time}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-3 text-sm">{a.reason}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => openVisit(a)}>
                        Visit details
                      </Button>
                      {a.status !== "Completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            advance(a.id);
                            const i = TRACK_STAGES.indexOf(a.status);
                            toast.success(`Moved to ${TRACK_STAGES[i + 1]}`);
                          }}
                        >
                          Move forward
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="queue" className="mt-6">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden sm:table-cell">Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        The queue is clear.
                      </TableCell>
                    </TableRow>
                  )}
                  {queue.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-semibold">{a.token}</TableCell>
                      <TableCell className="max-w-40 truncate">{patientName(a.patientId)}</TableCell>
                      <TableCell className="hidden sm:table-cell">{a.time}</TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            advance(a.id);
                            toast.success("Queue updated");
                          }}
                        >
                          Next stage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <Card className="border-border">
            <CardContent className="space-y-6 p-6">
              <div>
                <Label className="text-base">OPD days</Label>
                <div className="mt-3 flex flex-wrap gap-4">
                  {ALL_DAYS.map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={days.includes(d)}
                        onCheckedChange={(c) =>
                          setDays((prev) => (c ? [...prev, d] : prev.filter((x) => x !== d)))
                        }
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-base">Consultation slots</Label>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ALL_SLOTS.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={slots.includes(s)}
                        onCheckedChange={(c) =>
                          setSlots((prev) => (c ? [...prev, s] : prev.filter((x) => x !== s)))
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => {
                  if (days.length === 0 || slots.length === 0) {
                    toast.error("Select at least one day and one slot");
                    return;
                  }
                  setAvailability(
                    doctor.id,
                    ALL_DAYS.filter((d) => days.includes(d)),
                    ALL_SLOTS.filter((s) => slots.includes(s)),
                  );
                  toast.success("Weekly availability saved");
                }}
              >
                Save availability
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from(new Set(mine.map((a) => a.patientId))).map((pid) => {
              const p = patients.find((x) => x.id === pid);
              const visits = mine.filter((a) => a.patientId === pid);
              if (!p) return null;
              return (
                <Card key={pid} className="border-border">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{p.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.age} yrs · {p.gender} · {p.bloodGroup}
                        </p>
                      </div>
                      <Badge variant="secondary">{visits.length} visits</Badge>
                    </div>
                    <p className="mt-3 text-sm">
                      <span className="text-muted-foreground">Conditions:</span> {p.conditions}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Allergies:</span> {p.allergies}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last visit: {dateLabel(visits[visits.length - 1]!.date)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected && patientName(selected.patientId)}</DialogTitle>
            <DialogDescription>
              Token {selected?.token} · {selected?.time} · {selected && dateLabel(selected.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary p-3 text-sm">
              <p className="font-medium">Reason for visit</p>
              <p className="mt-1 text-muted-foreground">{selected?.reason}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Clinical notes</Label>
              <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rx">Prescription</Label>
              <Textarea
                id="rx"
                rows={3}
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="e.g. Atorvastatin 10mg at night · Review after 4 weeks"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button onClick={saveVisit} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save & complete visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
