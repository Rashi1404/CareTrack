import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  appointments as seedAppointments,
  doctors as seedDoctors,
  notifications as seedNotifications,
  patients as seedPatients,
  today,
  TRACK_STAGES,
  type AppNotification,
  type Appointment,
  type AppointmentStatus,
  type Doctor,
  type Patient,
  type Role,
} from "./mock-data";

export interface SessionUser {
  id: string;
  name: string;
  role: Role;
  email: string;
}

const DEMO_USERS: Record<Role, SessionUser> = {
  patient: { id: "p1", name: "Aarav Sharma", role: "patient", email: "aarav.sharma@example.com" },
  doctor: { id: "d1", name: "Dr. Anjali Mehrotra", role: "doctor", email: "a.mehrotra@srmsims.hospital" },
  admin: { id: "admin", name: "Sunita Rawat", role: "admin", email: "admin@srmsims.hospital" },
};

interface AppState {
  user: SessionUser | null;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  notifications: AppNotification[];
  login: (role: Role, email: string) => SessionUser;
  logout: () => void;
  register: (name: string, email: string) => SessionUser;
  book: (input: {
    doctorId: string;
    date: string;
    time: string;
    reason: string;
    patientId?: string;
  }) => Appointment;
  reschedule: (id: string, date: string, time: string) => void;
  cancel: (id: string) => void;
  setStatus: (id: string, status: AppointmentStatus) => void;
  advance: (id: string) => void;
  updateVisit: (id: string, notes: string, prescription: string) => void;
  setAvailability: (doctorId: string, days: string[], slots: string[]) => void;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  markAllRead: () => void;
  currentToken: (doctorId: string, date: string) => number;
}

const AppContext = createContext<AppState | null>(null);

let counter = 100;
const nextId = (prefix: string) => `${prefix}${++counter}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(seedDoctors);
  const [patients, setPatients] = useState<Patient[]>(seedPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);

  const pushNotification = useCallback((userId: string, title: string, body: string) => {
    setNotifications((prev) => [
      { id: nextId("n"), userId, title, body, time: "Just now", read: false },
      ...prev,
    ]);
  }, []);

  const login = useCallback((role: Role, email: string) => {
    const session = { ...DEMO_USERS[role], email: email || DEMO_USERS[role].email };
    setUser(session);
    return session;
  }, []);

  const register = useCallback((name: string, email: string) => {
    const id = nextId("p");
    const patient: Patient = {
      id,
      name,
      age: 0,
      gender: "Not specified",
      phone: "",
      email,
      bloodGroup: "Not recorded",
      allergies: "None recorded",
      conditions: "None recorded",
      address: "",
      registered: today,
    };
    setPatients((prev) => [patient, ...prev]);
    const session: SessionUser = { id, name, role: "patient", email };
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const currentToken = useCallback(
    (doctorId: string, date: string) => {
      const active = appointments.filter(
        (a) => a.doctorId === doctorId && a.date === date && a.status === "With Doctor",
      );
      if (active.length) return active[0]!.token;
      const done = appointments
        .filter((a) => a.doctorId === doctorId && a.date === date && a.status === "Completed")
        .map((a) => a.token);
      return done.length ? Math.max(...done) : 0;
    },
    [appointments],
  );

  const book: AppState["book"] = useCallback(
    ({ doctorId, date, time, reason, patientId }) => {
      const pid = patientId ?? user?.id ?? "p1";
      const sameDay = seedAppointments
        .concat()
        .filter((a) => a.doctorId === doctorId && a.date === date);
      const token = (sameDay.length ? Math.max(...sameDay.map((a) => a.token)) : 0) + 1;
      const appointment: Appointment = {
        id: nextId("a"),
        patientId: pid,
        doctorId,
        date,
        time,
        reason,
        status: "Confirmed",
        token,
        createdAt: today,
      };
      setAppointments((prev) => [appointment, ...prev]);
      const doctor = seedDoctors.find((d) => d.id === doctorId);
      pushNotification(
        pid,
        "Appointment confirmed",
        `${doctor?.department} OPD with ${doctor?.name} on ${date} at ${time}. Token ${token}.`,
      );
      pushNotification(doctorId, "New booking", `A patient booked ${time} on ${date}.`);
      return appointment;
    },
    [pushNotification, user],
  );

  const reschedule = useCallback(
    (id: string, date: string, time: string) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, date, time, status: "Confirmed" } : a)),
      );
      const appt = appointments.find((a) => a.id === id);
      if (appt) {
        pushNotification(
          appt.patientId,
          "Appointment rescheduled",
          `Moved to ${date} at ${time}.`,
        );
      }
    },
    [appointments, pushNotification],
  );

  const cancel = useCallback(
    (id: string) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)),
      );
      const appt = appointments.find((a) => a.id === id);
      if (appt) {
        pushNotification(appt.patientId, "Appointment cancelled", `Your ${appt.date} visit was cancelled.`);
      }
    },
    [appointments, pushNotification],
  );

  const setStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const advance = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const i = TRACK_STAGES.indexOf(a.status);
        if (i < 0 || i === TRACK_STAGES.length - 1) return a;
        return { ...a, status: TRACK_STAGES[i + 1]! };
      }),
    );
  }, []);

  const updateVisit = useCallback((id: string, notes: string, prescription: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notes, prescription, status: "Completed" } : a)),
    );
  }, []);

  const setAvailability = useCallback((doctorId: string, days: string[], slots: string[]) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, availableDays: days, slots } : d)),
    );
  }, []);

  const updatePatient = useCallback((id: string, patch: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      user,
      doctors,
      patients,
      appointments,
      notifications,
      login,
      logout,
      register,
      book,
      reschedule,
      cancel,
      setStatus,
      advance,
      updateVisit,
      setAvailability,
      updatePatient,
      markAllRead,
      currentToken,
    }),
    [
      user,
      doctors,
      patients,
      appointments,
      notifications,
      login,
      logout,
      register,
      book,
      reschedule,
      cancel,
      setStatus,
      advance,
      updateVisit,
      setAvailability,
      updatePatient,
      markAllRead,
      currentToken,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
