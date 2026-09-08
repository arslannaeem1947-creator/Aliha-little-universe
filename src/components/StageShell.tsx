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
  /** Break out of max-width shell — full viewport scene */
  fullBleed?: boolean
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
  fullBleed = false,
  mascot = 'idle',
  mascotClassName = '',
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden ${
        fullBleed ? 'px-0 pt-0' : 'px-4 pt-12 md:px-8'
      } ${dark || noGround || fullBleed ? 'pb-0' : 'pb-28'} ${
        dark ? 'night-bg text-blush' : 'paper-bg text-ink'
      } ${className}`}
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

      <div
        className={`relative z-10 flex w-full flex-1 flex-col items-center ${
          fullBleed ? 'max-w-none justify-stretch' : 'max-w-5xl justify-center'
        }`}
      >
        {children}
      </div>
    </motion.section>
  )
}

function DaySkyDecor() {
  const mists = [
    { top: '10%', left: '2%', w: 140, delay: 0, opacity: 0.2 },
    { top: '16%', left: '48%', w: 180, delay: 1.4, opacity: 0.16 },
    { top: '8%', left: '72%', w: 110, delay: 0.7, opacity: 0.22 },
    { top: '26%', left: '22%', w: 150, delay: 2.1, opacity: 0.14 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft romantic moon / warm glow */}
      <motion.div
        className="absolute right-[9%] top-[8%] h-24 w-24 md:right-[11%] md:top-[9%] md:h-28 md:w-28"
        animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      >
        <div className="absolute inset-[-45%] rounded-full bg-[#ffb4c8]/25 blur-2xl" />
        <div className="absolute inset-[-20%] rounded-full bg-[#ffe0a8]/30 blur-xl" />
        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-[#fff6e8] via-[#ffe3b0] to-[#ffc98a] shadow-[0_0_40px_rgba(255,200,140,0.55)]" />
        <div className="absolute right-[18%] top-[22%] h-[58%] w-[58%] rounded-full bg-[#5a3d7a]/28" />
      </motion.div>

      {/* Soft mist ribbons instead of cartoon clouds */}
      {mists.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md"
          style={{
            top: m.top,
            left: m.left,
            width: m.w,
            height: m.w * 0.22,
            opacity: m.opacity,
          }}
          animate={{ x: [0, 24, 0], opacity: [m.opacity * 0.7, m.opacity, m.opacity * 0.7] }}
          transition={{
            repeat: Infinity,
            duration: 14 + i * 2,
            delay: m.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle floating spark accents near top */}
      {[12, 28, 55, 70, 88].map((left, i) => (
        <motion.span
          key={left}
          className="absolute text-gold-soft/50"
          style={{ left: `${left}%`, top: `${10 + (i % 3) * 8}%`, fontSize: 10 + (i % 3) * 3 }}
          animate={{ opacity: [0.2, 0.75, 0.2], y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: i * 0.3 }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  )
}

function GrassGround() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24%] min-h-[130px]">
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        <path
          d="M0 90 Q200 40 420 75 T840 55 T1200 80 T1440 60 L1440 220 L0 220 Z"
          fill="#6b3d5c"
          opacity="0.85"
        />
        <path
          d="M0 120 Q240 70 480 110 T960 90 T1280 115 T1440 100 L1440 220 L0 220 Z"
          fill="#4a2a45"
        />
        <path
          d="M0 155 Q300 125 600 150 T1100 140 T1440 155 L1440 220 L0 220 Z"
          fill="#3a2038"
          opacity="0.9"
        />
      </svg>
      {/* Soft rose glow along horizon */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#ff8fab]/20 to-transparent" />
      {[10, 26, 44, 62, 78, 90].map((left, i) => (
        <motion.span
          key={left}
          className="absolute bottom-[22%] text-base opacity-70 md:text-lg"
          style={{ left: `${left}%` }}
          animate={{ y: [0, -5, 0], opacity: [0.45, 0.8, 0.45] }}
          transition={{ repeat: Infinity, duration: 3.2 + i * 0.25, delay: i * 0.2 }}
        >
          {i % 3 === 0 ? '💕' : i % 3 === 1 ? '✨' : '💗'}
        </motion.span>
      ))}
    </div>
  )
}

function AmbientFloaters() {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: (i * 7.1 + 3) % 100,
    delay: i * 0.55,
    dur: 13 + (i % 5),
    size: 12 + (i % 4) * 4,
    char: (['♥', '✦', '❀', '✧', '💕'] as const)[i % 5],
    color: (
      [
        'text-rose/40',
        'text-gold-soft/45',
        'text-bubble/40',
        'text-lavender/35',
        'text-blush/50',
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
