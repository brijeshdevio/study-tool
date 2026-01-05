// Test your deployed API
// Replace 'YOUR_VERCEL_URL' with your actual Vercel deployment URL

const VERCEL_URL = "https://your-app-name.vercel.app";

async function testAPI() {
  try {
    // Test root endpoint
    console.log("Testing root endpoint...");
    const rootResponse = await fetch(VERCEL_URL);
    const rootData = await rootResponse.json();
    console.log("Root endpoint response:", rootData);

    // Test proxy endpoint
    console.log("\nTesting proxy endpoint...");
    const proxyResponse = await fetch(`${VERCEL_URL}/api/proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/posts/1",
      }),
    });
    const proxyData = await proxyResponse.json();
    console.log("Proxy endpoint response:", proxyData);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Uncomment to run (and update the URL first!)
testAPI();
