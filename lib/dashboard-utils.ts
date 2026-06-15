export function sliderLabel(value: number, labels: string[]): string {
  const index = Math.min(Math.floor(value / 25), labels.length - 1);
  return labels[index];
}

export function initialsFromName(name: string, fallback: string): string {
  const trimmed = name.trim();
  if (!trimmed) return fallback;

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
