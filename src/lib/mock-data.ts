export type Role = "patient" | "doctor" | "admin";

export type AppointmentStatus =
  | "Confirmed"
  | "Checked In"
  | "Waiting"
  | "With Doctor"
  | "Completed"
  | "Cancelled";

export const TRACK_STAGES: AppointmentStatus[] = [
  "Confirmed",
  "Checked In",
  "Waiting",
  "With Doctor",
  "Completed",
];

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  doctors: number;
  floor: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  languages: string[];
  about: string;
  room: string;
  availableDays: string[];
  slots: string[];
  avgMinutesPerPatient: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  address: string;
  registered: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // yyyy-mm-dd
  time: string;
  reason: string;
  status: AppointmentStatus;
  token: number;
  createdAt: string;
  notes?: string;
  prescription?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const HOSPITAL = {
  name: "SRMS IMS Hospital",
  app: "CareTrack",
  address: "Ram Murti Puram, Bareilly – Nainital Road, Bareilly, UP 243202",
  phone: "+91 581 258 2000",
  email: "care@srmsims.hospital",
};

export const departments: Department[] = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart care, ECG, echo, angiography and cardiac rehabilitation.",
    icon: "HeartPulse",
    doctors: 6,
    floor: "Block A · 2nd Floor",
  },
  {
    id: "orthopaedics",
    name: "Orthopaedics",
    description: "Joint replacement, sports injuries, spine and fracture care.",
    icon: "Bone",
    doctors: 5,
    floor: "Block B · 1st Floor",
  },
  {
    id: "paediatrics",
    name: "Paediatrics",
    description: "Newborn, child health, immunisation and paediatric ICU.",
    icon: "Baby",
    doctors: 4,
    floor: "Block C · Ground Floor",
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Stroke unit, epilepsy clinic, EEG and neuro rehabilitation.",
    icon: "Brain",
    doctors: 3,
    floor: "Block A · 4th Floor",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    description: "Skin, hair and allergy clinic with minor procedure suite.",
    icon: "Sparkles",
    doctors: 3,
    floor: "Block C · 2nd Floor",
  },
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Fever clinic, diabetes, hypertension and preventive health.",
    icon: "Stethoscope",
    doctors: 7,
    floor: "Block A · Ground Floor",
  },
  {
    id: "ent",
    name: "ENT",
    description: "Ear, nose, throat, audiometry and endoscopic sinus surgery.",
    icon: "Ear",
    doctors: 3,
    floor: "Block B · 2nd Floor",
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    description: "Cataract, retina, glaucoma and paediatric eye care.",
    icon: "Eye",
    doctors: 4,
    floor: "Block C · 1st Floor",
  },
];

