type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const store: RateLimitStore = new Map();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
    const now = Date.now();
    const record = store.get(ip);

    if (!record) {
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (now > record.resetTime) {
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= limit) {
        return false;
    }

    record.count += 1;
    return true;
}
