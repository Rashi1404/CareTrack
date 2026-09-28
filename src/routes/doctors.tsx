import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { doctors, departments } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "@/components/availability-badge";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our Doctors — CareTrack | SRMS IMS Hospital" },
      {
        name: "description",
        content:
          "Browse consultants across cardiology, orthopaedics, paediatrics, neurology and more at SRMS IMS Hospital.",
      },
      { property: "og:title", content: "Our Doctors — SRMS IMS Hospital" },
      {
        property: "og:description",
        content: "Consultant profiles, OPD days and consultation fees at SRMS IMS Hospital.",
      },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");

  const list = doctors.filter(
    (d) =>
      (dept === "All" || d.department === dept) &&
      (d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.department.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold">Our doctors</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Consultants taking outpatient clinics this week. Sign in to view full profiles and book a
            slot.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by doctor or speciality"
            className="pl-9"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", ...departments.map((d) => d.name)].map((name) => (
            <button
              key={name}
              onClick={() => setDept(name)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                dept === name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <Card className="mt-8 border-dashed">
            <CardContent className="p-10 text-center">
              <p className="font-medium">No doctors match that search</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another speciality or clear the filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setQ("");
                  setDept("All");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((doc) => (
              <Card key={doc.id} className="hover-lift border-border">
                <CardContent className="p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials(doc.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{doc.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{doc.qualification}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{doc.department}</Badge>
                    <Badge variant="outline">₹{doc.fee} consultation</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{doc.about}</p>
                  <AvailabilityBadge doctor={doc} className="mt-3" />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-warning text-warning" /> {doc.rating} ({doc.reviews})
                    </span>
                    <span className="text-muted-foreground">{doc.availableDays.join(", ")}</span>
                  </div>
                  <Button className="mt-4 w-full" asChild>
                    <Link to="/login" search={{ intent: "book" }}>
                      Book appointment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
