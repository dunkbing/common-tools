import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displayEditorPlaceholders(on: boolean) {
  const placeholder = document.querySelector(
    '.monaco-placeholder'
  ) as HTMLElement | null;
  placeholder!.style.display = on ? 'block' : 'none';
}
