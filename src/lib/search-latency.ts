// Later an AI judges every search and needs 1 to 3 seconds for it. The prototype decides by fixed rules at
// once and only imitates the wait. The same search always waits equally long, so test sessions compare.
export function latencyFor(key: string): number {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 1000 + (hash % 2001);
}

// The steps on the start page have already waited for this search: the results page must not wait again.
let evaluated: string | null = null;

export function markEvaluated(query: string) {
  evaluated = query;
}

export function wasEvaluated(query: string): boolean {
  return evaluated === query;
}
