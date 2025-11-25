// scripts/test-universal-redis.js
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

// Convert to ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load environment variables first
import "dotenv/config";

// Dynamic import for ES6 module
async function testUniversalRedis() {
  console.log("🧪 Testing Universal Redis Configuration\n");

  // Dynamically import the ES6 module
  const { CacheService, redis } = await import("../app/lib/redis.ts");

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

  try {
    await CacheService.set("universal:test", {
      message: "This works everywhere!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });

    const result = await CacheService.get("universal:test");
    const duration = Date.now() - start;

    console.log(`✅ Cache operations: ${duration}ms`);
    console.log(`   Data: ${result.message}`);
    console.log(`   Environment: ${result.environment}`);

    // Test stats
    console.log("\n2. Testing statistics...");
    const stats = await CacheService.getStats();
    console.log(`✅ Redis keys: ${stats.keys}`);
    console.log(`✅ Memory: ${stats.memory.used_memory_human || "N/A"}`);

    // Cleanup
    await CacheService.del("universal:test");

    console.log("\n🎉 Universal Redis test completed!");
    console.log("🚀 This same code will work in development AND production!");
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    console.log(
      "💡 Make sure your Redis server is running if using local Redis"
    );
  }
}

// Run the test
testUniversalRedis().catch(console.error);
