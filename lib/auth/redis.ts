import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (!redis) redis = new Redis(process.env.REDIS_URL);
  return redis;
}

export async function blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.set(`blacklist:${jti}`, "1", "EX", ttlSeconds);
}

export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;
  return (await r.get(`blacklist:${jti}`)) === "1";
}

export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const r = getRedis();
  if (!r) return { allowed: true, remaining: max };
  const k = `rl:${key}`;
  const count = await r.incr(k);
  if (count === 1) await r.expire(k, windowSeconds);
  return { allowed: count <= max, remaining: Math.max(0, max - count) };
}
