// Dad Joke Showdown — one dad joke, written to /output/entry.txt.
//
// The joke: a calendar breakup. The setup is a relationship complaint and
// the punchline turns on "dates" — calendar dates vs. romantic dates —
// which is the classic dad-joke move: a straight face, a double meaning,
// and a groan at the end. Plain ASCII, one sentence, well under the limit.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const JOKE =
  "My calendar and I broke up because it kept bringing up old dates.";

const MAX_LEN = 200;
const OUT_FILE = "/output/entry.txt";

// The house gate: UTF-8 text, 1-200 characters, a single line that reads
// as exactly one sentence. Anything outside that is a broken entry, so
// fail loudly here instead of shipping a bad file.
function checkJoke(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_LEN) {
    throw new Error(`joke must be 1-${MAX_LEN} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be blank");
  }
  if (text !== text.trim() || text.includes("  ")) {
    throw new Error("joke must not have stray or doubled spaces");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must fit on one line");
  }
  const stops = text.match(/[.!?]/g) ?? [];
  if (stops.length !== 1 || !text.endsWith(".")) {
    throw new Error("joke must be one sentence ending with a period");
  }
}

function main(): void {
  checkJoke(JOKE);

  mkdirSync("/output", { recursive: true });

  // Write exactly the joke — no trailing newline, so the file's character
  // count is the joke's character count and nothing else.
  writeFileSync(OUT_FILE, JOKE, "utf8");

  // Prove the file on disk is byte-for-byte the joke before claiming success.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== JOKE) {
    throw new Error("output file does not match the joke");
  }

  console.log(`Wrote ${[...JOKE].length} characters to ${OUT_FILE}`);
  console.log(JOKE);
}

main();
