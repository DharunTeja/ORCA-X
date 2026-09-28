import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals: number = 1): string {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'high':
    case 'severe':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'medium':
    case 'moderate':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'low':
    case 'normal':
    default:
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
}
