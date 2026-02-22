import { Check, Zap, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for casual travelers exploring AI planning.",
    features: [
      "3 trip generations/month",
      "5-day itineraries max",
      "Basic weather forecast",
      "Cost overview",
      "Standard support",
    ],
    cta: "Start Free",
    gradient: "from-muted to-muted",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For frequent travelers who want unlimited power.",
    features: [
      "Unlimited trip generations",
      "Up to 30-day itineraries",
      "Real-time weather + maps",
      "Detailed cost breakdown",
      "PDF export",
      "Saved trips & history",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    gradient: "from-primary to-secondary",
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    desc: "For travel agencies and team collaboration.",
    features: [
      "Everything in Pro",
      "Team workspace",
      "White-label exports",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    gradient: "from-teal to-primary",
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 blur-3xl rounded-full dark:bg-primary/8" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/10 border border-teal/20 mb-5">
            <Zap className="w-3 h-3 text-teal" />
            <span className="text-xs font-semibold text-teal uppercase tracking-widest">Pricing</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing for All</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free and scale as you travel more. No hidden fees.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "shadow-glow-blue"
                  : "shadow-card hover:shadow-elevated"
              } glass-card`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-primary text-white text-xs font-bold shadow-glow-blue flex items-center gap-1 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current" /> Most Popular
                </div>
              )}

              {/* Gradient top accent */}
              <div className={`h-1 rounded-full bg-gradient-to-r ${plan.gradient} mb-6`} />

              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`font-display text-5xl font-bold ${plan.highlight ? "gradient-text" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-gradient-primary text-white shadow-glow-blue hover:opacity-90 hover:scale-[1.02]"
                    : "glass-card border border-border text-foreground hover:border-primary/40 hover:glow-blue"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
