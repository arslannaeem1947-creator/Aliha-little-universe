import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StageShell } from '../components/StageShell'
import { HER_NAME } from '../data/content'

type Props = { onNext: () => void }

type CakePhase = 'waiting' | 'layers' | 'candles' | 'lit' | 'blowing' | 'party'

const PARTY = ['🎉', '🎊', '💖', '✨', '⭐', '🎈', '💕', '🥳', '🌸', '💛']
/** Pause after blow so she can enjoy the party rain */
const PARTY_VIEW_MS = 3600

export function BloomStage({ onNext }: Props) {
  const [phase, setPhase] = useState(0)
  const [cakePhase, setCakePhase] = useState<CakePhase>('waiting')
  const [layersIn, setLayersIn] = useState(0)
  const [blowProgress, setBlowProgress] = useState(0)
  const [candlesLit, setCandlesLit] = useState(false)
  const [showNext, setShowNext] = useState(false)

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

  // Drop layers one by one: base → mid → top
  useEffect(() => {
    if (cakePhase !== 'layers') return
    if (layersIn >= 3) {
      // Short settle, then fade candles in
      const t = setTimeout(() => setCakePhase('candles'), 500)
      return () => clearTimeout(t)
    }
    // First layer almost immediately; each next waits for previous giggle to finish
    const delay = layersIn === 0 ? 280 : 900
    const t = setTimeout(() => setLayersIn((n) => n + 1), delay)
    return () => clearTimeout(t)
  }, [cakePhase, layersIn])

  // Candles fade in after top layer lands
  useEffect(() => {
    if (cakePhase !== 'candles') return
    setCandlesLit(true)
    const t = setTimeout(() => setCakePhase('lit'), 900)
    return () => clearTimeout(t)
  }, [cakePhase])

  // Blow hold progress
  useEffect(() => {
    if (cakePhase !== 'blowing') return
    if (blowProgress >= 100) {
      setCandlesLit(false)
      setCakePhase('party')
      setShowNext(false)
      return
    }
    const t = setTimeout(() => setBlowProgress((p) => Math.min(100, p + 4)), 40)
    return () => clearTimeout(t)
  }, [cakePhase, blowProgress])

  // After party starts, wait 3–4s before showing next button
  useEffect(() => {
    if (cakePhase !== 'party') return
    const t = setTimeout(() => {
      setShowNext(true)
      setPhase(3)
    }, PARTY_VIEW_MS)
    return () => clearTimeout(t)
  }, [cakePhase])

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
            {/* Cake stage — fixed slots so each layer falls into ITS place only */}
            <div className="relative h-[250px] w-[260px] overflow-visible">
              <div className="absolute bottom-1 left-1/2 h-4 w-52 -translate-x-1/2 rounded-[100%] bg-white/20 blur-[2px]" />

              {/* BASE slot */}
              <CakeLayer
                show={layersIn >= 1}
                width={210}
                height={56}
                bottom={0}
                fill="linear-gradient(180deg,#ffe9a8 0%,#ffd56a 100%)"
                frosting="#fff6c8"
                dot="#ff6b9d"
                dots={5}
                fallFrom={-320}
                tilt={-10}
              />

              {/* MID slot — falls directly onto mid height, never to base */}
              <CakeLayer
                show={layersIn >= 2}
                width={158}
                height={44}
                bottom={48}
                fill="linear-gradient(180deg,#ffb3d1 0%,#ff6b9d 100%)"
                frosting="#ffc4dc"
                dot="#fff"
                dots={4}
                fallFrom={-360}
                tilt={12}
              />

              {/* TOP slot — falls directly onto top height */}
              <CakeLayer
                show={layersIn >= 3}
                width={108}
                height={36}
                bottom={84}
                fill="linear-gradient(180deg,#fff5fb 0%,#ffd0e4 100%)"
                frosting="#ffffff"
                dot="#ff6b9d"
                dots={3}
                fallFrom={-400}
                tilt={-8}
                heart
              >
                {/* Candles planted into the top frosting */}
                <AnimatePresence>
                  {(cakePhase === 'candles' ||
                    cakePhase === 'lit' ||
                    cakePhase === 'blowing' ||
                    cakePhase === 'party') && (
                    <motion.div
                      key="candles"
                      className="absolute inset-x-1 z-20 flex items-end justify-center gap-1.5"
                      style={{ bottom: 28 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Candle
                          key={i}
                          index={i}
                          lit={candlesLit}
                          blowing={cakePhase === 'blowing'}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CakeLayer>

              {cakePhase === 'blowing' && (
                <motion.div
                  className="pointer-events-none absolute left-[8%] top-[8%] z-40 text-2xl"
                  animate={{ x: [0, 55], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.4 }}
                >
                  💨
                </motion.div>
              )}
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-20 left-1/2 h-16 w-[70%] max-w-md -translate-x-1/2 rounded-[100%] bg-rose/30 blur-2xl"
            />

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

                {cakePhase === 'party' && !showNext && (
                  <motion.p
                    key="enjoy"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-display text-lg font-extrabold text-gold-soft"
                  >
                    make a wish — candles out! ✨
                  </motion.p>
                )}

                {cakePhase === 'party' && showNext && (
                  <motion.div
                    key="next"
                    initial={{ opacity: 0, y: 12, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="font-display text-lg font-extrabold text-gold-soft">
                      ready for more? 💗
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

function CakeLayer({
  show,
  width,
  height,
  bottom,
  fill,
  frosting,
  dot,
  dots,
  fallFrom,
  tilt,
  heart,
  children,
}: {
  show: boolean
  width: number
  height: number
  bottom: number
  fill: string
  frosting: string
  dot: string
  dots: number
  fallFrom: number
  tilt: number
  heart?: boolean
  children?: ReactNode
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`layer-${bottom}`}
          className="absolute left-1/2"
          style={{
            bottom,
            width,
            marginLeft: -width / 2,
            zIndex: 10 + Math.round(bottom / 10),
          }}
          initial={{ y: fallFrom, opacity: 0, rotate: tilt }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            // Tween fall into THIS slot only — no bounce that looks like climbing from base
            y: { duration: 0.72, ease: [0.22, 1.1, 0.36, 1] },
            opacity: { duration: 0.18 },
            rotate: { duration: 0.72, ease: 'easeOut' },
          }}
        >
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: [0, -2.5, 2.2, -1.2, 0], scale: [1, 1.02, 0.99, 1] }}
            transition={{ duration: 0.42, delay: 0.68, ease: 'easeOut' }}
            className="relative"
          >
            <div
              className="rounded-[1.15rem] border-[3px] border-white shadow-[0_8px_0_rgba(0,0,0,0.14)]"
              style={{ height, background: fill }}
            />
            <div
              className="absolute left-1/2 top-0 z-[1] h-[14px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-2 border-white/85"
              style={{ width: '94%', background: frosting }}
            />
            <div className="absolute inset-x-4 top-1/2 z-[1] flex -translate-y-1/2 justify-around">
              {Array.from({ length: dots }).map((_, d) => (
                <span
                  key={d}
                  className="h-2.5 w-2.5 rounded-full border border-white/60 shadow-sm"
                  style={{ background: dot }}
                />
              ))}
            </div>
            {heart && (
              <span className="pointer-events-none absolute left-1/2 top-[42%] z-[2] -translate-x-1/2 -translate-y-1/2 text-sm drop-shadow-sm">
                ❤️
              </span>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const wax = ['#ff7aa8', '#6eb8ff', '#ffe066', '#b8a0ff', '#ff9ec7'][index]
  const waxDeep = ['#e04878', '#3d8fd4', '#e0b020', '#7a62d4', '#e070a0'][index]

  return (
    <div className="relative flex w-[18px] flex-col items-center">
      <AnimatePresence>
        {lit && (
          <motion.div
            key="flame"
            className="relative z-[2] mb-[-1px] h-[18px] w-[11px] origin-bottom"
            initial={{ opacity: 0, scale: 0.35, y: 3 }}
            animate={
              blowing
                ? {
                    opacity: [1, 0.45, 0.75, 0.15],
                    scaleY: [1, 0.4, 0.65, 0.2],
                    x: [0, 2, -3, 1],
                    rotate: [0, 10, -14, 6],
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    scaleY: [1, 1.18, 0.9, 1.12, 1],
                    x: [0, 0.35, -0.35, 0],
                  }
            }
            exit={{ opacity: 0, scale: 0, y: -3, transition: { duration: 0.2 } }}
            transition={{
              opacity: { duration: 0.4, delay: index * 0.06 },
              scale: { duration: 0.4, delay: index * 0.06 },
              scaleY: {
                repeat: Infinity,
                duration: blowing ? 0.2 : 0.52 + index * 0.05,
                ease: 'easeInOut',
              },
              x: { repeat: Infinity, duration: blowing ? 0.16 : 0.6 },
              rotate: { repeat: Infinity, duration: 0.18 },
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
                background:
                  'radial-gradient(circle at 50% 72%, #fffce8 0%, #ffe566 28%, #ffb347 58%, #ff6b35 100%)',
                boxShadow:
                  '0 0 8px rgba(255, 200, 80, 0.95), 0 0 16px rgba(255, 120, 40, 0.5)',
              }}
            />
            <div className="absolute left-1/2 top-[38%] h-[7px] w-[4px] -translate-x-1/2 rounded-full bg-white/85" />
          </motion.div>
        )}
      </AnimatePresence>

      {!lit && (
        <motion.span
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: [0, 0.55, 0], y: [0, -10] }}
          transition={{ duration: 0.9, delay: index * 0.04 }}
          className="mb-[-1px] text-[8px] leading-none text-white/40"
        >
          ☁️
        </motion.span>
      )}

      <div className="z-[1] h-[5px] w-[1.5px] rounded-full bg-[#2a1a36]/90" />

      {/* Glossy wax with soft drip tip into frosting */}
      <div className="relative">
        <div
          className="relative h-8 w-[8px] overflow-hidden rounded-[4px_4px_2px_2px] border border-white/55 shadow-[1px_2px_0_rgba(0,0,0,0.14)]"
          style={{
            background: `linear-gradient(90deg, ${waxDeep} 0%, ${wax} 32%, #ffffffcc 48%, ${wax} 68%, ${waxDeep} 100%)`,
          }}
        >
          <div className="absolute inset-y-1.5 left-[1.5px] w-[1.5px] rounded-full bg-white/50" />
          <div
            className="absolute bottom-0 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-b-full opacity-80"
            style={{ background: wax }}
          />
        </div>
        <div
          className="absolute -bottom-0.5 left-1/2 h-1.5 w-2.5 -translate-x-1/2 rounded-[50%]"
          style={{ background: waxDeep, opacity: 0.55 }}
        />
      </div>
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
