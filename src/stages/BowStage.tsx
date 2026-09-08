import { useId, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  animate,
} from 'framer-motion'
import { StageShell } from '../components/StageShell'
import { useMusic } from '../components/MusicToggle'
import { HER_NAME } from '../data/content'

type Props = { onComplete: () => void }

type Particle = {
  id: number
  x: number
  y: number
  color: string
  rot: number
  size: number
  emoji?: string
}

const CONFETTI = ['#ff6b9d', '#7ec8ff', '#ffe566', '#7eefc5', '#c9b6ff', '#ff9ec7', '#fff', '#ffb3d1']

/** Scene geometry (viewBox 0 0 640 360) */
const TIP_X = 198
const TOP_Y = 48
const BOT_Y = 312
const MID_Y = 180
const REST_STRING_X = 198
const MAX_DRAW = 92
const ARROW_LEN = 168
const BALLOON_CX = 520
const BALLOON_CY = 150

export function BowStage({ onComplete }: Props) {
  const { unlockAudio } = useMusic()
  const [shot, setShot] = useState(false)
  const [flying, setFlying] = useState(false)
  const [hit, setHit] = useState(false)
  const [shake, setShake] = useState(false)
  const [stringBuzz, setStringBuzz] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const finishing = useRef(false)
  const dragStartX = useRef(0)
  const dragStartPull = useRef(0)
  const drawing = useRef(false)

  const pull = useMotionValue(0)
  const stringMidX = useTransform(pull, [0, 100], [REST_STRING_X, REST_STRING_X - MAX_DRAW])
  const stringPath = useMotionTemplate`M ${TIP_X} ${TOP_Y} Q ${stringMidX} ${MID_Y} ${TIP_X} ${BOT_Y}`
  const limbBend = useTransform(pull, [0, 100], [0, 7])
  const tensionGlow = useTransform(pull, [0, 100], [0, 0.55])
  const hintOpacity = useTransform(pull, [0, 18], [1, 0])
  const arrowGroupX = useTransform(pull, [0, 100], [0, -MAX_DRAW])

  const flightX = useMotionValue(0)
  const flightY = useMotionValue(0)
  const flightOpacity = useMotionValue(1)
  const flightRotate = useMotionValue(0)

  const burst = () => {
    setParticles(
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: -20 - Math.random() * 200,
        color: CONFETTI[i % CONFETTI.length],
        rot: Math.random() * 420,
        size: 6 + Math.random() * 14,
        emoji: i % 5 === 0 ? '💖' : i % 7 === 0 ? '✨' : i % 9 === 0 ? '💕' : undefined,
      })),
    )
  }

  const impactAndFinish = () => {
    setFlying(false)
    setHit(true)
    setShake(true)
    burst()
    setTimeout(() => setShake(false), 480)
    setTimeout(onComplete, 1400)
  }

  const finish = (fromSkip = false) => {
    if (finishing.current) return
    finishing.current = true
    setShot(true)
    unlockAudio()

    if (fromSkip) {
      void animate(pull, 0, { type: 'spring', stiffness: 520, damping: 18 })
      setTimeout(impactAndFinish, 220)
      return
    }

    void animate(pull, 0, { type: 'spring', stiffness: 640, damping: 14 })
    setStringBuzz(true)
    setTimeout(() => setStringBuzz(false), 420)

    setFlying(true)
    flightX.set(0)
    flightY.set(0)
    flightOpacity.set(1)
    flightRotate.set(-4)
    void animate(flightX, 268, { duration: 0.42, ease: [0.2, 0.8, 0.3, 1] })
    void animate(flightY, -18, { duration: 0.42, ease: [0.35, 0.1, 0.25, 1] })
    void animate(flightRotate, 6, { duration: 0.42, ease: 'easeOut' })

    setTimeout(() => {
      void animate(flightOpacity, 0, { duration: 0.12 })
      impactAndFinish()
    }, 400)
  }

  const beginDraw = (clientX: number) => {
    if (shot) return
    drawing.current = true
    dragStartX.current = clientX
    dragStartPull.current = pull.get()
    unlockAudio()
  }

  const moveDraw = (clientX: number) => {
    if (!drawing.current || shot) return
    const dx = dragStartX.current - clientX
    const next = Math.min(100, Math.max(0, dragStartPull.current + dx * 0.72))
    pull.set(next)
  }

  const endDraw = () => {
    if (!drawing.current || shot) return
    drawing.current = false
    unlockAudio()
    const amount = pull.get()
    if (amount < 28) {
      void animate(pull, 0, { type: 'spring', stiffness: 420, damping: 16 })
      return
    }
    finish(false)
  }

  return (
    <StageShell mascot="cheer" noGround={false}>
      <motion.div
        className="relative flex min-h-[min(78dvh,640px)] w-full flex-col"
        animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.42 }}
      >
        <div className="relative z-20 text-center">
          <p className="font-display text-base font-bold text-ink/55 md:text-lg">
            a little something, for {HER_NAME}
          </p>
          <h1 className="mt-1 font-display text-4xl font-extrabold text-rose-deep drop-shadow-sm md:text-6xl">
            Pull & release
          </h1>
          <p className="mt-2 font-semibold text-ink/60">
            Draw the <span className="text-rose-deep">arrow</span> back, then let go!
          </p>
        </div>

        <div className="relative mt-2 flex flex-1 items-center justify-center">
          <span className="absolute left-[5%] top-[10%] text-2xl opacity-65">☁️</span>
          <span className="absolute right-[22%] top-[6%] text-xl opacity-55">✨</span>
          <span className="absolute left-[18%] bottom-[22%] text-lg opacity-45">🌸</span>

          <div className="relative w-full max-w-3xl touch-none">
            <svg
              viewBox="0 0 640 360"
              className="mx-auto h-[min(58dvh,420px)] w-full select-none"
              aria-hidden
            >
              <defs>
                <linearGradient id="bowWood" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e0b07a" />
                  <stop offset="40%" stopColor="#c48a4a" />
                  <stop offset="75%" stopColor="#8a5528" />
                  <stop offset="100%" stopColor="#5c3418" />
                </linearGradient>
                <linearGradient id="bowHighlight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f3d5a8" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#f3d5a8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f3d5a8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gripWrap" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4a2a16" />
                  <stop offset="50%" stopColor="#6b3f1c" />
                  <stop offset="100%" stopColor="#3d2210" />
                </linearGradient>
                <linearGradient id="shaftGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d4a574" />
                  <stop offset="50%" stopColor="#b8844a" />
                  <stop offset="100%" stopColor="#8a5a2b" />
                </linearGradient>
                <radialGradient id="heartTip" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffb3d1" />
                  <stop offset="55%" stopColor="#ff6b9d" />
                  <stop offset="100%" stopColor="#d63a72" />
                </radialGradient>
                <filter id="bowShadow" x="-20%" y="-10%" width="140%" height="130%">
                  <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#3d2a4a" floodOpacity="0.22" />
                </filter>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <ellipse cx="150" cy="338" rx="70" ry="12" fill="#3d2a4a" opacity="0.1" />

              <motion.g
                style={{ rotate: limbBend }}
                transform-origin={`${TIP_X - 40} ${MID_Y}`}
                filter="url(#bowShadow)"
              >
                <path
                  d="M198 48
                     C170 55 132 78 118 120
                     C108 152 108 168 112 180
                     C108 192 108 208 118 240
                     C132 282 170 305 198 312"
                  fill="none"
                  stroke="#5c3418"
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M198 48
                     C170 55 132 78 118 120
                     C108 152 108 168 112 180
                     C108 192 108 208 118 240
                     C132 282 170 305 198 312"
                  fill="none"
                  stroke="url(#bowWood)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M190 58
                     C166 66 136 88 124 124
                     C116 152 116 168 120 180
                     C116 192 116 208 124 236
                     C136 272 166 294 190 302"
                  fill="none"
                  stroke="url(#bowHighlight)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <circle cx="198" cy="48" r="7" fill="#8a5528" stroke="#fff" strokeWidth="2" />
                <circle cx="198" cy="48" r="3" fill="#3d2210" />
                <circle cx="198" cy="312" r="7" fill="#8a5528" stroke="#fff" strokeWidth="2" />
                <circle cx="198" cy="312" r="3" fill="#3d2210" />
              </motion.g>

              <rect
                x="98"
                y="158"
                width="28"
                height="44"
                rx="8"
                fill="url(#gripWrap)"
                stroke="#fff"
                strokeWidth="2.5"
              />
              <path d="M102 168 H122" stroke="#c48a4a" strokeWidth="1.8" opacity="0.65" />
              <path d="M102 176 H122" stroke="#c48a4a" strokeWidth="1.8" opacity="0.65" />
              <path d="M102 184 H122" stroke="#c48a4a" strokeWidth="1.8" opacity="0.65" />
              <path d="M102 192 H122" stroke="#c48a4a" strokeWidth="1.8" opacity="0.65" />

              <motion.ellipse
                cx={REST_STRING_X - 20}
                cy={MID_Y}
                rx={40}
                ry={70}
                fill="#ff6b9d"
                style={{ opacity: tensionGlow }}
              />

              <motion.path
                d={stringPath}
                fill="none"
                stroke="#3d2a4a"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="0.2"
              />
              <motion.path
                d={stringPath}
                fill="none"
                stroke="#fff8f0"
                strokeWidth="2.4"
                strokeLinecap="round"
                animate={stringBuzz ? { x: [0, -2, 2, -1.5, 1.5, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                filter="url(#softGlow)"
              />
              <motion.path
                d={stringPath}
                fill="none"
                stroke="#e8d5c0"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.9"
              />

              {!shot && (
                <motion.g style={{ x: arrowGroupX }}>
                  <ArrowGraphic tipX={REST_STRING_X + ARROW_LEN} nockX={REST_STRING_X} cy={MID_Y} />
                  <rect
                    x={REST_STRING_X - 28}
                    y={MID_Y - 36}
                    width={ARROW_LEN + 48}
                    height={72}
                    fill="transparent"
                    className="cursor-grab"
                    style={{ touchAction: 'none' }}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      ;(e.target as Element).setPointerCapture?.(e.pointerId)
                      beginDraw(e.clientX)
                    }}
                    onPointerMove={(e) => {
                      if (!drawing.current) return
                      e.preventDefault()
                      moveDraw(e.clientX)
                    }}
                    onPointerUp={(e) => {
                      e.preventDefault()
                      endDraw()
                    }}
                    onPointerCancel={endDraw}
                  />
                </motion.g>
              )}

              {flying && (
                <motion.g style={{ x: flightX, y: flightY, opacity: flightOpacity, rotate: flightRotate }}>
                  <ArrowGraphic tipX={REST_STRING_X + ARROW_LEN} nockX={REST_STRING_X} cy={MID_Y} />
                  <motion.rect
                    x={REST_STRING_X - 70}
                    y={MID_Y - 3}
                    width={64}
                    height={6}
                    rx={3}
                    fill="url(#shaftGrad)"
                    opacity={0.35}
                    animate={{ opacity: [0.5, 0], x: [-10, -40] }}
                    transition={{ duration: 0.35 }}
                  />
                </motion.g>
              )}

              <LatexBalloon cx={BALLOON_CX} cy={BALLOON_CY} popped={hit} />
            </svg>

            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="pointer-events-none absolute z-40"
                style={{
                  left: '82%',
                  top: '36%',
                  width: p.emoji ? undefined : p.size,
                  height: p.emoji ? undefined : p.size,
                  background: p.emoji ? undefined : p.color,
                  borderRadius: p.emoji ? undefined : p.id % 2 === 0 ? 3 : '50%',
                  fontSize: p.emoji ? 18 : undefined,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3, rotate: p.rot }}
                transition={{ duration: 1.05, ease: 'easeOut' }}
              >
                {p.emoji}
              </motion.span>
            ))}

            {hit && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-30 rounded-[2rem] bg-sunny/35"
                initial={{ opacity: 0.75 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}

            <motion.p
              style={{ opacity: hintOpacity }}
              className="absolute bottom-1 left-0 right-0 z-20 text-center font-display text-sm font-bold text-rose-deep/80"
            >
              ← draw the arrow back & release
            </motion.p>

            {hit && (
              <motion.p
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 12 }}
                className="absolute bottom-1 left-0 right-0 z-30 text-center font-display text-2xl font-extrabold text-rose-deep md:text-3xl"
              >
                popped! 🎉
              </motion.p>
            )}
          </div>
        </div>

        <div className="relative z-20 mt-auto flex justify-center pb-2 pt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="btn-ghost text-sm"
            onClick={() => {
              unlockAudio()
              finish(true)
            }}
          >
            Skip drag — continue anyway
          </motion.button>
        </div>
      </motion.div>
    </StageShell>
  )
}

