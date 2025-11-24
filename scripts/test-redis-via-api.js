// scripts/test-redis-via-api.js
const http = require("http");

async function testViaAPI() {
  console.log("🧪 Testing Redis via API Endpoints\n");

  // Test 1: First request (should be from database)
  console.log("1. Testing first request (should cache)...");
  await makeRequest("http://localhost:3000/api/businesses?page=1&limit=3");

  // Wait a moment for cache to be set
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 2: Same request (should be from cache)
  console.log("\n2. Testing second request (should be cached)...");
  await makeRequest("http://localhost:3000/api/businesses?page=1&limit=3");

  // Test 3: Check cache stats
  console.log("\n3. Checking cache statistics...");
  await makeRequest("http://localhost:3000/api/admin/cache");

  console.log("\n🎉 API-based Redis test completed!");
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    http
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const duration = Date.now() - start;
          try {
            const result = JSON.parse(data);

            if (result.success) {
              console.log(`✅ ${url}`);
              console.log(`   Status: ${response.statusCode}`);
              console.log(`   Time: ${duration}ms`);

              if (result.data.performance) {
                console.log(`   Source: ${result.data.performance.source}`);
                console.log(`   Cached: ${result.data.performance.cached}`);
              }

              if (result.data.stats) {
                console.log(`   Redis Keys: ${result.data.stats.keys}`);
              }
            } else {
              console.log(`❌ ${url}`);
              console.log(`   Error: ${result.message}`);
            }
          } catch (e) {
            console.log(`❌ ${url} - Invalid JSON response`);
          }
          resolve();
        });
      })
      .on("error", (error) => {
        console.log(`❌ ${url} - Connection failed: ${error.message}`);
        console.log("💡 Make sure your Next.js dev server is running!");
        resolve();
      });
  });
}

// Make sure your Next.js server is running first!
console.log("⚠️  Make sure your Next.js dev server is running on port 3000");
console.log("   Run: npm run dev\n");

testViaAPI();
