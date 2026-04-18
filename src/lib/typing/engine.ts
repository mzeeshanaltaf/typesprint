export type CharState = "pending" | "correct" | "wrong";

export function computeCharStates(sample: string, typed: string): CharState[] {
  const states: CharState[] = new Array(sample.length);
  for (let i = 0; i < sample.length; i++) {
    const t = typed[i];
    if (t === undefined) states[i] = "pending";
    else if (t === sample[i]) states[i] = "correct";
    else states[i] = "wrong";
  }
  return states;
}

export function countCorrect(sample: string, typed: string): number {
  let correct = 0;
  const n = Math.min(sample.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (typed[i] === sample[i]) correct++;
  }
  return correct;
}

export function countMistakes(sample: string, typed: string): number {
  let wrong = 0;
  const n = Math.min(sample.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (typed[i] !== sample[i]) wrong++;
  }
  return wrong;
}

export function computeWpm(correctChars: number, elapsedSec: number): number {
  if (elapsedSec <= 0) return 0;
  return Math.round((correctChars / 5) * (60 / elapsedSec));
}

export function computeAccuracy(
  correctChars: number,
  totalTyped: number,
): number {
  if (totalTyped <= 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}