function ArrowGraphic({
  tipX,
  nockX,
  cy,
}: {
  tipX: number
  nockX: number
  cy: number
}) {
  const featherX = nockX + 22
  return (
    <g>
      <line
        x1={nockX + 6}
        y1={cy}
        x2={tipX - 14}
        y2={cy}
        stroke="#5c3418"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <line
        x1={nockX + 6}
        y1={cy}
        x2={tipX - 14}
        y2={cy}
        stroke="url(#shaftGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <line
        x1={nockX + 8}
        y1={cy - 1}
        x2={tipX - 20}
        y2={cy - 1}
        stroke="#f3d5a8"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />

      <path
        d={`M ${nockX} ${cy - 5} L ${nockX + 8} ${cy} L ${nockX} ${cy + 5}`}
        fill="none"
        stroke="#8a5528"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={`M ${featherX} ${cy} Q ${featherX - 4} ${cy - 16} ${featherX + 14} ${cy - 18} Q ${featherX + 6} ${cy - 4} ${featherX + 18} ${cy}`}
        fill="#c9b6ff"
        stroke="#fff"
        strokeWidth="1"
        opacity="0.95"
      />
      <path
        d={`M ${featherX} ${cy} Q ${featherX - 4} ${cy + 16} ${featherX + 14} ${cy + 18} Q ${featherX + 6} ${cy + 4} ${featherX + 18} ${cy}`}
        fill="#7ec8ff"
        stroke="#fff"
        strokeWidth="1"
        opacity="0.95"
      />
      <path
        d={`M ${featherX + 4} ${cy} Q ${featherX + 10} ${cy - 10} ${featherX + 22} ${cy - 6} Q ${featherX + 14} ${cy} ${featherX + 22} ${cy}`}
        fill="#ff9ec7"
        stroke="#fff"
        strokeWidth="0.8"
        opacity="0.9"
      />

      <g transform={`translate(${tipX - 18}, ${cy - 12})`}>
        <path
          d="M18 22 C6 14 2 8 2 4.5 C2 1.5 4.5 0 7.5 0 C10 0 12 1.5 13 3.5 C14 1.5 16 0 18.5 0 C21.5 0 24 1.5 24 4.5 C24 8 20 14 18 22Z"
          fill="url(#heartTip)"
          stroke="#fff"
          strokeWidth="1.8"
        />
        <ellipse cx="8" cy="5" rx="3.5" ry="2.2" fill="#fff" opacity="0.55" />
      </g>
    </g>
  )
}

