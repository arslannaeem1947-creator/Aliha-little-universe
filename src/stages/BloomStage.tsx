import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StageShell } from '../components/StageShell'
import { HER_NAME } from '../data/content'

type Props = { onNext: () => void }

type CakePhase = 'waiting' | 'layers' | 'lit' | 'blowing' | 'party'

const LAYER_COLORS = [
  { fill: 'linear-gradient(180deg,#ffe9a8 0%,#ffd56a 100%)', width: 200, label: 'base' },
  { fill: 'linear-gradient(180deg,#ffb3d1 0%,#ff6b9d 100%)', width: 150, label: 'mid' },
  { fill: 'linear-gradient(180deg,#fff5fb 0%,#ffd0e4 100%)', width: 100, label: 'top' },
] as const

const PARTY = ['🎉', '🎊', '💖', '✨', '⭐', '🎈', '💕', '🥳', '🌸', '💛']

export function BloomStage({ onNext }: Props) {
  const [phase, setPhase] = useState(0)
  const [cakePhase, setCakePhase] = useState<CakePhase>('waiting')
  const [layersIn, setLayersIn] = useState(0)
  const [blowProgress, setBlowProgress] = useState(0)
  const [candlesLit, setCandlesLit] = useState(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 5) % 96}%`,
        top: `${(i * 13 + 4) % 48}%`,
        size: 3 + (i % 4),
        delay: (i % 7) * 0.25,
        dur: 1.8 + (i % 5) * 0.35,
      })),
    [],
  )

  const lanterns = useMemo(
    () => [
      { left: '8%', delay: 0, scale: 0.85, hue: '#ff9ec7' },
      { left: '22%', delay: 0.4, scale: 1, hue: '#ffd56a' },
      { left: '72%', delay: 0.2, scale: 0.9, hue: '#c9b6ff' },
      { left: '86%', delay: 0.7, scale: 1.05, hue: '#7ec8ff' },
    ],
    [],
  )

  const partyBits = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        left: `${(i * 7.3) % 100}%`,
        delay: (i % 12) * 0.12,
        dur: 2.4 + (i % 5) * 0.35,
        emoji: PARTY[i % PARTY.length],
        rot: (i % 2 === 0 ? 1 : -1) * (20 + (i % 40)),
        size: 16 + (i % 5) * 4,
      })),
    [],
  )

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 500)
    const b = setTimeout(() => {
      setPhase(2)
      setCakePhase('layers')
    }, 1400)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  // Drop layers one by one
  useEffect(() => {
    if (cakePhase !== 'layers') return
    if (layersIn >= 3) {
      const t = setTimeout(() => {
        setCandlesLit(true)
        setCakePhase('lit')
      }, 450)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLayersIn((n) => n + 1), layersIn === 0 ? 200 : 650)
    return () => clearTimeout(t)
  }, [cakePhase, layersIn])

  // Blow hold progress
  useEffect(() => {
    if (cakePhase !== 'blowing') return
    if (blowProgress >= 100) {
      setCandlesLit(false)
      setCakePhase('party')
      setPhase(3)
      return
    }
    const t = setTimeout(() => setBlowProgress((p) => Math.min(100, p + 4)), 40)
    return () => clearTimeout(t)
  }, [cakePhase, blowProgress])

  const startBlow = () => {
    if (cakePhase !== 'lit') return
    setBlowProgress(0)
    setCakePhase('blowing')
  }

  const stopBlowEarly = () => {
    if (cakePhase !== 'blowing' || blowProgress >= 100) return
    setCakePhase('lit')
    setBlowProgress(0)
  }

  return (
    <StageShell mascot={false} noGround noAmbient noSkyDecor className="!pb-8 !pt-8">
      <div className="relative flex min-h-[min(88dvh,760px)] w-full flex-col overflow-hidden text-blush">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 78% 12%, rgba(255, 213, 106, 0.35), transparent 42%),
              radial-gradient(ellipse at 20% 30%, rgba(255, 107, 157, 0.28), transparent 48%),
              radial-gradient(ellipse at 50% 85%, rgba(90, 40, 90, 0.45), transparent 55%),
              linear-gradient(180deg, #2a1f4a 0%, #3d2f66 28%, #5a3d7a 52%, #8a4a6a 78%, #c96b7a 100%)
            `,
          }}
        />

        {/* Party particles falling from top */}
        <AnimatePresence>
          {cakePhase === 'party' && (
            <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
              {partyBits.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute"
                  style={{ left: p.left, top: '-8%', fontSize: p.size }}
                  initial={{ y: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    y: '110dvh',
                    opacity: [0, 1, 1, 0.8, 0],
                    rotate: p.rot * 3,
                    x: [0, (p.id % 2 === 0 ? 30 : -30), 0],
                  }}
                  transition={{
                    duration: p.dur,
                    delay: p.delay,
                    ease: 'easeIn',
                    repeat: Infinity,
                    repeatDelay: 0.4,
                  }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex min-h-[min(88dvh,760px)] w-full flex-col">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            {stars.map((s) => (
              <motion.span
                key={s.id}
                className="absolute rounded-full bg-gold-soft"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  boxShadow: '0 0 8px rgba(255,229,102,0.8)',
                }}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.3, 0.8] }}
                transition={{
                  repeat: Infinity,
                  duration: s.dur,
                  delay: s.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.div
            className="pointer-events-none absolute right-[10%] top-[8%] z-10 md:right-[14%] md:top-[10%]"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14 }}
          >
            <div className="relative h-20 w-20 md:h-28 md:w-28">
              <div className="absolute inset-[-30%] rounded-full bg-gold/20 blur-2xl" />
              <svg viewBox="0 0 100 100" className="relative h-full w-full drop-shadow-[0_0_24px_rgba(255,229,102,0.45)]">
                <defs>
                  <radialGradient id="moonGlow" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fffef0" />
                    <stop offset="55%" stopColor="#ffe9a8" />
                    <stop offset="100%" stopColor="#ffd56a" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="36" fill="url(#moonGlow)" />
                <circle cx="62" cy="42" r="28" fill="#3d2f66" opacity="0.35" />
              </svg>
            </div>
          </motion.div>

          <div className="relative z-30 shrink-0 px-3 pt-2 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-sm font-bold tracking-[0.2em] text-gold-soft/80 uppercase md:text-base"
            >
              tonight is yours
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 14 }}
              className="mt-3 font-display text-4xl font-extrabold leading-[1.1] text-transparent md:text-6xl"
              style={{
                backgroundImage: 'linear-gradient(135deg, #fff5fb 0%, #ffb3d1 40%, #ffe566 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 20px rgba(255,107,157,0.35))',
              }}
            >
              Happy Birthday
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
              className="mt-2 font-display text-2xl font-extrabold text-gold-soft md:text-4xl"
            >
              {HER_NAME}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              className="mx-auto mt-3 max-w-md font-display text-base font-semibold text-blush/75 md:text-lg"
            >
              a little universe lit just for you — soft lights, warmer wishes
            </motion.p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[22%] z-20 h-[40%]" aria-hidden>
            {lanterns.map((l, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0"
                style={{ left: l.left }}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  phase >= 1
                    ? { opacity: 1, y: [0, -18, 0], x: [0, i % 2 === 0 ? 6 : -6, 0] }
                    : { opacity: 0, y: 40 }
                }
                transition={{
                  opacity: { duration: 0.5, delay: l.delay },
                  y: { repeat: Infinity, duration: 4 + i * 0.5, ease: 'easeInOut', delay: l.delay },
                  x: { repeat: Infinity, duration: 5 + i * 0.4, ease: 'easeInOut', delay: l.delay },
                }}
              >
                <Lantern color={l.hue} scale={l.scale} />
              </motion.div>
            ))}
          </div>

          <div className="relative z-30 mt-2 flex flex-1 flex-col items-center justify-end pb-4">
            <div className="relative flex flex-col items-center">
              {/* Candles sit on top once layers are in */}
              {layersIn >= 3 && (
                <div className="relative z-20 mb-[-8px] flex items-end gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Candle key={i} index={i} lit={candlesLit} blowing={cakePhase === 'blowing'} />
                  ))}
                </div>
              )}

              {/* Cake layers falling one-by-one */}
              <div className="relative flex w-[280px] flex-col-reverse items-center">
                <div className="absolute -bottom-2 left-1/2 h-5 w-56 -translate-x-1/2 rounded-[100%] bg-white/25 blur-[2px]" />

                {LAYER_COLORS.map((layer, index) => {
                  const visible = layersIn > index
                  const height = index === 0 ? 58 : index === 1 ? 46 : 38
                  return (
                    <motion.div
                      key={layer.label}
                      className="relative z-10"
                      style={{ marginBottom: index === 0 ? 0 : -10, width: layer.width }}
                      initial={{ y: -420, opacity: 0, rotate: -12 }}
                      animate={
                        visible
                          ? {
                              y: 0,
                              opacity: 1,
                              rotate: [0, -3, 3, -2, 2, -1, 0],
                              scale: [1, 1.04, 0.98, 1.02, 1],
                            }
                          : { y: -420, opacity: 0, rotate: -12 }
                      }
                      transition={
                        visible
                          ? {
                              y: { type: 'spring', stiffness: 220, damping: 14, mass: 0.9 },
                              opacity: { duration: 0.2 },
                              rotate: { duration: 0.7, delay: 0.15 },
                              scale: { duration: 0.55, delay: 0.1 },
                            }
                          : { duration: 0 }
                      }
                    >
                      <div
                        className="rounded-[1.1rem] border-[3px] border-white shadow-[0_8px_0_rgba(0,0,0,0.12)]"
                        style={{
                          height,
                          background: layer.fill,
                        }}
                      />
                      {/* frosting oval top */}
                      <div
                        className="absolute left-1/2 top-0 h-4 -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-2 border-white/80"
                        style={{
                          width: '92%',
                          background:
                            index === 0 ? '#fff6c8' : index === 1 ? '#ffc4dc' : '#ffffff',
                        }}
                      />
                      {/* dots */}
                      <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-around">
                        {Array.from({ length: index === 0 ? 5 : 4 }).map((_, d) => (
                          <span
                            key={d}
                            className="h-2.5 w-2.5 rounded-full border border-white/70"
                            style={{
                              background: index === 1 ? '#fff' : '#ff6b9d',
                              opacity: index === 2 ? 0.5 : 1,
                            }}
                          />
                        ))}
                      </div>
                      {index === 2 && (
                        <span className="absolute left-1/2 top-[-18px] -translate-x-1/2 text-lg">❤️</span>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Blow wind lines while blowing */}
              {cakePhase === 'blowing' && (
                <motion.div
                  className="pointer-events-none absolute -left-8 top-2 z-30 text-2xl"
                  animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.45 }}
                >
                  💨
                </motion.div>
              )}
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-20 left-1/2 h-16 w-[70%] max-w-md -translate-x-1/2 rounded-[100%] bg-rose/30 blur-2xl"
            />

            {/* Blow CTA */}
            <div className="relative z-30 mt-8 flex min-h-[5.5rem] flex-col items-center justify-center gap-3">
              <AnimatePresence mode="wait">
                {cakePhase === 'lit' && (
                  <motion.div
                    key="blow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="font-display text-sm font-bold text-gold-soft/90">
                      hold to blow the candles 🕯️
                    </p>
                    <motion.button
                      type="button"
                      className="btn-primary px-10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.94 }}
                      onMouseDown={startBlow}
                      onMouseUp={stopBlowEarly}
                      onMouseLeave={stopBlowEarly}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        startBlow()
                      }}
                      onTouchEnd={stopBlowEarly}
                      onTouchCancel={stopBlowEarly}
                    >
                      💨 Blow candles
                    </motion.button>
                  </motion.div>
                )}

                {cakePhase === 'blowing' && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-56"
                  >
                    <p className="mb-2 text-center font-display text-sm font-extrabold text-gold-soft">
                      keep blowing… {blowProgress}%
                    </p>
                    <div className="h-3 overflow-hidden rounded-full border-2 border-white/40 bg-white/15">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-sunny to-rose"
                        style={{ width: `${blowProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}

                {cakePhase === 'party' && (
                  <motion.div
                    key="next"
                    initial={{ opacity: 0, y: 12, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.35 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="font-display text-lg font-extrabold text-gold-soft">
                      make a wish — candles out! ✨
                    </p>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06, rotate: -1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={onNext}
                      className="btn-primary"
                    >
                      open our little gallery →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  )
}

function Candle({
  index,
  lit,
  blowing,
}: {
  index: number
  lit: boolean
  blowing: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {lit && (
          <motion.div
            key="flame"
            className="mb-0.5 h-4 w-2.5 origin-bottom rounded-full"
            style={{
              background: 'linear-gradient(180deg, #fff6b0, #ff9a3c)',
              boxShadow: '0 0 14px rgba(255,180,60,0.9)',
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={
              blowing
                ? { scaleY: [1, 0.4, 0.7, 0.2], opacity: [1, 0.6, 0.8, 0.3], x: [0, 3, -4, 2], rotate: [0, 12, -18, 8] }
                : { scaleY: [0.85, 1.2, 0.9, 1.15, 0.85], opacity: 1, x: [0, 0.5, -0.5, 0] }
            }
            exit={{ scaleY: 0, opacity: 0, y: -6, transition: { duration: 0.25 } }}
            transition={{
              scaleY: { repeat: Infinity, duration: blowing ? 0.25 : 0.55 + index * 0.07, ease: 'easeInOut' },
              x: { repeat: Infinity, duration: blowing ? 0.2 : 0.7 },
              rotate: { repeat: Infinity, duration: 0.22 },
            }}
          />
        )}
      </AnimatePresence>
      {!lit && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: [0, 0.7, 0], y: [-2, -14] }}
          transition={{ duration: 1.1, delay: index * 0.05 }}
          className="mb-0.5 text-[10px] text-white/50"
        >
          ☁️
        </motion.span>
      )}
      <div
        className="h-9 w-2 rounded-sm border border-white/40"
        style={{
          background: ['#ff6b9d', '#7ec8ff', '#ffe566', '#c9b6ff', '#ff9ec7'][index],
        }}
      />
    </div>
  )
}

function Lantern({ color, scale }: { color: string; scale: number }) {
  return (
    <div style={{ transform: `scale(${scale})` }} className="flex flex-col items-center">
      <div className="h-3 w-8 rounded-t-md border-2 border-white/40" style={{ background: color }} />
      <div
        className="relative flex h-14 w-11 items-center justify-center rounded-md border-2 border-white/50 shadow-[0_0_24px_rgba(255,213,106,0.45)]"
        style={{
          background: `linear-gradient(180deg, ${color} 0%, #fff5e6 55%, ${color} 100%)`,
        }}
      >
        <motion.div
          className="h-6 w-3 rounded-full bg-sunny/90"
          animate={{ opacity: [0.55, 1, 0.55], scaleY: [0.9, 1.15, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 16px rgba(255,229,102,0.9)' }}
        />
      </div>
      <div className="h-5 w-px bg-white/35" />
    </div>
  )
}
