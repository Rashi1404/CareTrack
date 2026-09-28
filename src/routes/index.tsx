import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Star,
  Stethoscope,
  Ticket,
  UserSearch,
} from "lucide-react";
import heroImg from "@/assets/hero-opd.jpg";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { departments, doctors, HOSPITAL } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { DeptIcon } from "@/components/dept-icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareTrack — Patient Schedule Tracking | SRMS IMS Hospital" },
      {
        name: "description",
        content:
          "Book OPD appointments at SRMS IMS Hospital, get a token number and track your live queue position and waiting time with CareTrack.",
      },
      { property: "og:title", content: "CareTrack — Patient Schedule Tracking" },
      {
        property: "og:description",
        content:
          "Find doctors, book OPD appointments and track your token and waiting time in real time at SRMS IMS Hospital.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: UserSearch,
    title: "Find your doctor",
    body: "Search by department, name, availability or consultation fee across 8 specialities.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a date and slot",
    body: "See the doctor's weekly OPD schedule and choose a free 30-minute slot.",
  },
  {
    icon: Ticket,
    title: "Get your token",
    body: "A token number is issued instantly along with the OPD room and floor.",
  },
  {
    icon: Clock3,
    title: "Track your turn",
    body: "Follow Confirmed → Checked In → Waiting → With Doctor live, with an estimated wait.",
  },
];

function Landing() {
  const featured = doctors.slice(0, 4);

  return (
    <SiteLayout>
      <section className="hero-surface border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <ShieldCheck className="mr-1.5 size-3.5" /> Official OPD scheduling · {HOSPITAL.name}
            </Badge>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Stop waiting in the corridor. Track your OPD turn from your phone.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              CareTrack lets you book an appointment with a specialist, receive a token number, and
              watch the queue move in real time — so you reach the hospital only when it's nearly
              your turn.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/login" search={{ intent: "book" }}>
                  Book Appointment <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/doctors">Browse doctors</Link>
              </Button>
            </div>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4">
              {[
                ["35+", "Specialists"],
                ["8", "Departments"],
                ["12 min", "Avg. wait"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold text-primary">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              width={1280}
              height={960}
              alt="Doctor consulting a patient at the SRMS IMS Hospital outpatient desk"
              className="w-full rounded-2xl border border-border object-cover shadow-[var(--shadow-card)]"
            />
            <div className="card-elevated absolute -bottom-6 left-4 hidden w-60 p-4 sm:block">
              <p className="text-xs text-muted-foreground">Now serving · Cardiology</p>
              <p className="font-display text-2xl font-bold">Token 12</p>
              <p className="mt-1 text-xs text-success">Your token 14 · approx. 24 min</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Hospital departments</h2>
          <p className="mt-2 text-muted-foreground">
            Outpatient clinics running across three blocks, Monday to Saturday.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => (
            <Card key={d.id} className="border-border transition-shadow hover:shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent-foreground">
                  <DeptIcon name={d.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{d.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{d.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {d.doctors} doctors · {d.floor}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Meet our specialists</h2>
              <p className="mt-2 text-muted-foreground">Senior consultants taking OPD this week.</p>
            </div>
            <Button variant="outline" asChild className="shrink-0">
              <Link to="/doctors">View all</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((doc) => (
              <Card key={doc.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials(doc.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{doc.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{doc.department}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{doc.qualification}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-warning-foreground">
                      <Star className="size-4 fill-warning text-warning" /> {doc.rating}
                    </span>
                    <span className="text-muted-foreground">{doc.experience} yrs exp</span>
                  </div>
                  <Button className="mt-4 w-full" variant="secondary" asChild>
                    <Link to="/login" search={{ intent: "book" }}>
                      Book slot
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">How CareTrack works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Card key={s.title} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="size-5 text-accent-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-border bg-primary text-primary-foreground">
          <CardContent className="grid grid-cols-1 items-center gap-6 p-8 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h3 className="font-display text-xl font-bold sm:text-2xl">
                Ready for your next visit?
              </h3>
              <p className="mt-2 text-sm opacity-90">
                Sign in as a patient, doctor or administrator to explore the full CareTrack workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/login" search={{ intent: "book" }}>
                  <Stethoscope className="mr-2 size-4" /> Book now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link to="/services">
                  <ClipboardList className="mr-2 size-4" /> Our services
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
