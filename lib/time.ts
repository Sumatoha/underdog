export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function getTimeLeft(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
  };
}

export function getUrgency(createdAt: string, deadline: string): number {
  const total = new Date(deadline).getTime() - new Date(createdAt).getTime();
  const elapsed = Date.now() - new Date(createdAt).getTime();
  return Math.min(1, Math.max(0, elapsed / total));
}
