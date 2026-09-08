import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FUN_FACTS, FUN_FACTS_CONTINUE_LABEL, FUN_FACTS_TRICK_LABEL } from '../data/content'
import { StageShell } from '../components/StageShell'

type Props = { onNext: () => void }

export function FunFactsStage({ onNext }: Props) {
  const [tricked, setTricked] = useState(false)
  const [label, setLabel] = useState(FUN_FACTS_CONTINUE_LABEL)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [shrunk, setShrunk] = useState(false)
  const trickBusy = useRef(false)

  const playTrick = () => {
    if (tricked || trickBusy.current) return
    trickBusy.current = true
    setTricked(true)
    setLabel(FUN_FACTS_TRICK_LABEL)
    setShrunk(true)
    setOffset({
      x: (Math.random() > 0.5 ? 1 : -1) * (48 + Math.random() * 40),
      y: (Math.random() > 0.5 ? 1 : -1) * (18 + Math.random() * 24),
    })
    setTimeout(() => {
      setOffset({ x: 0, y: 0 })
      setShrunk(false)
      setLabel(FUN_FACTS_CONTINUE_LABEL)
      trickBusy.current = false
    }, 900)
  }

  const handleContinue = () => {
    if (!tricked || trickBusy.current) {
      playTrick()
      return
    }
    onNext()
  }

  return (
    <StageShell mascot="idle">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center font-display text-4xl font-extrabold md:text-5xl">
          <span className="inline-block rounded-2xl border-[3px] border-white bg-rose px-2.5 py-1 text-white shadow-[0_4px_0_rgba(224,72,120,0.45)]">
            Fun
          </span>{' '}
          <span className="inline-block rounded-2xl border-[3px] border-white bg-sky px-2.5 py-1 text-white shadow-[0_4px_0_rgba(80,150,220,0.45)]">
            facts
          </span>{' '}
          <span className="inline-block rounded-2xl border-[3px] border-white bg-sunny px-2.5 py-1 text-ink shadow-[0_4px_0_rgba(230,180,60,0.55)]">
            about
          </span>{' '}
          <span className="inline-block rounded-2xl border-[3px] border-white bg-lavender px-2.5 py-1 text-white shadow-[0_4px_0_rgba(140,110,220,0.45)]">
            us
          </span>
        </h1>

        <ul className="mt-10 space-y-3">
          {FUN_FACTS.map((fact, i) => (
            <motion.li
              key={fact}
              initial={{ opacity: 0, x: -16, rotate: -1 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.08 * i, type: 'spring', stiffness: 280, damping: 18 }}
              className="glass-card flex items-start gap-3 rounded-2xl px-5 py-4"
            >
              <span className="mt-0.5 text-xl" aria-hidden>
                {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '💖' : '✨'}
              </span>
              <span className="font-display text-xl font-bold leading-snug text-ink/90">{fact}</span>
            </motion.li>
          ))}
        </ul>

        <div className="relative mt-10 flex min-h-16 justify-center">
          <motion.button
            type="button"
            onClick={handleContinue}
            onMouseEnter={() => {
              if (!tricked) playTrick()
            }}
            onTouchStart={(e) => {
              if (!tricked) {
                e.preventDefault()
                playTrick()
              }
            }}
            animate={{
              x: offset.x,
              y: offset.y,
              scale: shrunk ? 0.78 : 1,
              rotate: shrunk ? 6 : 0,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            whileHover={tricked && !shrunk ? { scale: 1.06, rotate: -1 } : undefined}
            whileTap={tricked ? { scale: 0.92 } : undefined}
            className="btn-primary"
          >
            {label}
          </motion.button>
        </div>
      </div>
    </StageShell>
  )
}
