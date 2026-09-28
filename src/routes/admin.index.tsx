import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarDays,
  Search,
  Stethoscope,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { DeptIcon } from "@/components/dept-icon";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/lib/app-store";
import { dateLabel, shortDate } from "@/lib/format";
import { departments, departmentLoad, today, weeklyLoad } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Administration — CareTrack" },
      {
        name: "description",
        content:
          "Hospital-wide OPD statistics, doctor and patient management, schedule monitoring and reports.",
      },
      { property: "og:title", content: "Administration — CareTrack" },
      { property: "og:description", content: "OPD statistics, user management and reports." },
    ],
  }),
  component: AdminWorkspace,
});

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-muted-foreground)",
];

function AdminWorkspace() {
  const { doctors, patients, appointments, cancel } = useApp();
  const [q, setQ] = useState("");
  const [toCancel, setToCancel] = useState<string | null>(null);

  const todays = appointments.filter((a) => a.date === today && a.status !== "Cancelled");
  const completedToday = todays.filter((a) => a.status === "Completed");

  const stats = [
    { icon: CalendarDays, label: "Appointments today", value: todays.length },
    { icon: UserRound, label: "Registered patients", value: patients.length },
    { icon: Stethoscope, label: "Active doctors", value: doctors.length },
    {
      icon: TrendingUp,
      label: "Completion rate",
      value: todays.length
        ? `${Math.round((completedToday.length / todays.length) * 100)}%`
        : "—",
    },
  ];

  const name = (pid: string) => patients.find((p) => p.id === pid)?.name ?? "Unknown";
  const docName = (did: string) => doctors.find((d) => d.id === did)?.name ?? "Unknown";

  const filteredPatients = patients.filter((p) =>
    `${p.name} ${p.email} ${p.phone}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell title="Hospital administration" subtitle="SRMS IMS Hospital · OPD operations">
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

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="border-border">
            <CardContent className="p-5">
              <p className="font-semibold">Weekly OPD load</p>
              <p className="text-sm text-muted-foreground">Booked versus completed appointments</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyLoad}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="appointments" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <p className="font-semibold">Load by department</p>
              <p className="text-sm text-muted-foreground">Appointments this month</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentLoad}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {departmentLoad.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {departmentLoad.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    {d.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Doctor</TableHead>
                    <TableHead className="hidden sm:table-cell">When</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments
                    .slice()
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 14)
                    .map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="max-w-36 truncate">{name(a.patientId)}</TableCell>
                        <TableCell className="hidden max-w-40 truncate md:table-cell">
                          {docName(a.doctorId)}
                        </TableCell>
                        <TableCell className="hidden whitespace-nowrap sm:table-cell">
                          {shortDate(a.date)} · {a.time}
                        </TableCell>
                        <TableCell>{a.token}</TableCell>
                        <TableCell>
                          <StatusBadge status={a.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {a.status !== "Cancelled" && a.status !== "Completed" && (
                            <Button size="sm" variant="ghost" onClick={() => setToCancel(a.id)}>
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((d) => {
              const load = appointments.filter(
                (a) => a.doctorId === d.id && a.date === today && a.status !== "Cancelled",
              ).length;
              return (
                <Card key={d.id} className="border-border">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{d.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{d.department}</p>
                      </div>
                      <Badge variant={load > 3 ? "destructive" : "secondary"}>{load} today</Badge>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {d.qualification} · {d.experience} yrs
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      OPD: {d.availableDays.join(", ")} · {d.room}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`Roster note sent to ${d.name}`)}
                      >
                        Notify
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast(`${d.name} handles ~${d.avgMinutesPerPatient} min per patient`)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search patients by name, email or phone"
              className="pl-9"
            />
          </div>
          <Card className="mt-4 border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden sm:table-cell">Age / Gender</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">Registered</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        No patients match that search.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredPatients.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="max-w-40 truncate font-medium">{p.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {p.age} · {p.gender}
                      </TableCell>
                      <TableCell className="hidden max-w-52 truncate md:table-cell">
                        {p.phone || p.email}
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap lg:table-cell">
                        {dateLabel(p.registered)}
                      </TableCell>
                      <TableCell className="text-right">
                        {appointments.filter((a) => a.patientId === p.id).length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <Card key={d.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                      <DeptIcon name={d.icon} className="size-5 text-primary" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{d.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.floor}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Activity className="size-4 text-accent-foreground" />
                    {d.doctors} consultants on roster
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!toCancel} onOpenChange={(o) => !o && setToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              The patient will be notified that the slot has been released.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toCancel) cancel(toCancel);
                setToCancel(null);
                toast.success("Appointment cancelled");
              }}
            >
              Cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
