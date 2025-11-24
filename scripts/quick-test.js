// scripts/quick-test.js
const tests = [
  {
    name: "Basic listing",
    url: "http://localhost:3000/api/businesses?page=1&limit=5",
  },
  {
    name: "Category filter",
    url: "http://localhost:3000/api/businesses?category=FOOD_RESTAURANT",
  },
  {
    name: "Text search",
    url: "http://localhost:3000/api/businesses?search=test",
  },
  {
    name: "Verified businesses",
    url: "http://localhost:3000/api/businesses?verified=true",
  },
  {
    name: "Performance stats",
    url: "http://localhost:3000/api/admin/performance",
  },
];

async function runTest(test) {
  try {
    const response = await fetch(test.url);
    const data = await response.json();

    if (data.success) {
      console.log(`✅ ${test.name}: SUCCESS`);
      if (data.data.businesses) {
        console.log(`   Found ${data.data.businesses.length} businesses`);
      }
      if (data.data.performance) {
        console.log(`   Query time: ${data.data.performance.queryTime}ms`);
      }
    } else {
      console.log(`❌ ${test.name}: FAILED - ${data.message}`);
    }
  } catch (error) {
    console.log(`❌ ${test.name}: ERROR - ${error.message}`);
  }
}

async function runAllTests() {
  console.log("🧪 Running API Tests...\n");

  for (const test of tests) {
    await runTest(test);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay between tests
  }

  console.log("\n🎉 All tests completed!");
}

runAllTests();
