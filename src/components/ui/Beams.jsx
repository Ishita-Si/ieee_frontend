"use client";
import './Beams.css';

/**
 * Lightweight Beams replacement — pure CSS gradient animation.
 * Eliminates Three.js / @react-three/fiber entirely.
 * Hardware-accelerated with `transform` + `opacity` only.
 */
const Beams = ({
  beamNumber = 12,
  lightColor = '#ffffff',
  speed = 1.6,
}) => {
  const beams = Array.from({ length: Math.min(beamNumber, 14) }, (_, i) => i);
  const speedMs = Math.round((2 / speed) * 4000); // map speed to ms duration

  return (
    <div className="beams-container" aria-hidden="true">
      {beams.map((i) => {
        const left = (i / beamNumber) * 110 - 5;
        const delay = -(i * (speedMs / beamNumber));
        const width = 1 + (i % 3) * 0.8;
        const opacity = 0.08 + (i % 5) * 0.035;
        return (
          <div
            key={i}
            className="beam-line"
            style={{
              left: `${left}%`,
              width: `${width}px`,
              opacity,
              animationDuration: `${speedMs + (i % 4) * 800}ms`,
              animationDelay: `${delay}ms`,
              background: `linear-gradient(to bottom, transparent 0%, ${lightColor} 40%, ${lightColor} 60%, transparent 100%)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Beams;
