import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

const STEPS = [
  { label: "Analyzing your preferences...", pct: 10 },
  { label: "Searching top destinations...", pct: 25 },
  { label: "Generating day-by-day plan...", pct: 45 },
  { label: "Fetching weather forecast...", pct: 62 },
  { label: "Calculating smart budget...", pct: 78 },
  { label: "Finding top places to visit...", pct: 90 },
  { label: "Finalizing your dream trip ✨", pct: 98 },
];

interface GlobeLoaderProps {
  destination: string;
}

export const GlobeLoader = ({ destination }: GlobeLoaderProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, STEPS.length - 1);
        setProgress(STEPS[next].pct);
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 px-6 max-w-md w-full">
        {/* Globe SVG Animation */}
        <div className="relative w-40 h-40">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl animate-pulse" />
          
          {/* Globe */}
          <svg viewBox="0 0 160 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="globeGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="hsl(217,91%,70%)" />
                <stop offset="50%" stopColor="hsl(217,91%,50%)" />
                <stop offset="100%" stopColor="hsl(224,28%,15%)" />
              </radialGradient>
              <radialGradient id="shineGrad" cx="35%" cy="30%" r="40%">
                <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Main globe circle */}
            <circle cx="80" cy="80" r="72" fill="url(#globeGrad)" />

            {/* Latitude lines */}
            {[-36, -18, 0, 18, 36].map((offset, i) => (
              <ellipse
                key={i}
                cx="80"
                cy={80 + offset}
                rx={Math.sqrt(72 * 72 - offset * offset)}
                ry="6"
                fill="none"
                stroke="hsl(215,100%,90%)"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
            ))}

            {/* Longitude lines (animated) */}
            <ellipse cx="80" cy="80" rx="12" ry="72" fill="none" stroke="hsl(215,100%,90%)" strokeOpacity="0.2" strokeWidth="1">
              <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="80" cy="80" rx="30" ry="72" fill="none" stroke="hsl(215,100%,90%)" strokeOpacity="0.15" strokeWidth="1">
              <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="10s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="80" cy="80" rx="55" ry="72" fill="none" stroke="hsl(215,100%,90%)" strokeOpacity="0.12" strokeWidth="1">
              <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="14s" repeatCount="indefinite" />
            </ellipse>

            {/* Shine */}
            <circle cx="80" cy="80" r="72" fill="url(#shineGrad)" />

            {/* Orbiting plane dot */}
            <circle r="5" fill="hsl(175,80%,55%)" opacity="0.9">
              <animateMotion dur="4s" repeatCount="indefinite">
                <mpath href="#orbitPath" />
              </animateMotion>
            </circle>
            <path id="orbitPath" d="M 80,8 A 72,72 0 1,1 79.9,8" fill="none" />
          </svg>

          {/* Orbiting Plane icon */}
          <div
            className="absolute"
            style={{
              animation: "orbitPlane 4s linear infinite",
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
          >
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold gradient-text mb-2">
            Generating Your Dream Trip
          </h2>
          <p className="text-muted-foreground text-sm">
            Planning your adventure to{" "}
            <span className="text-foreground font-semibold">{destination}</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="animate-pulse">{STEPS[stepIndex]?.label}</span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
        </div>

        {/* Steps checklist */}
        <div className="w-full space-y-2">
          {STEPS.slice(0, stepIndex + 1).map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm animate-fade-in"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                i < stepIndex
                  ? "bg-teal"
                  : "bg-gradient-primary animate-pulse"
              }`}>
                {i < stepIndex ? (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={i < stepIndex ? "text-muted-foreground line-through" : "text-foreground"}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Plane animation row */}
        <div className="flex items-center gap-2 text-primary/50">
          <Plane className="w-4 h-4 animate-bounce" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
