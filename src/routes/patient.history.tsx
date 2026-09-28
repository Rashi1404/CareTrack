import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppointmentCard } from "@/components/appointment-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-store";
import type { Appointment } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/history")({
  head: () => ({
    meta: [
      { title: "Appointment History — CareTrack" },
      {
        name: "description",
        content: "Every OPD visit you have booked, with status, visit notes and prescriptions.",
      },
      { property: "og:title", content: "Appointment History — CareTrack" },
      { property: "og:description", content: "Upcoming, completed and cancelled OPD visits." },
    ],
  }),
  component: History,
});

function Empty({ text }: { text: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-10 text-center">
        <p className="font-medium">{text}</p>
        <Button className="mt-4" asChild>
          <Link to="/patient/find">
            <Search className="mr-2 size-4" /> Find a doctor
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function List({ items, empty }: { items: Appointment[]; empty: string }) {
  if (items.length === 0) return <Empty text={empty} />;
  return (
    <div className="space-y-4">
      {items.map((a) => (
        <AppointmentCard key={a.id} appt={a} />
      ))}
    </div>
  );
}

function History() {
  const { user, appointments } = useApp();
  const id = user?.id ?? "p1";
  const mine = appointments
    .filter((a) => a.patientId === id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const upcoming = mine.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");
  const completed = mine.filter((a) => a.status === "Completed");
  const cancelled = mine.filter((a) => a.status === "Cancelled");

  return (
    <AppShell title="Appointments" subtitle="Your complete visit history at SRMS IMS Hospital">
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          <List items={upcoming} empty="No upcoming appointments" />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <List items={completed} empty="No completed visits yet" />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          <List items={cancelled} empty="No cancelled appointments" />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
