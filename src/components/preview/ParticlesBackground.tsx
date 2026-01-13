import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import type { ParticlePreset } from '@/types/cardBuilder';

interface ParticlesBackgroundProps {
  preset: ParticlePreset;
  baseColor: string;
}

export function ParticlesBackground({ preset, baseColor }: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(() => {
    const baseOptions: ISourceOptions = {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      detectRetina: true,
    };

    switch (preset) {
      case 'snow':
        return {
          ...baseOptions,
          particles: {
            number: { value: 100, density: { enable: true } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.3, max: 0.8 } },
            size: { value: { min: 1, max: 5 } },
            move: {
              enable: true,
              speed: 2,
              direction: 'bottom' as const,
              straight: false,
              outModes: { default: 'out' as const },
            },
          },
        };

      case 'bubbles':
        return {
          ...baseOptions,
          particles: {
            number: { value: 40, density: { enable: true } },
            color: { value: [baseColor, '#ffffff', '#a855f7'] },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.1, max: 0.4 } },
            size: { value: { min: 10, max: 40 } },
            move: {
              enable: true,
              speed: 1,
              direction: 'top' as const,
              outModes: { default: 'out' as const },
            },
          },
        };

      case 'stars':
        return {
          ...baseOptions,
          particles: {
            number: { value: 150, density: { enable: true } },
            color: { value: '#ffffff' },
            shape: { type: 'star' },
            opacity: {
              value: { min: 0.1, max: 1 },
              animation: { enable: true, speed: 1, sync: false },
            },
            size: { value: { min: 1, max: 3 } },
            move: {
              enable: true,
              speed: 0.5,
              direction: 'none' as const,
              outModes: { default: 'out' as const },
            },
          },
        };

      case 'confetti':
        return {
          ...baseOptions,
          particles: {
            number: { value: 50, density: { enable: true } },
            color: { value: ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#22c55e', '#06b6d4'] },
            shape: { type: ['square', 'circle'] },
            opacity: { value: { min: 0.5, max: 1 } },
            size: { value: { min: 3, max: 8 } },
            rotate: {
              value: { min: 0, max: 360 },
              animation: { enable: true, speed: 10 },
            },
            move: {
              enable: true,
              speed: 3,
              direction: 'bottom' as const,
              outModes: { default: 'out' as const },
              gravity: { enable: true, acceleration: 0.5 },
            },
          },
        };

      default: // 'default' - floating particles with connections
        return {
          ...baseOptions,
          particles: {
            number: { value: 80, density: { enable: true } },
            color: { value: [baseColor, '#ffffff'] },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.1, max: 0.5 } },
            size: { value: { min: 1, max: 5 } },
            links: {
              enable: true,
              distance: 150,
              color: baseColor,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none' as const,
              outModes: { default: 'bounce' as const },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.5 } },
            },
          },
        };
    }
  }, [preset, baseColor]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 w-full h-full"
    />
  );
}