const morning = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
const evening = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Anjali Mehrotra",
    department: "Cardiology",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: 14,
    rating: 4.8,
    reviews: 312,
    fee: 700,
    languages: ["English", "Hindi"],
    about:
      "Interventional cardiologist leading the cath lab at SRMS IMS. Special interest in preventive cardiology and heart failure clinics.",
    room: "Room 214, Block A",
    availableDays: ["Mon", "Tue", "Wed", "Fri"],
    slots: [...morning, ...evening],
    avgMinutesPerPatient: 12,
  },
  {
    id: "d2",
    name: "Dr. Rakesh Saxena",
    department: "Orthopaedics",
    qualification: "MBBS, MS (Ortho)",
    experience: 19,
    rating: 4.7,
    reviews: 428,
    fee: 650,
    languages: ["Hindi", "English"],
    about:
      "Joint replacement surgeon with over 3,000 knee and hip procedures. Runs the weekly sports injury clinic.",
    room: "Room 108, Block B",
    availableDays: ["Mon", "Thu", "Fri", "Sat"],
    slots: morning,
    avgMinutesPerPatient: 10,
  },
  {
    id: "d3",
    name: "Dr. Neha Agarwal",
    department: "Paediatrics",
    qualification: "MBBS, MD (Paediatrics)",
    experience: 9,
    rating: 4.9,
    reviews: 501,
    fee: 500,
    languages: ["Hindi", "English", "Urdu"],
    about:
      "Paediatrician and neonatologist handling NICU care, growth monitoring and the hospital immunisation programme.",
    room: "Room 12, Block C",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    slots: [...morning, ...evening],
    avgMinutesPerPatient: 8,
  },
  {
    id: "d4",
    name: "Dr. Imran Qureshi",
    department: "Neurology",
    qualification: "MBBS, MD, DM (Neurology)",
    experience: 12,
    rating: 4.6,
    reviews: 187,
    fee: 800,
    languages: ["English", "Hindi"],
    about:
      "Neurologist managing the stroke unit and epilepsy clinic, with focus on movement disorders and headache care.",
    room: "Room 402, Block A",
    availableDays: ["Tue", "Wed", "Sat"],
    slots: morning,
    avgMinutesPerPatient: 15,
  },
  {
    id: "d5",
    name: "Dr. Shalini Rastogi",
    department: "Dermatology",
    qualification: "MBBS, MD (Dermatology)",
    experience: 8,
    rating: 4.5,
    reviews: 246,
    fee: 550,
    languages: ["Hindi", "English"],
    about:
      "Dermatologist specialising in paediatric eczema, acne management and minor dermato-surgical procedures.",
    room: "Room 221, Block C",
    availableDays: ["Mon", "Wed", "Fri"],
    slots: evening,
    avgMinutesPerPatient: 9,
  },
  {
    id: "d6",
    name: "Dr. Vikram Chauhan",
    department: "General Medicine",
    qualification: "MBBS, MD (Gen. Medicine)",
    experience: 16,
    rating: 4.7,
    reviews: 654,
    fee: 400,
    languages: ["Hindi", "English"],
    about:
      "Physician running the diabetes and hypertension clinics, plus the hospital's preventive health check programme.",
    room: "Room 04, Block A",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    slots: [...morning, ...evening],
    avgMinutesPerPatient: 7,
  },
  {
    id: "d7",
    name: "Dr. Pooja Bhardwaj",
    department: "ENT",
    qualification: "MBBS, MS (ENT)",
    experience: 11,
    rating: 4.6,
    reviews: 203,
    fee: 600,
    languages: ["English", "Hindi"],
    about:
      "ENT surgeon focusing on endoscopic sinus surgery, hearing assessment and paediatric airway care.",
    room: "Room 205, Block B",
    availableDays: ["Tue", "Thu", "Sat"],
    slots: morning,
    avgMinutesPerPatient: 10,
  },
  {
    id: "d8",
    name: "Dr. Sameer Tandon",
    department: "Ophthalmology",
    qualification: "MBBS, MS (Ophthalmology)",
    experience: 13,
    rating: 4.8,
    reviews: 389,
    fee: 500,
    languages: ["Hindi", "English"],
    about:
      "Cataract and retina surgeon, performing phaco surgery and diabetic retinopathy screening camps.",
    room: "Room 117, Block C",
    availableDays: ["Mon", "Wed", "Thu", "Sat"],
    slots: [...morning, ...evening],
    avgMinutesPerPatient: 8,
  },
];

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Aarav Sharma",
    age: 32,
    gender: "Male",
    phone: "+91 98370 41122",
    email: "aarav.sharma@example.com",
    bloodGroup: "O+",
    allergies: "Penicillin",
    conditions: "Hypertension (since 2022)",
    address: "Civil Lines, Bareilly, UP",
    registered: "2024-03-11",
  },
  {
    id: "p2",
    name: "Meera Joshi",
    age: 28,
    gender: "Female",
    phone: "+91 90124 55810",
    email: "meera.joshi@example.com",
    bloodGroup: "B+",
    allergies: "None recorded",
    conditions: "Migraine",
    address: "Rajendra Nagar, Bareilly, UP",
    registered: "2024-07-02",
  },
  {
    id: "p3",
    name: "Harish Verma",
    age: 54,
    gender: "Male",
    phone: "+91 99271 30045",
    email: "harish.verma@example.com",
    bloodGroup: "A+",
    allergies: "Sulfa drugs",
    conditions: "Type 2 Diabetes, Knee osteoarthritis",
    address: "Izatnagar, Bareilly, UP",
    registered: "2023-11-19",
  },
  {
    id: "p4",
    name: "Sana Khan",
    age: 6,
    gender: "Female",
    phone: "+91 98991 77220",
    email: "khan.family@example.com",
    bloodGroup: "AB+",
    allergies: "Dust mites",
    conditions: "Childhood asthma",
    address: "Prem Nagar, Bareilly, UP",
    registered: "2025-01-22",
  },
  {
    id: "p5",
    name: "Devendra Pal",
    age: 67,
    gender: "Male",
    phone: "+91 94125 66031",
    email: "d.pal@example.com",
    bloodGroup: "O-",
    allergies: "None recorded",
    conditions: "Cataract (right eye), CAD",
    address: "Subhash Nagar, Bareilly, UP",
    registered: "2023-05-08",
  },
  {
    id: "p6",
    name: "Ritika Singh",
    age: 24,
    gender: "Female",
    phone: "+91 97600 12984",
    email: "ritika.singh@example.com",
    bloodGroup: "B-",
    allergies: "Latex",
    conditions: "Iron deficiency anaemia",
    address: "Deen Dayal Puram, Bareilly, UP",
    registered: "2025-06-14",
  },
];

