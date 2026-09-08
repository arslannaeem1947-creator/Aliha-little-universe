import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FAKE_GLITCH } from '../data/content'

type Props = { onDone: () => void }

/** Brief fake 404 flash between bow → bloom */
export function GlitchStage({ onDone }: Props) {
  const [phase, setPhase] = useState<'glitch' | 'wink'>('glitch')

  useEffect(() => {
    const a = setTimeout(() => setPhase('wink'), 700)
    const b = setTimeout(onDone, 1400)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [onDone])

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 text-center text-white">
      {/* glitch bars */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[12, 28, 44, 61, 77].map((top, i) => (
          <motion.div
            key={top}
            className="absolute left-0 h-1 w-full bg-rose/80"
            style={{ top: `${top}%` }}
            animate={{ x: [0, 20, -30, 10, 0], opacity: [0.3, 1, 0.4, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 0.35 + i * 0.05 }}
          />
        ))}
      </div>

      {phase === 'glitch' ? (
        <motion.div
          initial={{ opacity: 0, skewX: -4 }}
          animate={{ opacity: 1, skewX: [0, -3, 2, 0] }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-mono text-6xl font-bold text-rose md:text-8xl">{FAKE_GLITCH.code}</p>
          <h1 className="mt-4 font-display text-2xl font-extrabold md:text-3xl">
            {FAKE_GLITCH.title}
          </h1>
          <p className="mt-2 text-sm text-white/50">{FAKE_GLITCH.subtitle}</p>
        </motion.div>
      ) : (
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
          className="font-display text-2xl font-extrabold text-sunny md:text-3xl"
        >
          {FAKE_GLITCH.wink}
        </motion.p>
      )}
    </section>
  )
}
