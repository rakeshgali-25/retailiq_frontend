import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function ParticlesBackground() {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: { value: "#0d0d0d" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.6 } },
            push: { quantity: 4 },
          },
        },
        particles: {
          number: { value: 80, density: { enable: true, area: 800 } },
          color: { value: "#00d4ff" },
          links: {
            enable: true,
            color: "#00d4ff",
            distance: 150,
            opacity: 0.5,
            width: 1,
          },
          move: { enable: true, speed: 2, outModes: { default: "bounce" } },
          opacity: { value: 0.6 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 4 } },
        },
        detectRetina: true,
      }}
    />
  );
}

export default ParticlesBackground;
