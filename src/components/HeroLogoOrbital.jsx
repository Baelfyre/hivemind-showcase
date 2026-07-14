import { useEffect, useRef } from 'react';
import approvedLogoSrc from '../../assets/hivemind-approved-logo.png';

const DESKTOP_PARALLAX_AMPLITUDE = 6;
const TABLET_PARALLAX_AMPLITUDE = 3.5;
const PARALLAX_VERTICAL_RATIO = 0.72;
const INITIAL_GLOW_OPACITY = 0.28;
const ORBIT_STREAK_DELAYS = ['0s', '11.67s', '23.34s'];
const INNER_ORBIT_ANGLES = [-90, 0, 90, 180];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildOrbitPointStyle(angle, index) {
  const radians = (angle * Math.PI) / 180;

  return {
    left: `${50 + Math.cos(radians) * 28}%`,
    top: `${50 + Math.sin(radians) * 28}%`,
    '--hero-point-delay': `${index * 0.7}s`,
  };
}

function bindMediaQuery(query, handler) {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }

  query.addListener(handler);
  return () => query.removeListener(handler);
}

export default function HeroLogoOrbital() {
  const rootRef = useRef(null);
  const shellRef = useRef(null);
  const frameRef = useRef(0);
  const motionRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    currentGlow: INITIAL_GLOW_OPACITY,
    targetGlow: INITIAL_GLOW_OPACITY,
    currentGlowScale: 1,
    targetGlowScale: 1,
  });
  const settingsRef = useRef({
    pointerEnabled: true,
    pointerAmplitude: DESKTOP_PARALLAX_AMPLITUDE,
    glowBase: 0.22,
    glowBoost: 0.12,
    glowScaleBase: 0.98,
    glowScaleBoost: 0.04,
  });

  useEffect(() => {
    const rootNode = rootRef.current;
    const shellNode = shellRef.current;

    if (!rootNode || !shellNode) {
      return undefined;
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const tabletQuery = window.matchMedia('(max-width: 1023px)');
    const touchQuery = window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)');

    const applyStyles = () => {
      const motion = motionRef.current;
      shellNode.style.setProperty('--hero-parallax-x', `${motion.currentX.toFixed(2)}px`);
      shellNode.style.setProperty('--hero-parallax-y', `${motion.currentY.toFixed(2)}px`);
      shellNode.style.setProperty('--hero-glow-opacity', motion.currentGlow.toFixed(3));
      shellNode.style.setProperty('--hero-glow-scale', motion.currentGlowScale.toFixed(3));
    };

    const scheduleFrame = () => {
      if (frameRef.current) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        const motion = motionRef.current;
        const nextX = motion.currentX + (motion.targetX - motion.currentX) * 0.14;
        const nextY = motion.currentY + (motion.targetY - motion.currentY) * 0.14;
        const nextGlow = motion.currentGlow + (motion.targetGlow - motion.currentGlow) * 0.1;
        const nextGlowScale = motion.currentGlowScale
          + (motion.targetGlowScale - motion.currentGlowScale) * 0.1;

        motion.currentX = nextX;
        motion.currentY = nextY;
        motion.currentGlow = nextGlow;
        motion.currentGlowScale = nextGlowScale;
        applyStyles();

        const settled = Math.abs(motion.targetX - nextX) < 0.04
          && Math.abs(motion.targetY - nextY) < 0.04
          && Math.abs(motion.targetGlow - nextGlow) < 0.004
          && Math.abs(motion.targetGlowScale - nextGlowScale) < 0.004;

        if (!settled) {
          scheduleFrame();
        }
      });
    };

    const updateGlowTarget = () => {
      const rect = rootNode.getBoundingClientRect();

      if (!rect.height) {
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const heroCenter = rect.top + rect.height / 2;
      const distance = Math.abs(heroCenter - viewportHeight * 0.42);
      const proximity = clamp(1 - distance / (viewportHeight * 0.72), 0, 1);
      const settings = settingsRef.current;

      motionRef.current.targetGlow = settings.glowBase + proximity * settings.glowBoost;
      motionRef.current.targetGlowScale = settings.glowScaleBase
        + proximity * settings.glowScaleBoost;
      scheduleFrame();
    };

    const syncViewportSettings = () => {
      const reducedMotion = reduceMotionQuery.matches;
      const touchOrSmall = touchQuery.matches;
      const isTablet = !touchOrSmall && tabletQuery.matches;
      const settings = settingsRef.current;

      settings.pointerEnabled = !reducedMotion && !touchOrSmall;
      settings.pointerAmplitude = reducedMotion
        ? 0
        : isTablet
          ? TABLET_PARALLAX_AMPLITUDE
          : DESKTOP_PARALLAX_AMPLITUDE;
      settings.glowBase = reducedMotion ? 0.2 : touchOrSmall ? 0.18 : 0.22;
      settings.glowBoost = reducedMotion ? 0.03 : touchOrSmall ? 0.05 : isTablet ? 0.09 : 0.12;
      settings.glowScaleBase = reducedMotion ? 1 : touchOrSmall ? 0.99 : 0.98;
      settings.glowScaleBoost = reducedMotion ? 0 : touchOrSmall ? 0.02 : isTablet ? 0.03 : 0.04;

      if (!settings.pointerEnabled) {
        motionRef.current.targetX = 0;
        motionRef.current.targetY = 0;
      }

      updateGlowTarget();
    };

    const handlePointerMove = (event) => {
      const settings = settingsRef.current;

      if (!settings.pointerEnabled || event.pointerType === 'touch') {
        return;
      }

      const rect = rootNode.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const relativeX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const relativeY = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      motionRef.current.targetX = (relativeX * 2 - 1) * settings.pointerAmplitude;
      motionRef.current.targetY = (relativeY * 2 - 1)
        * settings.pointerAmplitude
        * PARALLAX_VERTICAL_RATIO;
      scheduleFrame();
    };

    const resetPointer = () => {
      motionRef.current.targetX = 0;
      motionRef.current.targetY = 0;
      scheduleFrame();
    };

    rootNode.addEventListener('pointermove', handlePointerMove, { passive: true });
    rootNode.addEventListener('pointerleave', resetPointer);
    rootNode.addEventListener('pointercancel', resetPointer);
    window.addEventListener('scroll', updateGlowTarget, { passive: true });
    window.addEventListener('resize', syncViewportSettings, { passive: true });

    const cleanups = [
      bindMediaQuery(reduceMotionQuery, syncViewportSettings),
      bindMediaQuery(tabletQuery, syncViewportSettings),
      bindMediaQuery(touchQuery, syncViewportSettings),
    ];

    applyStyles();
    syncViewportSettings();

    return () => {
      rootNode.removeEventListener('pointermove', handlePointerMove);
      rootNode.removeEventListener('pointerleave', resetPointer);
      rootNode.removeEventListener('pointercancel', resetPointer);
      window.removeEventListener('scroll', updateGlowTarget);
      window.removeEventListener('resize', syncViewportSettings);
      cleanups.forEach((cleanup) => cleanup());

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="showcase-orbital">
      <div
        ref={shellRef}
        className="showcase-orbital__shell"
        style={{
          '--hero-parallax-x': '0px',
          '--hero-parallax-y': '0px',
          '--hero-glow-opacity': INITIAL_GLOW_OPACITY,
          '--hero-glow-scale': 1,
        }}
      >
        <div className="showcase-orbital__visual">
          <div className="showcase-orbital__backdrop" aria-hidden="true" />

          <div className="showcase-orbital__layer showcase-orbital__outer" aria-hidden="true">
            <svg viewBox="0 0 500 500" className="showcase-orbital__svg" focusable="false">
              <circle cx="250" cy="250" r="220" className="showcase-orbital__stroke showcase-orbital__stroke--soft" />
              <circle cx="250" cy="250" r="220" className="showcase-orbital__stroke showcase-orbital__stroke--glow" />
            </svg>
          </div>

          {ORBIT_STREAK_DELAYS.map((delay, index) => (
            <div
              key={delay}
              className="showcase-orbital__layer showcase-orbital__streak"
              style={{ '--hero-streak-delay': delay, '--hero-streak-index': index }}
              aria-hidden="true"
            >
              <span className="showcase-orbital__streak-core" />
              <span className="showcase-orbital__streak-halo" />
            </div>
          ))}

          <div className="showcase-orbital__layer showcase-orbital__gyro" aria-hidden="true">
            <svg viewBox="0 0 500 500" className="showcase-orbital__svg" focusable="false">
              <ellipse cx="250" cy="250" rx="180" ry="160" className="showcase-orbital__stroke showcase-orbital__stroke--gyro" />
            </svg>
          </div>

          <div className="showcase-orbital__layer showcase-orbital__inner" aria-hidden="true">
            <svg viewBox="0 0 500 500" className="showcase-orbital__svg" focusable="false">
              <circle cx="250" cy="250" r="140" className="showcase-orbital__stroke showcase-orbital__stroke--inner" />
            </svg>
            {INNER_ORBIT_ANGLES.map((angle, index) => (
              <span key={angle} className="showcase-orbital__point" style={buildOrbitPointStyle(angle, index)} />
            ))}
          </div>

          <div className="showcase-orbital__center">
            <div className="showcase-orbital__core-shadow" aria-hidden="true" />
            <div className="showcase-orbital__logo-frame">
              <img
                src={approvedLogoSrc}
                alt="HiveMind honeycomb logo"
                className="showcase-orbital__logo"
                decoding="async"
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </div>

          <div className="showcase-orbital__ambient" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
