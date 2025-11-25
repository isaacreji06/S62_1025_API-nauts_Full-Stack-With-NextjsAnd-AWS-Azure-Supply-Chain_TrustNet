// scripts/test-redis-caching.js
const tests = [
  {
    name: "First request - should hit database",
    url: "http://localhost:3000/api/businesses?page=1&limit=5",
  },
  {
    name: "Second request - should hit cache",
    url: "http://localhost:3000/api/businesses?page=1&limit=5",
  },
  {
    name: "Different query - new cache entry",
    url: "http://localhost:3000/api/businesses?category=FOOD_RESTAURANT&limit=3",
  },
  {
    name: "Search query - should cache",
    url: "http://localhost:3000/api/businesses?search=test&page=1",
  },
  {
    name: "Cache statistics",
    url: "http://localhost:3000/api/admin/cache",
  },
];

async function runTest(test, index) {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log("─".repeat(50));

  try {
    const startTime = Date.now();
    const response = await fetch(test.url);
    const data = await response.json();
    const responseTime = Date.now() - startTime;

    if (data.success) {
      console.log(`✅ SUCCESS`);

      if (data.data.performance) {
        console.log(`   Source: ${data.data.performance.source}`);
        console.log(`   Cached: ${data.data.performance.cached}`);
        console.log(`   Query Time: ${data.data.performance.queryTime}ms`);
        console.log(`   Total Response: ${responseTime}ms`);

        if (data.data.businesses) {
          console.log(`   Businesses: ${data.data.businesses.length}`);
        }
      }

      if (data.data.stats) {
        console.log(`   Redis Keys: ${data.data.stats.keys}`);
        console.log(
          `   Memory: ${data.data.stats.memory?.used_memory_human || "N/A"}`
        );
      }
    } else {
      console.log(`❌ FAILED: ${data.message}`);
      if (data.error) {
        console.log(`   Error: ${JSON.stringify(data.error)}`);
      }
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

async function runAllTests() {
  console.log("🧪 Testing Redis Caching with Upstash");
  console.log("=====================================\n");

  for (let i = 0; i < tests.length; i++) {
    await runTest(tests[i], i);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second between tests
  }

  console.log("\n🎉 All caching tests completed!");
}

runAllTests();
