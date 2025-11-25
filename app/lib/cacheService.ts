import { CacheService, CACHE_CONFIG } from './redis';

export class TrustNetCache {
  // Business-related cache methods
  static async getBusiness(businessId: string) {
    const key = `${CACHE_CONFIG.PREFIX.BUSINESS}${businessId}`;
    return CacheService.get(key);
  }

  static async setBusiness(businessId: string, businessData: any, ttl?: number) {
    const key = `${CACHE_CONFIG.PREFIX.BUSINESS}${businessId}`;
    return CacheService.set(key, businessData, ttl || CACHE_CONFIG.TTL.MEDIUM);
  }

  static async invalidateBusiness(businessId: string) {
    const key = `${CACHE_CONFIG.PREFIX.BUSINESS}${businessId}`;
    await CacheService.del(key);
  }

  // Trust score caching
  static async getTrustScore(businessId: string): Promise<number | null> {
    const key = `${CACHE_CONFIG.PREFIX.TRUST_SCORE}${businessId}`;
    return CacheService.get<number>(key);
  }

  static async setTrustScore(businessId: string, score: number) {
    const key = `${CACHE_CONFIG.PREFIX.TRUST_SCORE}${businessId}`;
    return CacheService.set(key, score, CACHE_CONFIG.TTL.SHORT);
  }

  static async getCacheStats() {
    return CacheService.getStats();
  }
}

export default TrustNetCache;
