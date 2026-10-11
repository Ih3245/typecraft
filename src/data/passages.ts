import { Passage } from '@/types/typing';

export const PASSAGES: Passage[] = [
  {
    id: 'p1',
    title: 'The Quiet Art of Observation',
    category: 'philosophy',
    difficulty: 'medium',
    text: 'The ability to observe without evaluating is the highest form of intelligence. Most people look at the world and immediately categorize what they see. They reach for familiar labels and comfortable conclusions. But the truly perceptive mind pauses at the threshold of judgment. It lingers in the raw moment of perception and asks questions that have no immediate answers.',
  },
  {
    id: 'p2',
    title: 'Deep Ocean Mysteries',
    category: 'nature',
    difficulty: 'easy',
    text: 'More than eighty percent of the ocean remains unmapped and unexplored. In the crushing darkness of the deep sea, creatures have evolved in ways that defy imagination. Bioluminescent fish create their own light in a world where sunlight never reaches. Giant squid battle sperm whales in the lightless abyss. Every deep-sea expedition returns with species previously unknown to science.',
  },
  {
    id: 'p3',
    title: 'The Internet Revolution',
    category: 'technology',
    difficulty: 'easy',
    text: 'The internet changed everything about how humans communicate, create, and consume information. What began as a military communication network grew into the largest library, marketplace, and social gathering ever built. Today billions of people carry the sum of human knowledge in their pockets. The speed of information has accelerated beyond anything previous generations could have predicted.',
  },
  {
    id: 'p4',
    title: 'Relativity Made Simple',
    category: 'science',
    difficulty: 'hard',
    text: "Einstein realized that time is not a fixed constant flowing at the same rate for all observers. Instead, time is relative to the observer's velocity and position in a gravitational field. A clock on a fast-moving spacecraft ticks more slowly than an identical clock on Earth. GPS satellites must account for this effect or navigation errors would accumulate rapidly, rendering the entire system useless within hours.",
  },
  {
    id: 'p5',
    title: 'On Solitude',
    category: 'philosophy',
    difficulty: 'medium',
    text: 'There is a profound difference between loneliness and solitude. Loneliness is the pain of being alone. Solitude is the joy of being with oneself. In a world saturated with noise, distraction, and the constant hum of connectivity, the capacity to sit quietly with your own thoughts has become a rare and undervalued skill. Great ideas rarely emerge from crowds.',
  },
  {
    id: 'p6',
    title: 'The Architecture of Cities',
    category: 'technology',
    difficulty: 'medium',
    text: 'Cities are machines built for human life. Every street, plaza, and building reflects a decision made by someone about how people should move, gather, and live. The great cities of the world were not planned from above but grew organically over centuries, shaped by trade routes, natural geography, and the accumulated desires of millions of inhabitants seeking better lives.',
  },
  {
    id: 'p7',
    title: 'Light and Darkness',
    category: 'science',
    difficulty: 'easy',
    text: 'Light travels at approximately three hundred thousand kilometers per second. This speed is the ultimate speed limit of the universe. When you look at a star in the night sky, you are not seeing it as it is now. You are seeing it as it was years, decades, or even millions of years ago depending on the distance. The night sky is a museum of the past.',
  },
  {
    id: 'p8',
    title: 'The Written Word',
    category: 'literature',
    difficulty: 'hard',
    text: 'Writing is thinking made visible. When we commit thoughts to paper or screen, we force them into a structure they did not previously have. The act of writing clarifies, refines, and sometimes completely overturns the ideas we thought we held. This is why the most careful thinkers throughout history have kept journals. Not to record what they thought, but to discover what they actually believed.',
  },
  {
    id: 'p9',
    title: 'Forests and Memory',
    category: 'nature',
    difficulty: 'easy',
    text: 'Ancient forests are not silent. They communicate through underground networks of fungi that connect the roots of trees across vast distances. Nutrients and chemical signals pass through this wood wide web. Older trees support younger ones in shade. When a tree falls, its neighbors receive a pulse of resources. The forest behaves less like a collection of individuals and more like a single living organism.',
  },
  {
    id: 'p10',
    title: 'The Speed of Thought',
    category: 'science',
    difficulty: 'hard',
    text: 'The human brain processes information at speeds that still astonish researchers. Neurons fire in coordinated cascades, creating patterns of activity that somehow give rise to consciousness, memory, and emotion. We are not yet able to fully explain how the electrochemical signals of a biological organ produce the subjective experience of being a person who feels, wonders, and dreams.',
  },
];

export function getRandomPassage(excludeId?: string): Passage {
  const available = excludeId
    ? PASSAGES.filter((p) => p.id !== excludeId)
    : PASSAGES;
  return available[Math.floor(Math.random() * available.length)];
}

export function getPassagesByDifficulty(difficulty: Passage['difficulty']): Passage[] {
  return PASSAGES.filter((p) => p.difficulty === difficulty);
}
