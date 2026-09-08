import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { CuteMascot, type MascotMood } from './CuteMascot'

type Props = {
  children: ReactNode
  className?: string
  dark?: boolean
  /** Hide the grassy ground (e.g. for night / special scenes) */
  noGround?: boolean
  /** Hide default sun/clouds — scene provides its own sky */
  noSkyDecor?: boolean
  /** Hide rising ambient sparkles */
  noAmbient?: boolean
  mascot?: MascotMood | false
  mascotClassName?: string
}

export function StageShell({
  children,
  className = '',
  dark = false,
  noGround = false,
  noSkyDecor = false,
  noAmbient = false,
  mascot = 'idle',
  mascotClassName = '',
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4 pt-12 md:px-8 ${
        dark || noGround ? 'pb-12' : 'pb-28'
      } ${dark ? 'night-bg text-blush' : 'paper-bg text-ink'} ${className}`}
    >
      {!dark && !noSkyDecor && <DaySkyDecor />}
      {dark && <NightSkyDecor />}
      {!dark && !noGround && <GrassGround />}
      {!dark && !noAmbient && <AmbientFloaters />}
      {dark && <Twinkles />}

      {mascot !== false && (
        <div
          className={`pointer-events-none absolute z-20 ${mascotClassName || 'bottom-6 left-4 md:bottom-8 md:left-8'}`}
        >
          <CuteMascot mood={mascot} size={64} />
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </motion.section>
  )
}

function DaySkyDecor() {
  const clouds = [
    { top: '8%', left: '4%', w: 90, delay: 0 },
    { top: '14%', left: '55%', w: 120, delay: 1.2 },
    { top: '6%', left: '78%', w: 70, delay: 0.6 },
    { top: '22%', left: '28%', w: 100, delay: 2 },
    { top: '18%', left: '88%', w: 60, delay: 1.5 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* sun — fully in-frame with soft rays */}
      <motion.div
        className="absolute right-[10%] top-[9%] flex h-20 w-20 items-center justify-center md:right-[12%] md:top-[10%] md:h-24 md:w-24"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      >
        <div className="absolute inset-[-28%] rounded-full bg-sunny/25 blur-md" />
        <div className="absolute inset-[-12%] rounded-full bg-sunny/40 blur-[2px]" />
        {[0, 45, 90, 135].map((deg) => (
          <div
            key={deg}
            className="absolute h-[118%] w-1.5 rounded-full bg-sunny/35"
            style={{ transform: `rotate(${deg}deg)` }}
          />
        ))}
        <div className="relative h-[72%] w-[72%] rounded-full bg-gradient-to-br from-[#fff6b0] to-[#ffe566] shadow-[0_0_28px_rgba(255,229,102,0.75)]" />
      </motion.div>
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: c.top, left: c.left, width: c.w }}
          animate={{ x: [0, 28, 0] }}
          transition={{
            repeat: Infinity,
            duration: 10 + i * 2,
            delay: c.delay,
            ease: 'easeInOut',
          }}
        >
          <Cloud width={c.w} />
        </motion.div>
      ))}
    </div>
  )
}

function Cloud({ width }: { width: number }) {
  const h = width * 0.45
  return (
    <svg width={width} height={h} viewBox="0 0 120 54" aria-hidden className="opacity-90">
      <ellipse cx="40" cy="32" rx="28" ry="18" fill="#fff" />
      <ellipse cx="68" cy="28" rx="32" ry="20" fill="#fff" />
      <ellipse cx="90" cy="34" rx="22" ry="14" fill="#fff" />
      <ellipse cx="55" cy="36" rx="40" ry="14" fill="#fff" />
    </svg>
  )
}

function GrassGround() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[22%] min-h-[120px]">
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 Q180 40 360 70 T720 55 T1080 75 T1440 50 L1440 200 L0 200 Z"
          fill="#8fe0a8"
        />
        <path
          d="M0 110 Q200 70 400 100 T800 85 T1200 105 T1440 90 L1440 200 L0 200 Z"
          fill="#5cbc7a"
        />
      </svg>
      {/* little flowers on grass */}
      {[8, 18, 32, 48, 62, 75, 88].map((left, i) => (
        <span
          key={left}
          className="absolute bottom-[18%] text-sm md:text-base"
          style={{ left: `${left}%`, transform: `rotate(${(i % 3) * 8 - 8}deg)` }}
        >
          {i % 2 === 0 ? '🌼' : '🌸'}
        </span>
      ))}
    </div>
  )
}

function AmbientFloaters() {
  const items = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 5.7 + 2) % 100,
    delay: i * 0.45,
    dur: 11 + (i % 5),
    size: 10 + (i % 4) * 5,
    char: (['✦', '♥', '❀', '✧', '⭐'] as const)[i % 5],
    color: (
      [
        'text-rose/45',
        'text-sunny/55',
        'text-lavender/50',
        'text-sky/50',
        'text-bubble/45',
      ] as const
    )[i % 5],
  }))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.id}
          className={`absolute bottom-[-5%] ${it.color}`}
          style={{
            left: `${it.left}%`,
            fontSize: it.size,
            animation: `rise-sparkle ${it.dur}s linear ${it.delay}s infinite`,
          }}
        >
          {it.char}
        </span>
      ))}
    </div>
  )
}

function NightSkyDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute right-[12%] top-[8%] h-14 w-14 rounded-full bg-gold-soft/90 shadow-[0_0_50px_rgba(255,229,102,0.45)] md:h-16 md:w-16"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#1a1230] to-transparent" />
    </div>
  )
}

function Twinkles() {
  const stars = Array.from({ length: 42 }, (_, i) => i)
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((i) => (
        <motion.span
          key={i}
          className="absolute text-gold-soft"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 85}%`,
            fontSize: `${5 + (i % 4) * 4}px`,
          }}
          animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 1.6 + (i % 5) * 0.35,
            delay: (i % 7) * 0.18,
          }}
        >
          {i % 4 === 0 ? '✦' : '★'}
        </motion.span>
      ))}
    </div>
  )
}
