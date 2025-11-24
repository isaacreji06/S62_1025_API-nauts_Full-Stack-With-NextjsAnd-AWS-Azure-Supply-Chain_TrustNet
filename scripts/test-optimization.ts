// scripts/test-optimizations.ts
import { prisma } from "@/lib/prisma";
import { QueryMonitor, AdvancedQueryOptimizer } from "@/lib/query-optimization";

async function testQueryOptimizations() {
  console.log("🧪 Starting Query Optimization Tests...\n");

  // Test 1: Basic query with monitoring
  console.log("1. Testing basic business query...");
  const trackQuery = QueryMonitor.startTracking("test_basic_query");

  const businesses = await prisma.business.findMany({
    take: 5,
    include: {
      owner: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
  });

  const duration = trackQuery();
  console.log(`   ✅ Found ${businesses.length} businesses in ${duration}ms\n`);

  // Test 2: Complex query analysis
  console.log("2. Testing query complexity analysis...");
  const complexQuery = {
    where: {
      OR: [
        { name: { contains: "test" } },
        { description: { contains: "test" } },
      ],
      trustScore: { gte: 50 },
    },
    include: {
      owner: true,
      reviews: true,
      endorsements: true,
    },
    skip: 0,
    take: 10,
  };

  const analysis = AdvancedQueryOptimizer.analyzeQueryComplexity(complexQuery);
  console.log(`   ✅ Query complexity: ${analysis.complexity}`);
  console.log(
    `   ✅ Warnings: ${analysis.warnings.length > 0 ? analysis.warnings.join(", ") : "None"}\n`
  );

  // Test 3: Cache key generation
  console.log("3. Testing cache key generation...");
  const filters = { category: "FOOD_RESTAURANT", isVerified: true };
  const cacheKey = AdvancedQueryOptimizer.generateCacheKey(
    "businesses",
    filters,
    { page: 1, limit: 10 }
  );
  console.log(`   ✅ Generated cache key: ${cacheKey}\n`);

  // Test 4: Performance stats
  console.log("4. Checking performance statistics...");
  const stats = QueryMonitor.getStats();
  console.log(`   ✅ Total tracked queries: ${stats.length}`);
  stats.forEach((stat) => {
    console.log(
      `      - ${stat.query}: ${stat.count} queries, avg ${stat.avgTime.toFixed(2)}ms`
    );
  });

  console.log("\n🎉 All optimization tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  testQueryOptimizations()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

export { testQueryOptimizations };
