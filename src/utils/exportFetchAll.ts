/**
 * Utility to fetch all pages of records up to `total` while respecting the backend's max limit per query.
 *
 * @param fetchPage Function that accepts offset and limit, returning { items, total }
 * @param total Total number of records matching the current filter
 * @param maxLimit Maximum records allowed per query by the backend endpoint (e.g. 100, 500, 1000)
 * @param concurrency Maximum concurrent requests (default: 4)
 * @param onProgress Optional callback for progress reporting (loadedCount, totalCount)
 */
export async function fetchAllPages<T>(
  fetchPage: (offset: number, limit: number) => Promise<{ items: T[]; total?: number }>,
  total: number,
  maxLimit: number = 100,
  concurrency: number = 4,
  onProgress?: (loaded: number, total: number) => void
): Promise<T[]> {
  if (total <= 0) return [];

  // Single request if total is within maxLimit
  if (total <= maxLimit) {
    const res = await fetchPage(0, total);
    if (onProgress) onProgress(res.items.length, total);
    return res.items;
  }

  // Create list of offsets
  const offsets: number[] = [];
  for (let offset = 0; offset < total; offset += maxLimit) {
    offsets.push(offset);
  }

  const results: T[][] = new Array(offsets.length);
  let loadedCount = 0;

  // Process in concurrent batches
  for (let i = 0; i < offsets.length; i += concurrency) {
    const batch = offsets.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (offset, indexInBatch) => {
        const pageIndex = i + indexInBatch;
        const limit = Math.min(maxLimit, total - offset);
        const res = await fetchPage(offset, limit);
        results[pageIndex] = res.items || [];
        loadedCount += (res.items || []).length;
        if (onProgress) onProgress(loadedCount, total);
      })
    );
  }

  return results.flat();
}

/**
 * Cleanly format a list of filter tags into a safe, human-readable file name slug.
 */
export function buildExportFileName(
  baseName: string,
  filterTags: (string | undefined | null)[],
  extension: string
): string {
  const parts = [baseName, ...filterTags.filter(Boolean)]
    .map((tag) =>
      String(tag)
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
    )
    .filter((p) => p.length > 0);

  const slug = parts.join("_");
  const dateStr = new Date().toISOString().slice(0, 10);
  return `${slug}_${dateStr}.${extension.replace(/^\./, "")}`;
}
