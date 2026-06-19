export async function fetchDiffbotProfile(url: string): Promise<string> {
  const token = process.env.DIFFBOT_API_KEY;
  if (!token) {
    throw new Error("DIFFBOT_API_KEY is not configured");
  }

  const endpoint = new URL("https://kg.diffbot.com/kg/v3/enhance");
  endpoint.searchParams.set("token", token);
  endpoint.searchParams.set("type", "Person");
  endpoint.searchParams.set("url", url);

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Diffbot Enhance request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  const entity = data?.data?.[0]?.entity ?? data?.entity ?? data;

  if (typeof entity === "string") {
    return entity;
  }

  return JSON.stringify(entity, null, 2);
}
