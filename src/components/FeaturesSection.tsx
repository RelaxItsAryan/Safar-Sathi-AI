import { Brain, Cloud, MapPin, Wallet, Download, Clock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Itinerary Generation",
    desc: "Day-by-day smart plans powered by OpenAI, customized to your style, budget, and duration.",
    gradient: "from-primary to-secondary",
    glow: "glow-blue",
  },
  {
    icon: MapPin,
    title: "Top Places Discovery",
    desc: "Google Places integration surfaces the best restaurants, hotels, and attractions near you.",
    gradient: "from-teal to-primary",
    glow: "glow-blue",
  },
  {
    icon: Cloud,
    title: "Real-Time Weather",
    desc: "Current conditions + 5-day forecast with elegant visual cards for every destination.",
    gradient: "from-secondary to-teal",
    glow: "glow-purple",
  },
  {
    icon: Wallet,
    title: "Smart Cost Breakdown",
    desc: "Detailed budget analysis: flights, hotels, food, activities — all in your currency.",
    gradient: "from-primary to-teal",
    glow: "glow-blue",
  },
  {
    icon: Download,
    title: "PDF Export",
    desc: "Download your full itinerary as a beautifully formatted PDF — ready to share or print.",
    gradient: "from-secondary to-primary",
    glow: "glow-purple",
  },
  {
    icon: Clock,
    title: "Instant Results",
    desc: "Get a complete travel plan in under 10 seconds. No waiting, no hassle, just go.",
    gradient: "from-teal to-secondary",
    glow: "glow-blue",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full dark:bg-primary/8" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Why SafarSathi</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
            Everything You Need to
            <br />
            <span className="gradient-text">Travel Smarter</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group relative glass-card rounded-3xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feat.gradient} opacity-10`} />
                <div className={`absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-br ${feat.gradient} [mask:linear-gradient(white,white)_content-box,linear-gradient(white,white)] [-webkit-mask-composite:xor] [mask-composite:exclude]`} style={{ padding: "1px" }} />
              </div>

              {/* Icon */}
              <div className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} items-center justify-center mb-5 ${feat.glow} transition-all duration-300`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-display text-lg font-bold mb-3 text-foreground">{feat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>

              {/* Arrow on hover */}
              <div className="mt-5 flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
