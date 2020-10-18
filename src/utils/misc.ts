export function noop(): void {
  // This function should act like a placeholder,
  // so we don't need an implementation.
}

/**
 * Pause code execution for given number of milliseconds.
 */
export function sleep(timeoutMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeoutMs));
}
