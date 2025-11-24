// scripts/test-redis.js
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load environment variables
import "dotenv/config";

async function testRedis() {
  console.log("🧪 Testing Redis Configuration\n");
  console.log("📁 Current directory:", __dirname);
  console.log("🔍 Looking for redis.ts in: ./app/lib/redis.ts\n");

  try {
    // Import your redis configuration with correct path
    const { CacheService, redis } = await import("../app/lib/redis.js");

    // Detect environment
    const redisUrl = process.env.REDIS_URL;
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Redis URL: ${redisUrl ? "Configured" : "Not configured"}`);

    if (redisUrl) {
      if (redisUrl.includes("upstash")) {
        console.log("   Using: Upstash Redis (Cloud)");
      } else if (
        redisUrl.includes("localhost") ||
        redisUrl.includes("127.0.0.1")
      ) {
        console.log("   Using: Local Redis");
      } else {
        console.log("   Using: Cloud Redis");
      }
    } else {
      console.log("   Using: Mock Redis (caching disabled)");
    }

    // Test basic functionality
    console.log("\n1. Testing cache operations...");
    const start = Date.now();

    await CacheService.set("trustnet:test", {
      message: "Redis is working with TrustNet!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });

    const result = await CacheService.get("trustnet:test");
    const duration = Date.now() - start;

    console.log(`✅ Cache operations: ${duration}ms`);
    if (result) {
      console.log(`   Data: ${result.message}`);
      console.log(`   Environment: ${result.environment}`);
    } else {
      console.log(`   ❌ No data retrieved`);
    }

    // Test stats
    console.log("\n2. Testing statistics...");
    const stats = await CacheService.getStats();
    console.log(`✅ Redis keys: ${stats.keys}`);
    console.log(`✅ Memory: ${JSON.stringify(stats.memory, null, 2)}`);

    // Test pattern deletion
    console.log("\n3. Testing pattern deletion...");
    await CacheService.set("trustnet:test:pattern1", "value1");
    await CacheService.set("trustnet:test:pattern2", "value2");

    const beforeDelete = await CacheService.exists("trustnet:test:pattern1");
    console.log(`   Before delete: ${beforeDelete ? "Exists" : "Missing"}`);

    await CacheService.delPattern("trustnet:test:*");

    const afterDelete = await CacheService.exists("trustnet:test:pattern1");
    console.log(`   After delete: ${afterDelete ? "Exists" : "Missing"}`);

    // Cleanup
    await CacheService.del("trustnet:test");

    console.log("\n🎉 Redis test completed successfully!");
    console.log("🚀 Ready to integrate with TrustNet!");
  } catch (error) {
    console.log(`\n❌ Test failed: ${error.message}`);
    console.log("📋 Error details:", error.stack);

    if (error.code === "MODULE_NOT_FOUND") {
      console.log("\n💡 Module path issues detected.");
      console.log("   Expected: ../app/lib/redis.js");
      console.log("   Make sure your redis.ts file exists and is compiled");
    }
  }
}

// Run the test
testRedis().catch(console.error);
