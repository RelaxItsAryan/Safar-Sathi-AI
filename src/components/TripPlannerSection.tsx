import { useState } from "react";
import {
  Plane, Calendar, DollarSign, MapPin, Loader2,
  Sun, Cloud, CloudRain, Thermometer, Star,
  Coffee, Utensils, Camera, Hotel, Car, ChevronRight
} from "lucide-react";

const currencies = ["USD", "EUR", "GBP", "INR", "AED", "JPY"];

const MOCK_ITINERARY = {
  destination: "Paris, France",
  days: 5,
  budget: 2000,
  currency: "USD",
  overview: "A perfect blend of culture, cuisine, and iconic landmarks across 5 enchanting days in the City of Light.",
  dayPlans: [
    {
      day: 1,
      title: "Arrival & Eiffel Tower",
      activities: ["Check in to Le Marais Hotel", "Evening walk to Eiffel Tower", "Dinner at Café de Flore"],
      cost: 380,
    },
    {
      day: 2,
      title: "Louvre & Seine River",
      activities: ["Louvre Museum morning tour", "Lunch at Angelina", "Seine River cruise at dusk"],
      cost: 320,
    },
    {
      day: 3,
      title: "Montmartre & Art",
      activities: ["Sacré-Cœur Basilica", "Artist quarter stroll", "Moulin Rouge evening show"],
      cost: 420,
    },
    {
      day: 4,
      title: "Versailles Day Trip",
      activities: ["Palace of Versailles tour", "Gardens picnic lunch", "Evening shopping on Champs-Élysées"],
      cost: 290,
    },
    {
      day: 5,
      title: "Food & Farewell",
      activities: ["French pastry class", "Local market visit", "Departure"],
      cost: 230,
    },
  ],
  weather: [
    { day: "Mon", icon: Sun, temp: 22, condition: "Sunny" },
    { day: "Tue", icon: Cloud, temp: 19, condition: "Cloudy" },
    { day: "Wed", icon: Sun, temp: 24, condition: "Clear" },
    { day: "Thu", icon: CloudRain, temp: 16, condition: "Rainy" },
    { day: "Fri", icon: Sun, temp: 21, condition: "Sunny" },
  ],
  costBreakdown: [
    { label: "Accommodation", amount: 600, icon: Hotel, color: "from-primary to-secondary" },
    { label: "Food & Dining", amount: 400, icon: Utensils, color: "from-teal to-primary" },
    { label: "Transport", amount: 250, icon: Car, color: "from-secondary to-teal" },
    { label: "Activities", amount: 350, icon: Camera, color: "from-primary to-teal" },
    { label: "Shopping & Misc", amount: 400, icon: Coffee, color: "from-secondary to-primary" },
  ],
  places: [
    { name: "Eiffel Tower", rating: 4.8, type: "Landmark" },
    { name: "Louvre Museum", rating: 4.9, type: "Museum" },
    { name: "Montmartre", rating: 4.7, type: "District" },
    { name: "Notre-Dame Cathedral", rating: 4.8, type: "Church" },
  ],
};

