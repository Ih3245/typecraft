import type { Metadata } from 'next';
import { Geist_Mono, Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'TypeCraft — Professional WPM Typing Test',
  description: 'Measure your typing speed and accuracy with real-time feedback. Track your progress and beat your personal best.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-[#FAFAFA] text-slate-900 antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
