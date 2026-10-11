'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Passage, TestResult, TimerMode } from '@/types/typing';
import { PASSAGES, getRandomPassage } from '@/data/passages';
import { getResults } from '@/lib/results-store';
import { TypingArea } from '@/components/TypingArea';
import { ResultScreen } from '@/components/ResultScreen';
import { StatsBar } from '@/components/StatsBar';
import { RotateCcw } from 'lucide-react';

type Screen = 'test' | 'result';

const TIMER_OPTIONS: TimerMode[] = [15, 30, 60, 120];

export default function Home() {
  const [screen, setScreen] = useState<Screen>('test');
  const [passage, setPassage] = useState<Passage>(PASSAGES[0]);
  const [timerMode, setTimerMode] = useState<TimerMode>(60);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testKey, setTestKey] = useState(0); // force remount to reset

  useEffect(() => {
    setResults(getResults());
  }, []);

  const handleComplete = useCallback((result: TestResult) => {
    setLastResult(result);
    setResults(getResults());
    setScreen('result');
  }, []);

  const handleRetry = useCallback(() => {
    setTestKey((k) => k + 1);
    setScreen('test');
  }, []);

  const handleNext = useCallback(() => {
    setPassage((p) => getRandomPassage(p.id));
    setTestKey((k) => k + 1);
    setScreen('test');
  }, []);

  const handleRestart = useCallback(() => {
    setTestKey((k) => k + 1);
    setScreen('test');
  }, []);

  const handleTimerChange = (mode: TimerMode) => {
    setTimerMode(mode);
    setTestKey((k) => k + 1);
    setScreen('test');
  };

  const handlePassageSelect = (p: Passage) => {
    setPassage(p);
    setTestKey((k) => k + 1);
    setScreen('test');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">TypeCraft</h1>
            <span className="text-slate-300 text-sm">|</span>
            <span className="text-xs text-slate-500 font-medium">WPM Typing Test</span>
          </div>

          {/* Live stats */}
          <StatsBar recentResults={results} />
        </div>
      </header>

      {/* Controls */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
          {/* Timer selector */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => handleTimerChange(t)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  timerMode === t
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>

          {/* Passage selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            {PASSAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePassageSelect(p)}
                title={p.title}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                  passage.id === p.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.title.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          {/* Restart button */}
          <button
            onClick={handleRestart}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {screen === 'test' ? (
          <>
            {/* Passage info */}
            <div className="w-full max-w-3xl mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">{passage.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                  {passage.category} · {passage.difficulty}
                </p>
              </div>
              <button
                onClick={handleNext}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Skip passage →
              </button>
            </div>

            <TypingArea
              key={testKey}
              passage={passage}
              timerMode={timerMode}
              onComplete={handleComplete}
              onRestart={handleRestart}
            />
          </>
        ) : lastResult ? (
          <ResultScreen
            result={lastResult}
            onRetry={handleRetry}
            onNext={handleNext}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-4 px-6 text-center">
        <p className="text-xs text-slate-400">
          TypeCraft · Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono text-[11px]">Tab</kbd> to restart at any time
        </p>
      </footer>
    </div>
  );
}
