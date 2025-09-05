import React, { useCallback, memo } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

/**
 * Keep options stable (declare outside component) so the prop identity doesn't change.
 * Note: fullScreen is disabled; we'll control sizing with the wrapper div via CSS.
 */
const PARTICLES_OPTIONS = {
  fullScreen: { enable: false },
  background: { color: { value: "#0d0d0d" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      grab: { distance: 200, links: { opacity: 0.6 } },
      push: { quantity: 4 }
    }
  },
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: "#00d4ff" },
    links: {
      enable: true,
      color: "#00d4ff",
      distance: 150,
      opacity: 0.5,
      width: 1
    },
    move: { enable: true, speed: 2, outModes: { default: "bounce" } },
    opacity: { value: 0.6 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 4 } }
  },
  detectRetina: true
};

function ParticlesBackgroundInner() {
  // stable init callback so React.memo sees no changes
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    // wrapper controls position, pointer-events and z-index via CSS
    <div className="particles-bg" aria-hidden>
      <Particles id="tsparticles" init={particlesInit} options={PARTICLES_OPTIONS} />
    </div>
  );
}

// memoize to prevent re-renders when parent state changes
const ParticlesBackground = memo(ParticlesBackgroundInner);
export default ParticlesBackground;
