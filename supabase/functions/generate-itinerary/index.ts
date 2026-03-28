import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, days, budget, currency } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_API_KEY) throw new Error("PEXELS_API_KEY is not configured");

    const systemPrompt = `You are an expert travel planner AI. Generate a detailed, realistic travel itinerary. Always respond with valid JSON only, no markdown, no extra text.`;

    const userPrompt = `Create a complete travel itinerary for:
- Destination: ${destination}
- Duration: ${days} days
- Budget: ${currency} ${budget}

Return a JSON object with this EXACT structure:
{
  "overview": "2-3 sentence trip overview",
  "dayPlans": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2", "activity 3"],
      "cost": 250,
      "imageQuery": "specific landmark or activity for this day"
    }
  ],
  "weather": [
    { "day": "Mon", "temp": 22, "condition": "Sunny" },
    { "day": "Tue", "temp": 19, "condition": "Cloudy" },
    { "day": "Wed", "temp": 24, "condition": "Clear" },
    { "day": "Thu", "temp": 16, "condition": "Rainy" },
    { "day": "Fri", "temp": 21, "condition": "Sunny" }
  ],
  "costBreakdown": [
    { "label": "Accommodation", "amount": 600 },
    { "label": "Food & Dining", "amount": 400 },
    { "label": "Transport", "amount": 250 },
    { "label": "Activities", "amount": 350 },
    { "label": "Shopping & Misc", "amount": 400 }
  ],
  "places": [
    { "name": "Place name", "rating": 4.8, "type": "Landmark", "imageQuery": "specific place name for image search" },
    { "name": "Place name", "rating": 4.7, "type": "Museum", "imageQuery": "specific place name for image search" },
    { "name": "Place name", "rating": 4.9, "type": "District", "imageQuery": "specific place name for image search" },
    { "name": "Place name", "rating": 4.6, "type": "Restaurant", "imageQuery": "specific place name for image search" }
  ],
  "tips": ["Local tip 1", "Local tip 2", "Local tip 3"]
}

Make ${days} day plans total. Ensure cost breakdown totals approximately ${budget} ${currency}. Make all content specific and realistic for ${destination}. For imageQuery fields, use the actual famous landmark, attraction, or place name that would return good images (e.g., "Eiffel Tower Paris", "Shibuya Crossing Tokyo").`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content from AI");

    // Clean and parse JSON
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const itinerary = JSON.parse(cleaned);

    // Fetch image from Pexels API
    const fetchPexelsImage = async (query: string): Promise<string> => {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
          { headers: { Authorization: PEXELS_API_KEY } }
        );
        if (!res.ok) return "";
        const data = await res.json();
        return data.photos?.[0]?.src?.large || data.photos?.[0]?.src?.medium || "";
      } catch {
        return "";
      }
    };

    // Add images to dayPlans
    if (itinerary.dayPlans) {
      itinerary.dayPlans = await Promise.all(
        itinerary.dayPlans.map(async (day: any) => ({
          ...day,
          image: await fetchPexelsImage(day.imageQuery || `${destination} travel`),
        }))
      );
    }

    // Add images to places
    if (itinerary.places) {
      itinerary.places = await Promise.all(
        itinerary.places.map(async (place: any) => ({
          ...place,
          image: await fetchPexelsImage(place.imageQuery || `${place.name} ${destination}`),
        }))
      );
    }

    return new Response(JSON.stringify({ success: true, itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
