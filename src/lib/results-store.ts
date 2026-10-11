import { TestResult } from '@/types/typing';

const KEY = 'typecraft_results_v1';

export function saveResult(result: TestResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getResults();
    const updated = [result, ...existing].slice(0, 20); // keep last 20
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export function getResults(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getBestWpm(): number {
  const results = getResults();
  if (results.length === 0) return 0;
  return Math.max(...results.map((r) => r.wpm));
}

export function getAverageWpm(): number {
  const results = getResults();
  if (results.length === 0) return 0;
  return Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length);
}

export function getAverageAccuracy(): number {
  const results = getResults();
  if (results.length === 0) return 0;
  return Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length);
}
