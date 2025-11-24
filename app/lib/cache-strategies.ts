// lib/cache-strategies.ts
import { CacheService, CACHE_CONFIG } from "./redis";
import { AdvancedQueryOptimizer } from "./query-optimization";

/**
 * Cache strategies for different data types
 */
export class CacheStrategies {
  /**
   * Cache strategy for business lists with filters
   */
  static async getBusinessList(params: {
    page: number;
    limit: number;
    category?: string;
    verified?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const cacheKey = AdvancedQueryOptimizer.generateCacheKey(
      "businesses",
      params,
      { page: params.page, limit: params.limit }
    );

    // Try to get from cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return {
        data: cached,
        source: "cache" as const,
      };
    }

    return {
      source: "database" as const,
    };
  }

  /**
   * Cache strategy for individual business
   */
  static async getBusiness(id: string, includeDetails: boolean = false) {
    const cacheKey = `business:${id}${includeDetails ? ":detail" : ""}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return {
        data: cached,
        source: "cache" as const,
      };
    }

    return {
      source: "database" as const,
    };
  }

  /**
   * Cache strategy for search results
   */
  static async getSearchResults(params: {
    query: string;
    category?: string;
    location?: string;
    page: number;
    limit: number;
  }) {
    const cacheKey = `search:${Buffer.from(JSON.stringify(params)).toString("base64")}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return {
        data: cached,
        source: "cache" as const,
      };
    }

    return {
      source: "database" as const,
    };
  }

  /**
   * Set cache for business list
   */
  static async setBusinessList(
    params: any,
    data: any,
    ttl: number = CACHE_CONFIG.TTL.MEDIUM
  ) {
    const cacheKey = AdvancedQueryOptimizer.generateCacheKey(
      "businesses",
      params,
      { page: params.page, limit: params.limit }
    );

    await CacheService.set(cacheKey, data, ttl);
  }

  /**
   * Set cache for individual business
   */
  static async setBusiness(
    id: string,
    data: any,
    includeDetails: boolean = false,
    ttl: number = CACHE_CONFIG.TTL.LONG
  ) {
    const cacheKey = `business:${id}${includeDetails ? ":detail" : ""}`;
    await CacheService.set(cacheKey, data, ttl);
  }

  /**
   * Set cache for search results
   */
  static async setSearchResults(
    params: any,
    data: any,
    ttl: number = CACHE_CONFIG.TTL.SHORT
  ) {
    const cacheKey = `search:${Buffer.from(JSON.stringify(params)).toString("base64")}`;
    await CacheService.set(cacheKey, data, ttl);
  }

  /**
   * Invalidate cache when business data changes
   */
  static async invalidateBusiness(businessId: string) {
    const patterns = [
      `business:${businessId}`,
      `business:${businessId}:*`,
      "businesses:*", // Invalidate all business lists
      "search:*", // Invalidate all search results
    ];

    await Promise.all(
      patterns.map((pattern) => CacheService.delPattern(pattern))
    );
  }

  /**
   * Invalidate cache when user data changes
   */
  static async invalidateUser(userId: string) {
    const patterns = [
      `user:${userId}`,
      `user:${userId}:*`,
      "businesses:*", // User changes might affect business lists
    ];

    await Promise.all(
      patterns.map((pattern) => CacheService.delPattern(pattern))
    );
  }

  /**
   * Invalidate all cache (use carefully!)
   */
  static async invalidateAll() {
    await CacheService.delPattern("*");
  }
}
