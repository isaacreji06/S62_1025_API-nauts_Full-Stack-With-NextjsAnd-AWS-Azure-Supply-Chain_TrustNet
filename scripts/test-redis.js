// scripts/test-redis.js
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { createRequire } from "module";
import { readFileSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load environment variables
import "dotenv/config";

console.log("Ì∑™ Starting Redis Test...");
console.log("Ì≥Å Current directory:", __dirname);
console.log("Ì¥ç Checking file structure...");

// Check if files exist
const redisPath = resolve(__dirname, "../app/lib/redis.js");
const redisTsPath = resolve(__dirname, "../app/lib/redis.ts");

console.log("Ì≥Ñ Looking for redis.js:", existsSync(redisPath) ? "‚úÖ EXISTS" : "‚ùå MISSING");
console.log("Ì≥Ñ Looking for redis.ts:", existsSync(redisTsPath) ? "‚úÖ EXISTS" : "‚ùå MISSING");

async function testRedis() {
  try {
    console.log("\n1. Attempting to import Redis module...");
    
    // Try to import the redis configuration
    const { CacheService, redis } = await import("../app/lib/redis.js");
    
    console.log("‚úÖ Redis module imported successfully");

    // Test basic functionality
    console.log("\n2. Testing cache operations...");
    const start = Date.now();

    const testData = {
      message: "Redis is working with TrustNet!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };

    // Set data
    const setResult = await CacheService.set("trustnet:test", testData);
    console.log("‚úÖ Set operation:", setResult ? "SUCCESS" : "FAILED");

    // Get data
    const result = await CacheService.get("trustnet:test");
    const duration = Date.now() - start;

    console.log(`‚è±Ô∏è  Cache operations took: ${duration}ms`);
    
    if (result) {
      console.log("Ì≥¶ Retrieved data:", result);
    } else {
      console.log("‚ùå No data retrieved from cache");
    }

    // Test statistics
    console.log("\n3. Testing cache statistics...");
    const stats = await CacheService.getStats();
    console.log("Ì≥ä Cache stats:", stats);

    // Cleanup
    console.log("\n4. Cleaning up...");
    await CacheService.del("trustnet:test");

    console.log("\nÌæâ Redis test completed successfully!");
    console.log("Ì∫Ä Redis is ready for TrustNet integration!");

  } catch (error) {
    console.log(`\n‚ùå Test failed: ${error.message}`);
    console.log("Ì≥ã Full error:", error.stack);
    
    if (error.code === "MODULE_NOT_FOUND") {
      console.log("\nÌ≤° Solutions:");
      console.log("   1. Run npm run build to compile TypeScript files");
      console.log("   2. Or run npm run dev to start development server");
      console.log("   3. Or install tsx: npm install -D tsx and run with npx tsx scripts/test-redis.js");
    }
  }
}

// Run the test
testRedis().catch(console.error);
