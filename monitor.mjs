const endpoints = {
  Health: "https://api.flop.network/health",
  Models: "https://api.flop.network/v1/models"
};

console.log("=== FLOP NETWORK MONITOR ===");
console.log("Community tool - @flop_labs");
console.log(new Date().toISOString());

for (const [name, url] of Object.entries(endpoints)) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000)
    });
    console.log("\n--- " + name + " ---");
    console.log("HTTP:", response.status);
    console.log(await response.text());
  } catch (error) {
    console.log(name + ": " + error.message);
  }
}
