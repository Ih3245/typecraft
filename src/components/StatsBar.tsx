'use client';

import React from 'react';
import { TestResult } from '@/types/typing';
import { getBestWpm, getAverageWpm, getAverageAccuracy } from '@/lib/results-store';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  recentResults: TestResult[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ recentResults }) => {
  const best = getBestWpm();
  const avg = getAverageWpm();
  const accuracy = getAverageAccuracy();

  if (recentResults.length === 0) return null;

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Trophy className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-slate-700 font-semibold">{best}</span>
        <span className="text-slate-400">best</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-slate-700 font-semibold">{avg}</span>
        <span className="text-slate-400">avg wpm</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <Target className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-slate-700 font-semibold">{accuracy}%</span>
        <span className="text-slate-400">accuracy</span>
      </div>
    </div>
  );
};
