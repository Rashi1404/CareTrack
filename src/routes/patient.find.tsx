import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-store";
import { departments } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { AvailabilityBadge } from "@/components/availability-badge";

export const Route = createFileRoute("/patient/find")({
  head: () => ({
    meta: [
      { title: "Find a Doctor — CareTrack" },
      {
        name: "description",
        content: "Search SRMS IMS Hospital consultants by department, day, fee and rating.",
      },
      { property: "og:title", content: "Find a Doctor — CareTrack" },
      { property: "og:description", content: "Filter consultants by department, day and fee." },
    ],
  }),
  component: FindDoctor,
});

const DAYS = ["Any day", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function FindDoctor() {
  const { doctors } = useApp();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");
  const [day, setDay] = useState("Any day");
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const list = doctors
    .filter(
      (d) =>
        (dept === "All departments" || d.department === dept) &&
        (day === "Any day" || d.availableDays.includes(day)) &&
        (d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.department.toLowerCase().includes(q.toLowerCase())),
    )
    .sort((a, b) =>
      sort === "fee" ? a.fee - b.fee : sort === "experience" ? b.experience - a.experience : b.rating - a.rating,
    );

  return (
    <AppShell title="Find a doctor" subtitle="Search consultants and book an OPD slot">
      <Card className="border-border">
        <CardContent className="grid gap-3 p-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Doctor name or speciality"
              className="pl-9"
            />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All departments", ...departments.map((d) => d.name)].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-2 md:col-span-4">
            <span className="text-sm text-muted-foreground">Sort by</span>
            {[
              ["rating", "Rating"],
              ["experience", "Experience"],
              ["fee", "Lowest fee"],
            ].map(([v, l]) => (
              <Button
                key={v}
                size="sm"
                variant={sort === v ? "default" : "outline"}
                onClick={() => setSort(v ?? "rating")}
              >
                {l}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="border-border">
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="p-10 text-center">
            <p className="font-medium">No doctors found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different department or clear the day filter.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQ("");
                setDept("All departments");
                setDay("Any day");
              }}
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">{list.length} doctors available</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                    <Badge variant="outline">₹{doc.fee}</Badge>
                    <Badge variant="outline">{doc.experience} yrs</Badge>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-warning text-warning" /> {doc.rating}
                    <span className="text-muted-foreground">({doc.reviews} reviews)</span>
                  </p>
                  <AvailabilityBadge doctor={doc} className="mt-3" />
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to="/patient/doctor/$id" params={{ id: doc.id }}>
                        Profile
                      </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link to="/patient/book/$id" params={{ id: doc.id }}>
                        Book
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
