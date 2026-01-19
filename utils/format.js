export function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (n < 1) return n.toFixed(4);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}
