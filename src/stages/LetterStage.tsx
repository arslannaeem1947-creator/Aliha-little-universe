import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LETTER, HER_NAME } from '../data/content'
import { StageShell } from '../components/StageShell'

type Props = { onNext: () => void }

export function LetterStage({ onNext }: Props) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'reading'>('closed')

  const openEnvelope = () => {
    setPhase('opening')
    setTimeout(() => setPhase('reading'), 900)
  }

  return (
    <StageShell mascot="shy">
      <div className="mx-auto flex min-h-[560px] max-w-2xl flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase !== 'reading' && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="relative w-full max-w-md"
            >
              <p className="mb-6 text-center font-display text-xl font-bold text-ink/60">
                A letter arrived for
              </p>

              <button
                type="button"
                onClick={openEnvelope}
                className="group relative mx-auto block w-full max-w-sm"
                aria-label="Open envelope"
                style={{ perspective: 1000 }}
              >
                <div className="relative h-56 overflow-hidden rounded-[1.6rem] border-[4px] border-white bg-gradient-to-br from-[#ffe9a8] to-[#ffd56a] shadow-[0_8px_0_rgba(230,180,60,0.45),0_25px_50px_rgba(61,42,74,0.12)]">
                  <motion.div
                    className="absolute inset-x-0 top-0 z-20 origin-top"
                    animate={
                      phase === 'opening'
                        ? { rotateX: -180, y: -8 }
                        : { rotateX: 0, y: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="mx-auto h-0 w-0 border-l-[190px] border-r-[190px] border-t-[110px] border-l-transparent border-r-transparent border-t-[#ffc94d]"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))' }}
                    />
                    <div className="absolute left-1/2 top-10 -translate-x-1/2 rounded-full border-[3px] border-white bg-rose px-3 py-1 text-xs font-extrabold tracking-wide text-white shadow">
                      💌 for {HER_NAME}
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute inset-x-8 top-16 z-10 rounded-xl border-[3px] border-white bg-cream p-4 shadow-md"
                    animate={
                      phase === 'opening'
                        ? { y: -70, opacity: 1 }
                        : { y: 20, opacity: 0.95 }
                    }
                    transition={{ duration: 0.8, delay: phase === 'opening' ? 0.25 : 0 }}
                  >
                    <p className="font-display text-2xl font-extrabold text-rose-deep">
                      Happy Birthday, {HER_NAME}
                    </p>
                    <p className="mt-1 text-xs font-bold text-ink/40">tap envelope to open</p>
                  </motion.div>

                  <div className="absolute inset-x-0 bottom-0 z-30 h-28 bg-gradient-to-t from-[#f0b83a] to-[#ffd56a]" />
                  <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 font-display text-sm font-bold text-ink/55">
                    {phase === 'closed' ? 'tap to open ✉️' : 'opening…'}
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {phase === 'reading' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 40, scale: 0.94, rotate: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="w-full rounded-[1.8rem] border-[4px] border-white bg-[linear-gradient(180deg,#fffef8_0%,#fff5fb_100%)] p-8 shadow-[0_8px_0_rgba(255,107,157,0.15),0_30px_70px_rgba(255,107,157,0.18)] md:p-12"
            >
              <p className="text-center text-xs font-extrabold uppercase tracking-[0.28em] text-rose/70">
                With love
              </p>
              <h1 className="mt-3 text-center font-display text-5xl font-extrabold text-rose-deep md:text-6xl">
                {LETTER.greeting}
              </h1>
              <p className="mt-8 font-display text-2xl font-bold text-ink/80">{LETTER.nickname}</p>

              <div className="mt-5 space-y-4">
                {LETTER.body.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, type: 'spring', stiffness: 280, damping: 20 }}
                    className="font-display text-lg font-semibold leading-relaxed text-ink/85 md:text-xl"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <div className="mt-8 font-display text-xl font-bold text-ink/80">
                <p>{LETTER.signoff}</p>
                <p className="mt-1 text-rose-deep">{LETTER.name}</p>
              </div>

              <div className="mt-10 text-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06, rotate: -1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onNext}
                  className="btn-primary"
                >
                  one last surprise →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StageShell>
  )
}
