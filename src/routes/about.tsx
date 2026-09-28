import { createFileRoute } from "@tanstack/react-router";
import { Building2, GraduationCap, HeartHandshake, Users } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { HOSPITAL } from "@/lib/mock-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CareTrack — SRMS IMS Hospital" },
      {
        name: "description",
        content:
          "CareTrack is the patient schedule tracking system of SRMS IMS Hospital, Bareilly — built to cut OPD waiting time.",
      },
      { property: "og:title", content: "About CareTrack — SRMS IMS Hospital" },
      {
        property: "og:description",
        content: "Why SRMS IMS Hospital built a token-based OPD tracking system for patients.",
      },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { icon: Building2, label: "Beds", value: "750+" },
  { icon: Users, label: "Patients each day", value: "1,200" },
  { icon: GraduationCap, label: "Teaching faculty", value: "180" },
  { icon: HeartHandshake, label: "Years of service", value: "25" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold">About CareTrack</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A scheduling and queue-tracking system built for the outpatient departments of{" "}
            {HOSPITAL.name}, Bareilly.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
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

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Why we built it</h2>
            <p className="text-muted-foreground">
              On a busy morning the general medicine OPD alone registers more than 130 patients.
              Families used to arrive at 8 AM for an 11 AM turn because no one could tell them where
              the queue had reached. CareTrack replaces that guesswork with a token number, a live
              queue position and an honest estimate of the remaining wait.
            </p>
            <p className="text-muted-foreground">
              Doctors see their day at a glance, move patients through the queue, and record visit
              notes as they go. Administrators watch OPD load department by department and step in
              before a clinic gets overwhelmed.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How it is used</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Patients</span> book slots, track their
                token and keep a history of every visit and prescription.
              </li>
              <li>
                <span className="font-medium text-foreground">Doctors</span> manage today's list, the
                waiting queue, weekly availability and patient records.
              </li>
              <li>
                <span className="font-medium text-foreground">Administrators</span> oversee
                registrations, departments, appointments and daily reports.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