const TripPlannerSection = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof MOCK_ITINERARY | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingText, setLoadingText] = useState("Analyzing your preferences...");

  const LOADING_MSGS = [
    "Analyzing your preferences...",
    "Searching top destinations...",
    "Generating day-by-day plan...",
    "Fetching weather forecast...",
    "Calculating smart budget...",
    "Finalizing your dream trip ✨",
  ];

  const handleGenerate = () => {
    if (!city.trim()) return;
    setLoading(true);
    setResult(null);
    let i = 0;
    setLoadingText(LOADING_MSGS[0]);
    const interval = setInterval(() => {
      i++;
      if (i < LOADING_MSGS.length) {
        setLoadingText(LOADING_MSGS[i]);
      } else {
        clearInterval(interval);
        setLoading(false);
        setResult({ ...MOCK_ITINERARY, destination: city, days, budget, currency });
        setActiveTab("overview");
      }
    }, 800);
  };

  const tabs = ["overview", "itinerary", "weather", "budget", "places"];

  return (
    <section id="planner" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-secondary/5 blur-3xl rounded-full dark:bg-secondary/8" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-teal/5 blur-3xl rounded-full dark:bg-teal/8" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-5">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Trip Planner</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
            Plan Your Dream Trip
            <br />
            <span className="gradient-text">Instantly with AI</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fill in the details below and let our AI build your personalized itinerary in seconds.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 md:p-8 shadow-elevated mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* City */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Destination City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Paris, Tokyo, Bali, Dubai..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal" /> Duration: {days} days
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 day</span><span>30 days</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-secondary" /> Budget: {currency} {budget.toLocaleString()}
              </label>
              <input
                type="range"
                min={100}
                max={20000}
                step={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-secondary h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100</span><span>20,000</span>
              </div>
            </div>

            {/* Currency */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">Currency</label>
              <div className="flex flex-wrap gap-2">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      currency === c
                        ? "bg-gradient-primary text-white shadow-glow-blue"
                        : "glass-card border border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !city.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-lg shadow-glow-blue hover:opacity-90 hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                <Plane className="w-5 h-5" />
                Generate My Trip
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="max-w-4xl mx-auto animate-scale-in">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-primary text-white shadow-glow-blue"
                      : "glass-card border border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">{result.destination}</h3>
                    <p className="text-muted-foreground">{result.days} days • {result.currency} {result.budget.toLocaleString()} budget</p>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed mb-6 text-base">{result.overview}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Days", value: result.days },
                    { label: "Budget", value: `${result.currency} ${result.budget.toLocaleString()}` },
                    { label: "Places", value: result.places.length },
                    { label: "Activities", value: result.dayPlans.reduce((a, d) => a + d.activities.length, 0) },
                  ].map((s, i) => (
                    <div key={i} className="glass-card rounded-2xl p-4 text-center">
                      <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === "itinerary" && (
              <div className="space-y-4">
                {result.dayPlans.map((plan) => (
                  <div key={plan.day} className="glass-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 text-white font-bold text-sm">
                        {plan.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-display font-bold text-foreground">{plan.title}</h4>
                          <span className="text-sm font-semibold text-primary">{result.currency} {plan.cost}</span>
                        </div>
                        <div className="space-y-2">
                          {plan.activities.map((act, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                              {act}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Weather Tab */}
            {activeTab === "weather" && (
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-primary" /> 5-Day Forecast for {result.destination}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {result.weather.map((w, i) => (
                    <div key={i} className="glass-card rounded-2xl p-4 text-center hover:border-primary/30 transition-colors">
                      <div className="text-sm font-semibold text-muted-foreground mb-3">{w.day}</div>
                      <w.icon className={`w-8 h-8 mx-auto mb-3 ${
                        w.condition === "Sunny" || w.condition === "Clear" ? "text-yellow-400" :
                        w.condition === "Rainy" ? "text-blue-400" : "text-gray-400"
                      }`} />
                      <div className="font-display text-2xl font-bold gradient-text">{w.temp}°</div>
                      <div className="text-xs text-muted-foreground mt-1">{w.condition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === "budget" && (
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                <h3 className="font-display text-xl font-bold mb-6 text-foreground">Cost Breakdown</h3>
                <div className="space-y-4">
                  {result.costBreakdown.map((item, i) => {
                    const pct = Math.round((item.amount / result.budget) * 100);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                              <item.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{pct}%</span>
                            <span className="text-sm font-semibold text-foreground">{result.currency} {item.amount}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Estimated</span>
                    <span className="font-display text-xl font-bold gradient-text">
                      {result.currency} {result.costBreakdown.reduce((a, i) => a + i.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Places Tab */}
            {activeTab === "places" && (
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                <h3 className="font-display text-xl font-bold mb-6 text-foreground">Top Places to Visit</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.places.map((place, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-colors hover:shadow-elevated group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{place.rating}</span>
                        </div>
                      </div>
                      <h4 className="font-display font-bold text-foreground mb-1">{place.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{place.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download button */}
            <div className="mt-6 flex justify-center">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card border border-border hover:border-primary/40 text-foreground font-semibold transition-all duration-200 hover:glow-blue">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF Itinerary
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TripPlannerSection;
