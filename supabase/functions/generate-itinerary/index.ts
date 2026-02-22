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

    const SAFARSAARTHI_API_KEY = Deno.env.get("SAFARSAARTHI_API_KEY");
    if (!SAFARSAARTHI_API_KEY) throw new Error("SAFARSAARTHI_API_KEY is not configured");

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
      "cost": 250
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
    { "name": "Place name", "rating": 4.8, "type": "Landmark" },
    { "name": "Place name", "rating": 4.7, "type": "Museum" },
    { "name": "Place name", "rating": 4.9, "type": "District" },
    { "name": "Place name", "rating": 4.6, "type": "Restaurant" }
  ],
  "tips": ["Local tip 1", "Local tip 2", "Local tip 3"]
}

Make ${days} day plans total. Ensure cost breakdown totals approximately ${budget} ${currency}. Make all content specific and realistic for ${destination}.`;

    const response = await fetch("https://ai.gateway.safarsaarthi.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SAFARSAARTHI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content from AI");

    // Clean and parse JSON
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const itinerary = JSON.parse(cleaned);

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
