import { writeAllSync } from "https://deno.land/std@0.177.0/streams/write_all.ts";

export function initTerm(): void {
  Deno.stdin.setRaw(true);

  write("\u001b[?25l");
}

export function cleanupTerm(): void {
  Deno.stdin.setRaw(false);

  write("\u001b[?25h");
}

export function write(text: string): void {
  const out = new TextEncoder().encode(text);
  
  writeAllSync(Deno.stdout, out);
}

function writeWithPosition(text: string, x: number, y: number): void {
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

export function clearBrackets(x: number, y: number): void {
  writeWithPosition(" ", x * 2 + 1, y + 1);
  writeWithPosition(" ", x * 2 + 3, y + 1);
}