function LatexBalloon({
  cx,
  cy,
  popped,
}: {
  cx: number
  cy: number
  popped: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const body = `latexBody-${uid}`
  const shine = `latexShine-${uid}`
  const stringGrad = `latexString-${uid}`

  if (popped) {
    return (
      <motion.g
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.25, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <path
          d={`M ${cx - 28} ${cy - 10} L ${cx - 40} ${cy - 36} M ${cx + 10} ${cy - 30} L ${cx + 28} ${cy - 48}
              M ${cx + 32} ${cy} L ${cx + 52} ${cy - 8} M ${cx + 18} ${cy + 28} L ${cx + 36} ${cy + 44}
              M ${cx - 16} ${cy + 30} L ${cx - 30} ${cy + 48} M ${cx - 34} ${cy + 4} L ${cx - 52} ${cy + 12}`}
          stroke="#ff6b9d"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </motion.g>
    )
  }

  return (
    <motion.g
      animate={{
        y: [0, -10, 0, -6, 0],
        x: [0, 3, 0, -2, 0],
        scaleX: [1, 1.03, 0.98, 1.02, 1],
        scaleY: [1, 0.97, 1.03, 0.99, 1],
      }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <defs>
        <radialGradient id={body} cx="32%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#ffc4dc" />
          <stop offset="42%" stopColor="#ff6b9d" />
          <stop offset="100%" stopColor="#c2185b" />
        </radialGradient>
        <radialGradient id={shine} cx="30%" cy="25%" r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={stringGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c48a4a" />
          <stop offset="100%" stopColor="#6b3f1c" />
        </linearGradient>
      </defs>

      <ellipse cx={cx} cy={cy + 78} rx={28} ry={8} fill="#3d2a4a" opacity="0.12" />

      <path
        d={`M ${cx} ${cy - 48}
            C ${cx + 38} ${cy - 48} ${cx + 48} ${cy - 12} ${cx + 40} ${cy + 18}
            C ${cx + 34} ${cy + 38} ${cx + 16} ${cy + 48} ${cx} ${cy + 52}
            C ${cx - 16} ${cy + 48} ${cx - 34} ${cy + 38} ${cx - 40} ${cy + 18}
            C ${cx - 48} ${cy - 12} ${cx - 38} ${cy - 48} ${cx} ${cy - 48} Z`}
        fill={`url(#${body})`}
        stroke="#fff"
        strokeWidth="3.5"
      />

      <ellipse cx={cx - 14} cy={cy - 22} rx={14} ry={18} fill={`url(#${shine})`} />
      <ellipse cx={cx - 18} cy={cy - 28} rx={5} ry={7} fill="#fff" opacity="0.7" />

      <path
        d={`M ${cx - 5} ${cy + 50} L ${cx} ${cy + 60} L ${cx + 5} ${cy + 50} Z`}
        fill="#e04878"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <ellipse cx={cx} cy={cy + 61} rx={5} ry={3.5} fill="#c48a4a" stroke="#fff" strokeWidth="1.2" />

      <motion.path
        d={`M ${cx} ${cy + 64} C ${cx - 6} ${cy + 78} ${cx + 8} ${cy + 88} ${cx} ${cy + 102}`}
        fill="none"
        stroke={`url(#${stringGrad})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={{
          d: [
            `M ${cx} ${cy + 64} C ${cx - 6} ${cy + 78} ${cx + 8} ${cy + 88} ${cx} ${cy + 102}`,
            `M ${cx} ${cy + 64} C ${cx + 6} ${cy + 76} ${cx - 6} ${cy + 90} ${cx + 2} ${cy + 102}`,
            `M ${cx} ${cy + 64} C ${cx - 6} ${cy + 78} ${cx + 8} ${cy + 88} ${cx} ${cy + 102}`,
          ],
        }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <text
        x={cx}
        y={cy + 118}
        textAnchor="middle"
        fill="rgba(61,42,74,0.45)"
        style={{ fontSize: 11, fontWeight: 800, fontFamily: 'inherit' }}
      >
        hit me!
      </text>
    </motion.g>
  )
}
