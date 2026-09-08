import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PASSCODE, PASSCODE_SHUFFLE_CAPTION, WRONG_ROASTS, HER_NAME } from '../data/content'
import { StageShell } from '../components/StageShell'
import { useMusic } from '../components/MusicToggle'

type Props = { onUnlock: () => void }

const BASE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'] as const

function shuffleDigits(keys: readonly string[]): string[] {
  const digits = keys.filter((k) => k !== '' && k !== '⌫')
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[digits[i], digits[j]] = [digits[j], digits[i]]
  }
  let d = 0
  return keys.map((k) => {
    if (k === '' || k === '⌫') return k
    return digits[d++]
  })
}

export function PasscodeStage({ onUnlock }: Props) {
  const { unlockAudio } = useMusic()
  const [digits, setDigits] = useState('')
  const digitsRef = useRef('')
  const [shake, setShake] = useState(false)
  const [roastIndex, setRoastIndex] = useState(-1)
  const [showFail, setShowFail] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [keys, setKeys] = useState<string[]>(() => [...BASE_KEYS])
  const locking = useRef(false)
  const shuffleOn = wrongAttempts >= 1

  const dots = useMemo(() => Array.from({ length: 4 }, (_, i) => i < digits.length), [digits])

  const maybeReshuffle = (nextLen: number) => {
    if (wrongAttempts < 1) return
    // Reshuffle after each digit once the prank kicks in
    if (nextLen > 0) {
      setKeys(shuffleDigits(BASE_KEYS))
    }
  }

  const press = (key: string) => {
    unlockAudio()
    if (locking.current) return

    if (key === '⌫') {
      const next = digitsRef.current.slice(0, -1)
      digitsRef.current = next
      setDigits(next)
      return
    }
    if (!key || digitsRef.current.length >= 4) return

    const next = digitsRef.current + key
    digitsRef.current = next
    setDigits(next)
    maybeReshuffle(next.length)

    if (next.length < 4) return

    locking.current = true
    if (next === PASSCODE) {
      setTimeout(() => onUnlock(), 280)
      return
    }

    setShowFail(true)
    setShake(true)
    setWrongAttempts((n) => n + 1)
    setRoastIndex((i) => (i + 1) % WRONG_ROASTS.length)
    setTimeout(() => {
      setShake(false)
      digitsRef.current = ''
      setDigits('')
      locking.current = false
      setKeys(shuffleDigits(BASE_KEYS))
    }, 450)
  }

  const pressRef = useRef(press)
  pressRef.current = press

  useEffect(() => {
    if (showFail) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        pressRef.current(e.key)
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        pressRef.current('⌫')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showFail])

  if (showFail && digits.length === 0 && roastIndex >= 0) {
    return (
      <StageShell mascot="shy">
        <div className="mx-auto max-w-md text-center">
          <div className="glass-card rounded-[2rem] px-8 py-12">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 14 }}
              className="font-display text-4xl font-extrabold text-rose-deep md:text-5xl"
            >
              Wrong passcode!
            </motion.h1>
            <p className="mt-4 font-display text-2xl text-ink/75">{WRONG_ROASTS[roastIndex]}</p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setShowFail(false)
                locking.current = false
              }}
              className="btn-primary mt-10"
            >
              Try again
            </motion.button>
          </div>
        </div>
      </StageShell>
    )
  }

  return (
    <StageShell mascot="wave">
      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-petal via-sky/30 to-sunny/40 blur-md" />
          <motion.div
            animate={{ rotate: [0, -3, 3, 0], y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            className="relative flex h-[86%] w-[86%] items-center justify-center rounded-[2.2rem] border-[5px] border-white bg-gradient-to-b from-white to-petal shadow-[0_8px_0_rgba(255,107,157,0.2),0_22px_50px_rgba(255,107,157,0.25)]"
          >
            <CuteHeart size={88} />
            <span className="absolute -left-2 top-6 text-3xl">⭐</span>
            <span className="absolute -right-1 bottom-8 text-2xl">🎈</span>
            <span className="absolute right-4 top-4 text-xl">✨</span>
          </motion.div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 text-center md:text-left">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose/80">
            Private portal
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-5xl">
            Enter passcode,
            <br />
            <span className="text-rose-deep">{HER_NAME}</span>
          </h1>

          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
            className="mt-8 flex justify-center gap-3 md:justify-start"
          >
            {dots.map((filled, i) => (
              <motion.div
                key={i}
                animate={filled ? { scale: [0.8, 1.15, 1] } : {}}
                className={`flex h-14 w-12 items-center justify-center rounded-2xl border-[3px] text-2xl font-extrabold transition ${
                  filled
                    ? 'border-white bg-gradient-to-b from-rose to-rose-deep text-white shadow-[0_4px_0_rgba(224,72,120,0.5)]'
                    : 'border-petal bg-white/90 text-transparent'
                }`}
              >
                •
              </motion.div>
            ))}
          </motion.div>

          {shuffleOn && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm font-bold text-ink/55"
            >
              {PASSCODE_SHUFFLE_CAPTION}
            </motion.p>
          )}

          <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-3 md:mx-0">
            {keys.map((key, idx) =>
              key === '' ? (
                <div key={`empty-${idx}`} />
              ) : (
                <motion.button
                  key={`${key}-${idx}-${shuffleOn ? 's' : 'n'}`}
                  type="button"
                  layout
                  whileHover={{ scale: 1.08, rotate: key === '⌫' ? 0 : -3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => press(key)}
                  className="h-14 rounded-2xl border-[3px] border-white bg-white text-xl font-extrabold text-rose-deep shadow-[0_4px_0_rgba(255,107,157,0.18)]"
                >
                  {key}
                </motion.button>
              ),
            )}
          </div>
        </div>
      </div>
    </StageShell>
  )
}

function CuteHeart({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className="sticker">
      <path
        d="M50 88 C20 65 8 48 8 32 C8 18 18 10 30 10 C40 10 47 16 50 22 C53 16 60 10 70 10 C82 10 92 18 92 32 C92 48 80 65 50 88Z"
        fill="#ff6b9d"
        stroke="#fff"
        strokeWidth="5"
      />
      <ellipse cx="34" cy="30" rx="8" ry="5" fill="#fff" opacity="0.55" />
    </svg>
  )
}
