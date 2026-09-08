import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { STUCK_LOADING, HER_NAME } from '../data/content'
import { StageShell } from '../components/StageShell'

type Props = { onNext: () => void }

export function FakeEndStage({ onNext }: Props) {
  const [pct, setPct] = useState(0)
  const [label, setLabel] = useState(STUCK_LOADING.label)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Climb to 99, stall, then finish
    const timers: number[] = []
    const steps = [12, 28, 45, 62, 78, 91, 99]
    steps.forEach((v, i) => {
      timers.push(window.setTimeout(() => setPct(v), 280 + i * 320))
    })
    timers.push(
      window.setTimeout(() => {
        setLabel(STUCK_LOADING.stall)
      }, 280 + steps.length * 320),
    )
    timers.push(
      window.setTimeout(() => {
        setPct(100)
        setLabel(STUCK_LOADING.done)
        setDone(true)
      }, 280 + steps.length * 320 + 1100),
    )
    timers.push(
      window.setTimeout(() => {
        onNext()
      }, 280 + steps.length * 320 + 2200),
    )
    return () => timers.forEach(clearTimeout)
  }, [onNext])

  return (
    <StageShell dark mascot="sleep" noGround>
      <div className="mx-auto w-full max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="rounded-[2rem] border-[4px] border-white/25 bg-white/10 px-8 py-14 backdrop-blur-md shadow-[0_10px_0_rgba(0,0,0,0.15)] md:px-12"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-sunny/80">
            Curtain call
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold text-blush md:text-6xl">
            The End
          </h1>
          <p className="mt-3 text-4xl">🙂</p>

          <div className="mx-auto mt-10 max-w-sm">
            <p className="mb-3 font-display text-lg font-bold text-gold-soft">{label}</p>
            <div className="h-4 overflow-hidden rounded-full border-[3px] border-white/40 bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose via-sunny to-mint"
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <p className="mt-2 text-sm font-bold text-blush/50">{pct}%</p>
          </div>

          {done && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 font-display text-2xl font-extrabold text-sunny md:text-3xl"
            >
              wait… one more thing, {HER_NAME}
            </motion.p>
          )}
        </motion.div>
      </div>
    </StageShell>
  )
}
