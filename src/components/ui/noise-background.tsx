import React from "react";

interface NoiseBackgroundProps {
  children: React.ReactNode;
  containerClassName?: string;
  gradientColors?: string[];
}

export const NoiseBackground: React.FC<NoiseBackgroundProps> = ({
  children,
  containerClassName = "",
  gradientColors = [
    "rgb(233, 140, 250)",
    "rgb(157, 10, 187)",
    "rgb(154, 17, 218)",
  ],
}) => {
  const gradient = `linear-gradient(90deg, ${gradientColors.join(", ")})`;
  return (
    <div
      className={containerClassName}
      style={{
        background: gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'none\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>')",
          opacity: 0.15,
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};
