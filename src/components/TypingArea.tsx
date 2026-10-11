'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Passage, CharResult, CharState, TestResult, TimerMode } from '@/types/typing';
import { saveResult } from '@/lib/results-store';
import { RotateCcw } from 'lucide-react';

interface TypingAreaProps {
  passage: Passage;
  timerMode: TimerMode;
  onComplete: (result: TestResult) => void;
  onRestart: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  passage,
  timerMode,
  onComplete,
  onRestart,
}) => {
  const words = passage.text.split(' ');
  const allChars = passage.text.split('');

  const [typed, setTyped] = useState('');
  const [charResults, setCharResults] = useState<CharResult[]>(
    allChars.map((c) => ({ char: c, state: 'idle' as CharState }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(timerMode);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Focus on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Timer logic
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const finishTest = useCallback(() => {
    if (finished) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);

    const elapsed = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : timerMode;

    const correctChars = charResults.filter((c) => c.state === 'correct').length;
    const totalTyped = charResults.filter((c) => c.state !== 'idle').length;
    const errCount = charResults.filter((c) => c.state === 'incorrect').length;

    // WPM = (correct chars / 5) / (minutes elapsed)
    const minutes = elapsed / 60;
    const wpm = Math.round(correctChars / 5 / minutes);
    const rawWpm = Math.round(totalTyped / 5 / minutes);
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;

    const result: TestResult = {
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars: errCount,
      totalChars: totalTyped,
      duration: Math.round(elapsed),
      passage,
      completedAt: new Date().toISOString(),
    };

    saveResult(result);
    onComplete(result);
  }, [charResults, finished, timerMode, passage, onComplete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (finished) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        onRestart();
        return;
      }

      if (!started && e.key.length === 1) {
        setStarted(true);
        startTimeRef.current = Date.now();
      }

      if (e.key === 'Backspace') {
        if (currentIndex === 0) return;
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        setCharResults((prev) => {
          const updated = [...prev];
          updated[newIndex] = { ...updated[newIndex], state: 'idle' };
          return updated;
        });
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length !== 1) return;
      if (currentIndex >= allChars.length) return;

      const expected = allChars[currentIndex];
      const isCorrect = e.key === expected;

      setCharResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          char: expected,
          state: isCorrect ? 'correct' : 'incorrect',
        };
        return updated;
      });

      if (!isCorrect) setIncorrectCount((p) => p + 1);

      setTyped((prev) => prev + e.key);
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Finished all characters
      if (nextIndex >= allChars.length) {
        finishTest();
      }
    },
    [currentIndex, allChars, started, finished, finishTest, onRestart]
  );

  // Scroll active line into view
  const activeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [currentIndex]);

  // Timer color
  const timerColor =
    timeLeft <= 5
      ? 'text-red-500'
      : timeLeft <= 10
      ? 'text-amber-500'
      : 'text-slate-700';

  // Build word-by-word spans for rendering
  let charIdx = 0;
  const wordSpans: React.ReactNode[] = [];

  for (let wi = 0; wi < words.length; wi++) {
    const word = words[wi];
    const letterSpans: React.ReactNode[] = [];

    for (let li = 0; li < word.length; li++) {
      const absIdx = charIdx;
      const result = charResults[absIdx];
      const isCurrent = absIdx === currentIndex;

      letterSpans.push(
        <span
          key={`${wi}-${li}`}
          ref={isCurrent ? activeRef : null}
          className={`relative text-2xl sm:text-3xl font-mono transition-colors duration-75 leading-relaxed tracking-wide ${
            result.state === 'correct'
              ? 'text-slate-900'
              : result.state === 'incorrect'
              ? 'text-red-500'
              : 'text-slate-400'
          }`}
        >
          {isCurrent && !finished && (
            <span className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-slate-900 animate-pulse rounded-full" />
          )}
          {result.char}
        </span>
      );
      charIdx++;
    }

    // space after word (except last)
    if (wi < words.length - 1) {
      const spaceIdx = charIdx;
      const spaceResult = charResults[spaceIdx];
      const isCurrent = spaceIdx === currentIndex;
      letterSpans.push(
        <span
          key={`${wi}-space`}
          ref={isCurrent ? activeRef : null}
          className={`relative text-2xl sm:text-3xl font-mono transition-colors duration-75 leading-relaxed ${
            spaceResult?.state === 'correct'
              ? 'text-slate-900'
              : spaceResult?.state === 'incorrect'
              ? 'text-red-400'
              : 'text-slate-300'
          }`}
        >
          {isCurrent && !finished && (
            <span className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-slate-900 animate-pulse rounded-full" />
          )}
          {' '}
        </span>
      );
      charIdx++;
    }

    wordSpans.push(
      <span key={wi} className="inline">
        {letterSpans}
      </span>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Timer & Stats Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
            Time Remaining
          </p>
          <p className={`text-5xl font-bold tabular-nums tracking-tight ${timerColor}`}>
            {started ? timeLeft : timerMode}
            <span className="text-lg font-normal text-slate-400 ml-1">s</span>
          </p>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
              WPM
            </p>
            <p className="text-4xl font-bold text-slate-800 tabular-nums">
              {started && elapsedSeconds > 0
                ? Math.round(
                    charResults.filter((c) => c.state === 'correct').length /
                      5 /
                      (elapsedSeconds / 60)
                  )
                : 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
              Errors
            </p>
            <p className="text-4xl font-bold text-red-400 tabular-nums">{incorrectCount}</p>
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative bg-white border border-slate-200 rounded-2xl p-8 focus:outline-none focus:border-slate-400 cursor-text overflow-hidden max-h-52 select-none"
        style={{ lineHeight: '2.2rem' }}
      >
        {/* Not started overlay hint */}
        {!started && !finished && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl z-10 pointer-events-none">
            <p className="text-slate-500 text-sm font-medium tracking-wide">
              Click here and start typing
            </p>
          </div>
        )}

        <div className="font-mono text-2xl sm:text-3xl leading-relaxed tracking-wide overflow-hidden">
          {wordSpans}
        </div>
      </div>

      {/* Hint bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          {currentIndex} / {allChars.length} characters
        </span>
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Tab to restart</span>
        </button>
      </div>
    </div>
  );
};
