export interface GeneratedItinerary {
  overview: string;
  dayPlans: Array<{
    day: number;
    title: string;
    activities: string[];
    cost: number;
    image?: string;
    imageQuery?: string;
  }>;
  weather: Array<{
    day: string;
    temp: number;
    condition: "Sunny" | "Clear" | "Cloudy" | "Rainy";
  }>;
  costBreakdown: Array<{
    label: string;
    amount: number;
  }>;
  places: Array<{
    name: string;
    rating: number;
    type: string;
    image?: string;
    imageQuery?: string;
  }>;
  tips: string[];
}

export interface GenerateTripParams {
  destination: string;
  days: number;
  budget: number;
  currency: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

/**
 * Fetch high-resolution landscape photo from Pexels API
 */
export async function fetchPexelsImage(query: string, fallbackKeywords = "travel destination"): Promise<string> {
  if (!PEXELS_API_KEY) {
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80&sig=${encodeURIComponent(query)}`;
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query || fallbackKeywords)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large || data.photos[0].src.medium || data.photos[0].src.original || "";
      }
    }
  } catch (err) {
    console.warn("Pexels fetch failed for:", query, err);
  }

  // Fallback to Unsplash URL if Pexels returns no results for rare query
  return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80&sig=${encodeURIComponent(query || fallbackKeywords)}`;
}

/**
 * Generate intelligent travel itinerary using Groq LLM & Pexels
 */
export async function generateItinerary(params: GenerateTripParams): Promise<GeneratedItinerary> {
  const { destination, days, budget, currency } = params;

  if (GROQ_API_KEY) {
    try {
      const systemPrompt = `You are an expert travel planner AI for SafarSathi AI. Generate a detailed, realistic travel itinerary. You MUST respond with ONLY valid JSON, strictly conforming to the requested schema.`;
      const userPrompt = `Create a complete travel itinerary for:
- Destination: ${destination}
- Duration: ${days} days
- Budget: ${currency} ${budget}

Return a JSON object with this EXACT structure:
{
  "overview": "2-3 sentence engaging trip overview",
  "dayPlans": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2", "activity 3"],
      "cost": 250,
      "imageQuery": "famous landmark or spot name in ${destination}"
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
    { "name": "Place name", "rating": 4.8, "type": "Landmark", "imageQuery": "Place name ${destination}" },
    { "name": "Place name", "rating": 4.7, "type": "Museum", "imageQuery": "Place name ${destination}" },
    { "name": "Place name", "rating": 4.9, "type": "District", "imageQuery": "Place name ${destination}" },
    { "name": "Place name", "rating": 4.6, "type": "Restaurant", "imageQuery": "Place name ${destination}" }
  ],
  "tips": ["Local tip 1", "Local tip 2", "Local tip 3"]
}

Make ${days} day plans total. Ensure cost breakdown totals approximately ${budget} ${currency}. For imageQuery fields, provide accurate landmark or attraction names.`;

      // Call Groq API with JSON mode
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const jsonRes = await response.json();
        const content = jsonRes.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);

          // Fetch real Pexels photos concurrently for day plans
          if (parsed.dayPlans && Array.isArray(parsed.dayPlans)) {
            parsed.dayPlans = await Promise.all(
              parsed.dayPlans.map(async (dayPlan: any) => {
                const img = await fetchPexelsImage(
                  dayPlan.imageQuery || `${destination} ${dayPlan.title}`,
                  `${destination} travel`
                );
                return { ...dayPlan, image: img };
              })
            );
          }

          // Fetch real Pexels photos concurrently for top places
          if (parsed.places && Array.isArray(parsed.places)) {
            parsed.places = await Promise.all(
              parsed.places.map(async (place: any) => {
                const img = await fetchPexelsImage(
                  place.imageQuery || `${place.name} ${destination}`,
                  `${destination} landmark`
                );
                return { ...place, image: img };
              })
            );
          }

          return parsed;
        }
      } else {
        const errBody = await response.text();
        console.warn("Groq API returned error status:", response.status, errBody);
      }
    } catch (e) {
      console.warn("Groq API execution error, falling back to smart engine:", e);
    }
  }

  // Fallback intelligent generator with Pexels images
  return buildIntelligentItinerary(destination, days, budget, currency);
}

