const paragraphs = [
  "the quick brown fox jumps over the lazy dog every single day and never gets tired of it",
  "practice makes progress and progress makes confidence so keep typing a little each day",
  "good design is obvious great design is transparent the best tools get out of your way",
  "small consistent efforts compound into remarkable results when you give them enough time",
  "writing is thinking made visible so the clearer your typing the clearer your mind becomes",
  "a fast typist is not born but built one keystroke at a time through deliberate repetition",
  "focus on accuracy first speed will follow naturally as your muscle memory grows stronger",
  "the keyboard is an instrument and like any instrument it rewards those who practice it",
  "learning a new skill feels slow until suddenly it feels fast trust the process and keep going",
  "every expert was once a beginner who decided to keep showing up even when it was hard",
];

export function getRandomSample(): string {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

export function getLongSample(): string {
  const shuffled = [...paragraphs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).join(" ");
}
