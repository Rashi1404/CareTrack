import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ambulance,
  FlaskConical,
  HeartPulse,
  Microscope,
  Pill,
  Scan,
  ShieldPlus,
  Syringe,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { departments } from "@/lib/mock-data";
import { DeptIcon } from "@/components/dept-icon";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — CareTrack | SRMS IMS Hospital" },
      {
        name: "description",
        content:
          "OPD clinics, diagnostics, 24x7 emergency, pharmacy, imaging and preventive health checks at SRMS IMS Hospital.",
      },
      { property: "og:title", content: "Hospital Services — SRMS IMS Hospital" },
      {
        property: "og:description",
        content: "Outpatient clinics, diagnostics, emergency care and preventive health packages.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: HeartPulse,
    title: "Outpatient clinics",
    body: "Eight specialities running morning and evening OPD, Monday to Saturday.",
  },
  {
    icon: Ambulance,
    title: "24 × 7 emergency",
    body: "Trauma bay, ambulance service and round-the-clock casualty medical officers.",
  },
  {
    icon: Microscope,
    title: "Pathology lab",
    body: "NABL-standard blood, urine and histopathology testing with same-day reports.",
  },
  {
    icon: Scan,
    title: "Radiology & imaging",
    body: "Digital X-ray, ultrasound, CT and MRI with reporting by senior radiologists.",
  },
  {
    icon: Pill,
    title: "In-house pharmacy",
    body: "Open 24 hours inside Block A, with generic alternatives on request.",
  },
  {
    icon: Syringe,
    title: "Immunisation",
    body: "Full national schedule for children plus adult flu and hepatitis vaccination.",
  },
  {
    icon: FlaskConical,
    title: "Health check packages",
    body: "Basic, cardiac and diabetic packages combining labs, ECG and a physician review.",
  },
  {
    icon: ShieldPlus,
    title: "Insurance & cashless",
    body: "TPA desk for cashless admission with major insurers and government schemes.",
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Clinical and support services available to every patient booking through CareTrack.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card key={s.title} className="border-border">
              <CardContent className="p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/15">
                  <s.icon className="size-5 text-accent-foreground" />
                </span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold">Speciality clinics</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {departments.map((d) => (
            <Card key={d.id} className="border-border">
              <CardContent className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <DeptIcon name={d.icon} className="size-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{d.floor}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button size="lg" asChild>
            <Link to="/login" search={{ intent: "book" }}>
              Book an OPD appointment
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
