import {
  Baby,
  Bone,
  Brain,
  Ear,
  Eye,
  HeartPulse,
  Sparkles,
  Stethoscope,
  type LucideProps,
} from "lucide-react";

const MAP = { Baby, Bone, Brain, Ear, Eye, HeartPulse, Sparkles, Stethoscope } as const;

export function DeptIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = MAP[name as keyof typeof MAP] ?? Stethoscope;
  return <Icon {...props} />;
}
