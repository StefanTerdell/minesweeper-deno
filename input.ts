import { writeAllSync } from "https://deno.land/std@0.177.0/streams/write_all.ts";

export function initTerm(): void {
  Deno.stdin.setRaw(true);

  // Hide cursor
  write("\u001b[?25l");
}

export function cleanupTerm(): void {
  Deno.stdin.setRaw(false);

  console.clear();

  // Show cursor
  write("\u001b[?25h");
}

export function write(text: string): void {
  const out = new TextEncoder().encode(text);

  writeAllSync(Deno.stdout, out);
}

function writeWithPosition(text: string, x: number, y: number): void {
  // Uses ANSI escape codes to set position before printing text
  write(`\u001b[${y};${x}H${text}`);
}

export function readKeypress(): string {
  const buffer = new Uint8Array(1);

  Deno.stdin.readSync(buffer);

  return new TextDecoder().decode(buffer);
}

export function printBrackets(x: number, y: number): void {
  writeWithPosition("[", x * 2 + 1, y + 1);
  writeWithPosition("]", x * 2 + 3, y + 1);
}

function moveCursorHorizontally(positions: number): void {
  if (positions > 0) {
    //  move right N positions
    write(`\u001b[${positions}C`);
  } else {
    //  move left N positions
    write(`\u001b[${positions * -1}D`);
  }
}

export function clearBrackets(): void {
  moveCursorHorizontally(-3);
  write(" ");
  moveCursorHorizontally(1);
  write(" ");
}
