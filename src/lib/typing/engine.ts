export type CharState = "pending" | "correct" | "wrong";

// Normalize typographically-fancy quotes to their plain keyboard equivalents so
// that AI-generated content (which uses curly quotes) matches what users type.
function norm(ch: string): string {
  if (ch === "\u2018" || ch === "\u2019" || ch === "\u201A" || ch === "\u201B")
    return "'";
  if (ch === "\u201C" || ch === "\u201D" || ch === "\u201E" || ch === "\u201F")
    return '"';
  return ch;
}

export function computeCharStates(sample: string, typed: string): CharState[] {
  const states: CharState[] = new Array(sample.length);
  for (let i = 0; i < sample.length; i++) {
    const t = typed[i];
    if (t === undefined) states[i] = "pending";
    else if (norm(t) === norm(sample[i])) states[i] = "correct";
    else states[i] = "wrong";
  }
  return states;
}

export function countCorrect(sample: string, typed: string): number {
  let correct = 0;
  const n = Math.min(sample.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (norm(typed[i]) === norm(sample[i])) correct++;
  }
  return correct;
}

export function countMistakes(sample: string, typed: string): number {
  let wrong = 0;
  const n = Math.min(sample.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (norm(typed[i]) !== norm(sample[i])) wrong++;
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