async function buildIntelligentItinerary(
  destination: string,
  days: number,
  budget: number,
  currency: string
): Promise<GeneratedItinerary> {
  const accommodation = Math.round(budget * 0.30);
  const food = Math.round(budget * 0.20);
  const transport = Math.round(budget * 0.15);
  const activities = Math.round(budget * 0.20);
  const shopping = budget - (accommodation + food + transport + activities);

  const costBreakdown = [
    { label: "Accommodation", amount: accommodation },
    { label: "Food & Dining", amount: food },
    { label: "Transport", amount: transport },
    { label: "Activities", amount: activities },
    { label: "Shopping & Misc", amount: shopping },
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const conditions: Array<"Sunny" | "Clear" | "Cloudy" | "Rainy"> = ["Sunny", "Clear", "Cloudy", "Sunny", "Clear"];

  const weather = Array.from({ length: 5 }, (_, i) => ({
    day: daysOfWeek[i % daysOfWeek.length],
    temp: Math.floor(Math.random() * 8) + 20,
    condition: conditions[i % conditions.length],
  }));

  const perDayCost = Math.round(budget / days);

  const activityThemes = [
    { title: "Arrival & City Highlights", acts: ["Check-in & relax", "Explore central town square", "Authentic welcome dinner"] },
    { title: "Cultural Landmarks & Heritage", acts: ["Guided tour of primary historic sites", "Art gallery & museum walk", "Sunset panoramic lookout"] },
    { title: "Local Gastronomy & Hidden Gems", acts: ["Local market food tasting", "Scenic neighborhood bicycle tour", "Evening live cultural show"] },
    { title: "Adventure & Nature Excursion", acts: ["Day excursion to scenic viewpoints", "Outdoor hike or coastal walk", "Traditional artisan workshops"] },
    { title: "Leisure, Shopping & Farewell", acts: ["Souvenir & boutique shopping", "Café hopping & photography", "Farewell rooftop dinner"] }
  ];

  const rawPlaces = [
    { name: `${destination} Historic Center`, type: "Historic District", rating: 4.9 },
    { name: `${destination} Grand Observation Deck`, type: "Landmark & Viewpoint", rating: 4.8 },
    { name: `${destination} National Art & Culture Museum`, type: "Museum", rating: 4.7 },
    { name: `${destination} Gourmet Bazaar & Waterfront`, type: "Dining & Walkway", rating: 4.8 }
  ];

  // Fetch images from Pexels
  const places = await Promise.all(
    rawPlaces.map(async (p) => ({
      ...p,
      image: await fetchPexelsImage(`${p.name} ${destination}`, `${destination} city`)
    }))
  );

  const dayPlans = await Promise.all(
    Array.from({ length: days }, async (_, i) => {
      const theme = activityThemes[i % activityThemes.length];
      const image = await fetchPexelsImage(`${destination} ${theme.title}`, `${destination} travel`);
      return {
        day: i + 1,
        title: `${theme.title} in ${destination}`,
        activities: theme.acts.map((a) => `${a} in ${destination}`),
        cost: perDayCost,
        image,
        imageQuery: `${destination} day ${i + 1}`
      };
    })
  );

  return {
    overview: `Experience the finest of ${destination} with an optimized ${days}-day itinerary tailored for a ${currency} ${budget.toLocaleString()} budget. Discover iconic landmarks, authentic cuisines, and unforgettable travel memories.`,
    dayPlans,
    weather,
    costBreakdown,
    places,
    tips: [
      `Book popular ${destination} attractions online in advance to bypass queues.`,
      `Download offline maps and local transport apps for effortless navigation.`,
      `Carry both cards and modest cash for neighborhood markets and vendors.`,
      `Try local street food specialties recommended by neighborhood residents.`
    ]
  };
}
