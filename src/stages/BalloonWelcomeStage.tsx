import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BALLOON_WELCOME } from '../data/content'
import { StageShell } from '../components/StageShell'

type Props = { onNext: () => void }

const BALLOONS = [
  { color: '#ff6b9d', face: true, x: -90, delay: 0, sway: 10, scale: 1 },
  { color: '#7ec8ff', face: false, x: -30, delay: 0.15, sway: 14, scale: 0.88 },
  { color: '#ffe566', face: false, x: 35, delay: 0.28, sway: 12, scale: 0.95 },
  { color: '#c9b6ff', face: false, x: 95, delay: 0.1, sway: 16, scale: 0.85 },
  { color: '#7eefc5', face: false, x: 0, delay: 0.35, sway: 11, scale: 0.78 },
  { color: '#ff9ec7', face: true, x: -55, delay: 0.22, sway: 13, scale: 0.9 },
]

export function BalloonWelcomeStage({ onNext }: Props) {
  const [ready, setReady] = useState(false)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: 8 + (i * 5.5) % 84,
        delay: 0.2 + i * 0.12,
        size: 10 + (i % 4) * 4,
        emoji: i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '✦',
      })),
    [],
  )

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <StageShell mascot="wave" noGround={false}>
      <div className="relative flex min-h-[min(78dvh,640px)] w-full flex-col items-center justify-end overflow-hidden pb-4">
        {/* Rising sparkles */}
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            className="pointer-events-none absolute bottom-0 text-sunny"
            style={{ left: `${s.left}%`, fontSize: s.size }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: -520, opacity: [0, 1, 0] }}
            transition={{
              delay: s.delay,
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            {s.emoji}
          </motion.span>
        ))}

        {/* Balloon cluster */}
        <div className="relative z-10 mb-8 flex h-64 w-full max-w-lg items-end justify-center md:h-72">
          {BALLOONS.map((b, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0"
              style={{ left: `calc(50% + ${b.x}px)`, zIndex: 10 - i }}
              initial={{ y: 420, opacity: 0.9 }}
              animate={{
                y: [420, -20 - (i % 3) * 12],
                x: [0, b.sway, -b.sway, 0],
              }}
              transition={{
                y: {
                  duration: 1.6,
                  delay: b.delay,
                  ease: [0.22, 1, 0.36, 1],
                },
                x: {
                  delay: 1.6 + b.delay,
                  duration: 3 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              <WelcomeBalloon color={b.color} face={b.face} scale={b.scale} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative z-20 max-w-md px-4 text-center"
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-rose-deep md:text-4xl">
              {BALLOON_WELCOME.title}
            </h1>
            <p className="mt-3 font-display text-lg font-bold text-ink/65">
              {BALLOON_WELCOME.subtitle}
            </p>
            <motion.button
              type="button"
              className="btn-primary mt-8"
              whileHover={{ scale: 1.06, rotate: -1 }}
              whileTap={{ scale: 0.92 }}
              onClick={onNext}
            >
              {BALLOON_WELCOME.continue}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </StageShell>
  )
}

function WelcomeBalloon({
  color,
  face,
  scale,
}: {
  color: string
  face: boolean
  scale: number
}) {
  return (
    <div className="flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
      <svg width="72" height="84" viewBox="0 0 92 100" aria-hidden className="sticker drop-shadow-lg">
        <path
          d="M46 78 C20 58 8 44 8 30 C8 16 18 8 30 8 C40 8 44 14 46 20 C48 14 52 8 62 8 C74 8 84 16 84 30 C84 44 72 58 46 78Z"
          fill={color}
          stroke="#fff"
          strokeWidth="4"
        />
        <ellipse cx="28" cy="26" rx="8" ry="5" fill="#fff" opacity="0.5" />
        {face && (
          <>
            <circle cx="36" cy="38" r="2.2" fill="#3d2a4a" />
            <circle cx="52" cy="38" r="2.2" fill="#3d2a4a" />
            <path
              d="M40 46 Q46 50 52 46"
              stroke="#3d2a4a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        <path d="M46 78 L46 92" stroke="#8b5a2b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg width="4" height="56" aria-hidden>
        <path d="M2 0 Q8 28 2 56" stroke="#8b5a2b" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}
