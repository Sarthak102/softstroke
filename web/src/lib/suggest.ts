// "Did you mean": icons whose name or keywords are a few edits away from a query that matched nothing.
function distance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 3) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

export function suggest(q: string, names: string[], keywords: Record<string, string[]>, max = 4) {
  const t = q.trim().toLowerCase();
  if (t.length < 3) return [];
  const limit = t.length < 6 ? 1 : 2;
  const scored = names
    .map((n) => {
      const words = [n, ...n.split("-"), ...(keywords[n] ?? []).flatMap((k) => [k, ...k.split(" ")])];
      // A query that contains a whole name ("trashcan" -> trash) counts as a near miss.
      const inside = n.length >= 4 && t.includes(n) ? 0.5 : 99;
      return { n, d: Math.min(inside, ...words.map((w) => distance(t, w))) };
    })
    .filter((x) => x.d <= limit)
    .sort((a, b) => a.d - b.d || a.n.length - b.n.length);
  return scored.slice(0, max).map((x) => x.n);
}