function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export const today = isoDay(0);

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "d1",
    date: today,
    time: "10:00 AM",
    reason: "Blood pressure follow-up and ECG review",
    status: "Waiting",
    token: 14,
    createdAt: isoDay(-4),
  },
  {
    id: "a2",
    patientId: "p3",
    doctorId: "d1",
    date: today,
    time: "09:30 AM",
    reason: "Chest discomfort on exertion",
    status: "With Doctor",
    token: 12,
    createdAt: isoDay(-6),
  },
  {
    id: "a3",
    patientId: "p6",
    doctorId: "d1",
    date: today,
    time: "11:00 AM",
    reason: "Palpitations, reports review",
    status: "Checked In",
    token: 16,
    createdAt: isoDay(-2),
  },
  {
    id: "a4",
    patientId: "p4",
    doctorId: "d3",
    date: today,
    time: "10:30 AM",
    reason: "Asthma review before school camp",
    status: "Confirmed",
    token: 7,
    createdAt: isoDay(-1),
  },
  {
    id: "a5",
    patientId: "p1",
    doctorId: "d6",
    date: isoDay(-21),
    time: "05:00 PM",
    reason: "Annual preventive health check",
    status: "Completed",
    token: 21,
    createdAt: isoDay(-30),
    notes: "BP 138/88. Advised low-sodium diet and 30 min brisk walk daily.",
    prescription: "Telmisartan 40mg once daily · Review after 4 weeks",
  },
  {
    id: "a6",
    patientId: "p1",
    doctorId: "d8",
    date: isoDay(-63),
    time: "09:30 AM",
    reason: "Blurred vision while reading",
    status: "Completed",
    token: 9,
    createdAt: isoDay(-70),
    notes: "Refraction done. Early presbyopia.",
    prescription: "Reading glasses +1.00 D · Review in 1 year",
  },
  {
    id: "a7",
    patientId: "p1",
    doctorId: "d2",
    date: isoDay(-95),
    time: "11:30 AM",
    reason: "Left ankle sprain after cricket",
    status: "Cancelled",
    token: 18,
    createdAt: isoDay(-99),
  },
  {
    id: "a8",
    patientId: "p5",
    doctorId: "d8",
    date: isoDay(2),
    time: "09:00 AM",
    reason: "Cataract surgery pre-assessment",
    status: "Confirmed",
    token: 3,
    createdAt: isoDay(-3),
  },
  {
    id: "a9",
    patientId: "p2",
    doctorId: "d4",
    date: isoDay(1),
    time: "10:00 AM",
    reason: "Recurring migraine, MRI report",
    status: "Confirmed",
    token: 5,
    createdAt: isoDay(-5),
  },
  {
    id: "a10",
    patientId: "p3",
    doctorId: "d2",
    date: isoDay(3),
    time: "09:30 AM",
    reason: "Knee pain, physiotherapy plan",
    status: "Confirmed",
    token: 6,
    createdAt: isoDay(-2),
  },
  {
    id: "a11",
    patientId: "p2",
    doctorId: "d5",
    date: isoDay(-14),
    time: "04:30 PM",
    reason: "Skin rash on forearms",
    status: "Completed",
    token: 11,
    createdAt: isoDay(-18),
    notes: "Contact dermatitis. Advised fragrance-free moisturiser.",
    prescription: "Mometasone cream 0.1% for 7 days",
  },
  {
    id: "a12",
    patientId: "p6",
    doctorId: "d6",
    date: today,
    time: "04:00 PM",
    reason: "Fatigue and low haemoglobin",
    status: "Confirmed",
    token: 22,
    createdAt: isoDay(-1),
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    userId: "p1",
    title: "You are next but one",
    body: "Token 14 · Dr. Anjali Mehrotra is currently seeing token 12.",
    time: "12 min ago",
    read: false,
  },
  {
    id: "n2",
    userId: "p1",
    title: "Appointment confirmed",
    body: "Cardiology OPD today at 10:00 AM, Room 214, Block A.",
    time: "Yesterday",
    read: false,
  },
  {
    id: "n3",
    userId: "p1",
    title: "Lab report ready",
    body: "Your lipid profile from 12 Aug is available at the records desk.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "n4",
    userId: "d1",
    title: "Queue update",
    body: "3 patients are waiting in the Cardiology OPD queue.",
    time: "5 min ago",
    read: false,
  },
  {
    id: "n5",
    userId: "d1",
    title: "New booking",
    body: "Ritika Singh booked an 11:00 AM slot for today.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "n6",
    userId: "admin",
    title: "High OPD load",
    body: "General Medicine has crossed 40 bookings for today.",
    time: "30 min ago",
    read: false,
  },
];

export const weeklyLoad = [
  { day: "Mon", appointments: 62, completed: 55 },
  { day: "Tue", appointments: 71, completed: 64 },
  { day: "Wed", appointments: 58, completed: 52 },
  { day: "Thu", appointments: 77, completed: 68 },
  { day: "Fri", appointments: 84, completed: 79 },
  { day: "Sat", appointments: 49, completed: 44 },
  { day: "Sun", appointments: 18, completed: 16 },
];

export const departmentLoad = [
  { name: "General Medicine", value: 132 },
  { name: "Cardiology", value: 98 },
  { name: "Orthopaedics", value: 76 },
  { name: "Paediatrics", value: 71 },
  { name: "Ophthalmology", value: 54 },
  { name: "Others", value: 88 },
];
