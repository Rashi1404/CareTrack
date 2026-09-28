import type { Appointment, AppointmentStatus, Doctor } from "./mock-data";

export function dateLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function dayCode(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] ?? "Sun";
}

export function nextDates(count = 10) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function estimatedWait(appt: Appointment, current: number, doctor?: Doctor) {
  const ahead = Math.max(appt.token - Math.max(current, 0) - 1, 0);
  const perPatient = doctor?.avgMinutesPerPatient ?? 10;
  if (appt.status === "With Doctor") return 0;
  return ahead * perPatient;
}

export const statusTone: Record<AppointmentStatus, string> = {
  Confirmed: "bg-success/12 text-success ring-1 ring-success/30",
  "Checked In": "bg-info/12 text-info ring-1 ring-info/30",
  Waiting: "bg-warning/25 text-warning-foreground ring-1 ring-warning/50",
  "With Doctor": "bg-accent/15 text-accent-foreground ring-1 ring-accent/40",
  Completed: "bg-muted text-muted-foreground ring-1 ring-border",
  Cancelled: "bg-destructive/10 text-destructive ring-1 ring-destructive/30",
};

export const statusDot: Record<AppointmentStatus, string> = {
  Confirmed: "bg-success",
  "Checked In": "bg-info",
  Waiting: "bg-warning",
  "With Doctor": "bg-accent",
  Completed: "bg-muted-foreground",
  Cancelled: "bg-destructive",
};

/** Next free OPD slot for a doctor, looking ahead 14 days. */
export function nextAvailable(doctor: Doctor, appointments: Appointment[]) {
  const now = new Date();
  for (const date of nextDates(14)) {
    if (!doctor.availableDays.includes(dayCode(date))) continue;
    const taken = appointments
      .filter((a) => a.doctorId === doctor.id && a.date === date && a.status !== "Cancelled")
      .map((a) => a.time);
    for (const slot of doctor.slots) {
      if (taken.includes(slot)) continue;
      if (date === nextDates(1)[0]) {
        const [hm, ap] = slot.split(" ");
        const [h, m] = (hm ?? "0:0").split(":").map(Number);
        const hours = ((h ?? 0) % 12) + (ap === "PM" ? 12 : 0);
        if (hours * 60 + (m ?? 0) <= now.getHours() * 60 + now.getMinutes()) continue;
      }
      return { date, time: slot, today: date === nextDates(1)[0] };
    }
  }
  return null;
}
