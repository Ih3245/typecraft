'use client';

import React from 'react';
import { TestResult } from '@/types/typing';
import { RotateCcw, Trophy, Target, Zap, Clock } from 'lucide-react';

interface ResultScreenProps {
  result: TestResult;
  onRetry: () => void;
  onNext: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetry, onNext }) => {
  const getWpmLabel = (wpm: number) => {
    if (wpm >= 100) return { label: 'Exceptional', color: 'text-emerald-600' };
    if (wpm >= 70) return { label: 'Advanced', color: 'text-blue-600' };
    if (wpm >= 50) return { label: 'Proficient', color: 'text-indigo-600' };
    if (wpm >= 30) return { label: 'Developing', color: 'text-amber-600' };
    return { label: 'Beginner', color: 'text-slate-500' };
  };

  const { label, color } = getWpmLabel(result.wpm);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Main WPM */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Your Result
        </p>
        <div className="flex items-end justify-center gap-3">
          <span className="text-8xl sm:text-9xl font-black text-slate-900 tabular-nums leading-none">
            {result.wpm}
          </span>
          <span className="text-3xl font-semibold text-slate-400 mb-4">wpm</span>
        </div>
        <p className={`text-lg font-semibold mt-2 ${color}`}>{label}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            icon: Target,
            label: 'Accuracy',
            value: `${result.accuracy}%`,
            color: result.accuracy >= 95 ? 'text-emerald-600' : result.accuracy >= 80 ? 'text-amber-600' : 'text-red-500',
          },
          {
            icon: Zap,
            label: 'Raw WPM',
            value: `${result.rawWpm}`,
            color: 'text-slate-700',
          },
          {
            icon: Clock,
            label: 'Duration',
            value: `${result.duration}s`,
            color: 'text-slate-700',
          },
          {
            icon: Trophy,
            label: 'Errors',
            value: `${result.incorrectChars}`,
            color: result.incorrectChars === 0 ? 'text-emerald-600' : 'text-red-500',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-4 text-center"
            >
              <Icon className="w-4 h-4 text-slate-400 mx-auto mb-2" />
              <p className={`text-2xl font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Passage name */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">Passage</p>
          <p className="text-sm font-semibold text-slate-800">{result.passage.title}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded border ${
            result.passage.difficulty === 'easy'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : result.passage.difficulty === 'medium'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {result.passage.difficulty}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Same
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all cursor-pointer"
        >
          Next Passage →
        </button>
      </div>
    </div>
  );
};
