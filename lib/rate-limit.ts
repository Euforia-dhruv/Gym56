type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

/**
 * In-memory rate limiter keyed by IP address.
 * Returns `{ allowed, retryAfter }` where `retryAfter` is seconds until reset.
 */
export function checkRateLimit(
  ip: string,
  limit: number = 50,
  windowMs: number = 60_000,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

/** Extract client IP from a Request object. */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Build a 429 JSON Response with Retry-After header.
 */
export function rateLimitResponse(
  retryAfter: number,
): Response {
  return new Response(
    JSON.stringify({
      error: "rate_limited",
      message: `Too many requests. Try again in ${retryAfter} seconds.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
      },
    },
  );
}

/**
 * Periodically evict expired entries so the map doesn't grow unbounded.
 * Runs every 5 minutes by default.
 */
export function startRateLimitCleanup(intervalMs: number = 300_000): void {
  if (typeof setInterval === "undefined") return;
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, intervalMs).unref?.();
}