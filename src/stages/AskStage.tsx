import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StageShell } from '../components/StageShell'
import { PrankToast } from '../components/PrankToast'
import { useMusic } from '../components/MusicToggle'
import { HER_NAME } from '../data/content'

type Props = { onYes: () => void }

type Step = 'ask' | 'react' | 'yes'

export function AskStage({ onYes }: Props) {
  const { unlockAudio } = useMusic()
  const [step, setStep] = useState<Step>('ask')

  const pressNo = () => {
    unlockAudio()
    setStep('react')
    // Reveal YES after she reads the reaction
    setTimeout(() => setStep('yes'), 900)
  }

  return (
    <StageShell mascot="wave">
      <PrankToast trigger />
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="glass-card rounded-[2.2rem] px-8 py-12 md:px-14">
          <p className="font-display text-2xl font-bold text-rose">hey {HER_NAME}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl">
            I made something for you.
            <br />
            <span className="text-rose-deep">Do you wanna see it?</span>
          </h1>

          <div className="relative mx-auto mt-10 flex min-h-[11rem] w-full max-w-md flex-col items-center justify-center gap-5">
            <AnimatePresence mode="wait">
              {step === 'ask' && (
                <motion.button
                  key="no"
                  type="button"
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, y: -8 }}
                  whileHover={{ scale: 1.06, rotate: 2 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                  onClick={pressNo}
                  className="btn-ghost px-12 text-lg"
                >
                  NO
                </motion.button>
              )}

              {(step === 'react' || step === 'yes') && (
                <motion.div
                  key="react"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-2"
                >
                  <p className="font-display text-xl font-extrabold leading-snug text-rose-deep md:text-2xl">
                    aww {HER_NAME}… really? 🥺
                  </p>
                  <p className="mt-2 font-display text-base font-bold text-ink/65 md:text-lg">
                    I already made this whole little universe just for you —
                    <br />
                    at least peek once? 💗
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step === 'yes' && (
                <motion.button
                  key="yes"
                  type="button"
                  initial={{ opacity: 0, y: 16, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 14 }}
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    unlockAudio()
                    onYes()
                  }}
                  className="btn-primary px-12 text-lg"
                >
                  okay… YES 💖
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </StageShell>
  )
}
