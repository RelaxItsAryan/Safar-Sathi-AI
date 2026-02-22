import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aria Chen",
    role: "Solo Traveler",
    location: "Singapore",
    rating: 5,
    text: "SafarSathi AI planned my entire Japan trip in under 30 seconds. The itinerary was better than anything I could've made in 3 hours of research. Absolutely mind-blowing.",
    avatar: "AC",
    gradient: "from-primary to-secondary",
  },
  {
    name: "Marcus Rivera",
    role: "Travel Blogger",
    location: "New York, USA",
    rating: 5,
    text: "I've tried every travel app out there. SafarSathi is on a completely different level. The AI understands context, budget constraints, and even suggests hidden gems.",
    avatar: "MR",
    gradient: "from-teal to-primary",
  },
  {
    name: "Priya Sharma",
    role: "Digital Nomad",
    location: "Bengaluru, India",
    rating: 5,
    text: "The cost breakdown feature saved me from overspending in Bali. It's incredibly accurate and the weather cards made packing so easy. Love this product!",
    avatar: "PS",
    gradient: "from-secondary to-teal",
  },
  {
    name: "Lena Mueller",
    role: "Adventure Seeker",
    location: "Munich, Germany",
    rating: 5,
    text: "Organized my 2-week South East Asia tour in minutes. The day-by-day plan was spot on — even the restaurant recommendations were fantastic.",
    avatar: "LM",
    gradient: "from-primary to-teal",
  },
  {
    name: "James Okafor",
    role: "Business Traveler",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "As someone who travels for work constantly, SafarSathi is a game changer. Quick, accurate, and the PDF export is incredibly professional.",
    avatar: "JO",
    gradient: "from-secondary to-primary",
  },
  {
    name: "Yuki Tanaka",
    role: "Family Traveler",
    location: "Osaka, Japan",
    rating: 5,
    text: "We used SafarSathi to plan our family Europe trip. 14 days, 4 countries, 2 kids. The AI nailed it — kid-friendly activities, budget-conscious, perfect timing.",
    avatar: "YT",
    gradient: "from-teal to-secondary",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-secondary/5 blur-3xl rounded-full dark:bg-secondary/8" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-teal/5 blur-3xl rounded-full dark:bg-teal/6" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-5">
            <Star className="w-3 h-3 text-secondary fill-current" />
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Testimonials</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
            Loved by Travelers
            <br />
            <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join thousands of travelers who've already discovered the power of AI-powered trip planning.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass-card rounded-3xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-6 h-6 text-primary/40" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} • {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 glass-card rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-elevated">
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <div className="font-display text-3xl font-bold gradient-text mb-2">4.9 out of 5</div>
          <div className="text-muted-foreground text-sm">Based on 12,000+ reviews from verified travelers</div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
