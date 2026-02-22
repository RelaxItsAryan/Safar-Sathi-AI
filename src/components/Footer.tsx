import { Plane, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Product: ["Features", "Pricing", "Demo", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Support: ["Help Center", "Privacy Policy", "Terms of Service", "Contact"],
    Developers: ["API Docs", "Integrations", "Status", "GitHub"],
  };

  const socials = [
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: Github, href: "#" },
    { Icon: Mail, href: "#" },
  ];

  return (
    <footer className="relative border-t border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-3xl rounded-full dark:bg-primary/6" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center glow-blue">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="gradient-text">Safar</span>
                <span className="text-foreground">Sathi</span>
                <span className="gradient-text"> AI</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Plan your perfect trip in seconds with AI-powered itineraries, weather forecasts, and smart budgeting.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl glass-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display font-bold text-xl text-foreground mb-1">Stay in the loop</h4>
            <p className="text-muted-foreground text-sm">Get travel tips and AI updates in your inbox.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-muted-foreground text-sm">
            © {year} SafarSathi AI. All rights reserved. Built with ❤️ for travelers worldwide.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal pulse-glow" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
