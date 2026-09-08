import { motion } from 'framer-motion'

type Props = { className?: string; size?: number }

/** Windmill with independently spinning blades */
export function Windmill({ className = '', size = 160 }: Props) {
  return (
    <svg
      viewBox="0 0 420 650"
      width={size}
      height={(size * 650) / 420}
      className={className}
      aria-hidden
    >
      <path d="M115 610L155 190H265L305 610Z" fill="#684b52" />
      <path d="M145 610L175 205H245L275 610Z" fill="#8b6570" />
      <path d="M210 205V110" stroke="#5a3f46" strokeWidth="16" />
      <g fill="#f4c86b">
        <rect x="168" y="270" width="35" height="55" rx="6" />
        <rect x="217" y="270" width="35" height="55" rx="6" />
      </g>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{ transformOrigin: '210px 105px' }}
      >
        <circle cx="210" cy="105" r="25" fill="#f3c56b" />
        <g fill="#e6b75e">
          <path d="M205 105 L190 5 L220 5 L215 105Z" />
          <path d="M210 105 L310 75 L320 105 L215 120Z" />
          <path d="M210 105 L230 205 L200 205 L195 115Z" />
          <path d="M210 105 L110 135 L100 105 L205 90Z" />
        </g>
      </motion.g>
    </svg>
  )
}

type ButterflyProps = {
  className?: string
  size?: number
  delay?: number
  path?: { x: number[]; y: number[] }
  duration?: number
}

export function Butterfly({
  className = '',
  size = 48,
  delay = 0,
  path = { x: [0, 80, 140, 60, 0], y: [0, -40, 10, -55, 0] },
  duration = 14,
}: ButterflyProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      animate={{ x: path.x, y: path.y }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: 'easeInOut',
      }}
      aria-hidden
    >
      <svg viewBox="0 0 300 220" width={size} height={(size * 220) / 300}>
        <ellipse cx="150" cy="110" rx="13" ry="55" fill="#4d344b" />
        <motion.g
          animate={{ scaleX: [1, 0.55, 1] }}
          transition={{ repeat: Infinity, duration: 0.28, ease: 'easeInOut' }}
          style={{ transformOrigin: '150px 110px' }}
        >
          <path
            d="M140 100 C80 20 15 35 35 105 C55 160 105 145 140 120Z"
            fill="#ff77a8"
          />
          <path
            d="M160 100 C220 20 285 35 265 105 C245 160 195 145 160 120Z"
            fill="#ff77a8"
          />
          <path
            d="M140 120 C92 105 60 145 85 185 C110 215 135 165 145 135Z"
            fill="#ffb86b"
          />
          <path
            d="M160 120 C208 105 240 145 215 185 C190 215 165 165 155 135Z"
            fill="#ffb86b"
          />
        </motion.g>
      </svg>
    </motion.div>
  )
}

export type TulipColor = 'red' | 'pink' | 'yellow' | 'purple' | 'orange'

const TULIP_FILLS: Record<TulipColor, { outer: string; inner: string }> = {
  red: { outer: '#e83f5b', inner: '#ff6178' },
  pink: { outer: '#f26fa5', inner: '#ff9ac0' },
  yellow: { outer: '#f6b936', inner: '#ffd76b' },
  purple: { outer: '#8d43c7', inner: '#b86de5' },
  orange: { outer: '#f47721', inner: '#ffad52' },
}

type TulipProps = {
  color: TulipColor
  className?: string
  size?: number
  swayDelay?: number
  popped?: boolean
  onTap?: () => void
}

export function AnimatedTulip({
  color,
  className = '',
  size = 88,
  swayDelay = 0,
  popped = false,
  onTap,
}: TulipProps) {
  const fills = TULIP_FILLS[color]
  return (
    <motion.button
      type="button"
      aria-label={`${color} tulip`}
      onClick={onTap}
      className={`relative touch-manipulation bg-transparent p-0 ${className}`}
      animate={{
        rotate: [-4, 4, -4],
        scale: popped ? [1, 1.18, 1] : [1, 1.04, 1],
      }}
      transition={{
        rotate: { repeat: Infinity, duration: 3.2 + swayDelay, ease: 'easeInOut', delay: swayDelay },
        scale: popped
          ? { duration: 0.45 }
          : { repeat: Infinity, duration: 2.6 + swayDelay * 0.4, ease: 'easeInOut', delay: swayDelay },
      }}
      whileTap={{ scale: 0.9 }}
      style={{ originY: 1 }}
    >
      <svg
        viewBox="0 0 220 420"
        width={size}
        height={(size * 420) / 220}
        className="sticker drop-shadow-md"
        aria-hidden
      >
        <path
          d="M108 180 C106 245 104 315 105 400"
          stroke="#3b8f55"
          strokeWidth="14"
          fill="none"
        />
        <path d="M106 300 C70 270 38 286 28 330 C62 325 91 317 108 296" fill="#55a85f" />
        <path d="M108 390 C80 350 53 346 30 370 C57 392 83 403 108 400" fill="#438e52" />
        <path
          d="M108 215 C53 207 20 164 29 82 C67 100 91 127 108 160 C125 127 151 100 188 82 C197 164 163 207 108 215Z"
          fill={fills.outer}
        />
        <path
          d="M108 207 C93 151 99 89 108 35 C117 89 123 151 108 207Z"
          fill={fills.inner}
        />
      </svg>
    </motion.button>
  )
}

type GiftProps = {
  open: boolean
  onOpen: () => void
  className?: string
  size?: number
}

export function AnimatedGiftBox({ open, onOpen, className = '', size = 140 }: GiftProps) {
  return (
    <motion.button
      type="button"
      aria-label="Open garden gift"
      onClick={onOpen}
      className={`relative touch-manipulation bg-transparent p-0 ${className}`}
      initial={{ y: 80, opacity: 0, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
    >
      <svg viewBox="0 0 420 360" width={size} height={(size * 360) / 420} aria-hidden>
        {/* box body */}
        <rect x="35" y="155" width="350" height="170" rx="12" fill="#f7a7c9" />
        <path d="M195 155V325M35 200H385" stroke="#e83d70" strokeWidth="24" />

        {/* lid */}
        <motion.g
          animate={open ? { y: -70, rotate: -18 } : { y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          style={{ transformOrigin: '80px 155px' }}
        >
          <rect x="35" y="105" width="350" height="65" rx="10" fill="#ffbfdc" />
          <path d="M195 105V170M35 135H385" stroke="#e83d70" strokeWidth="24" />
          <path
            d="M210 105 C160 55 102 58 108 96 C114 130 173 120 210 105 C247 120 306 130 312 96 C318 58 260 55 210 105Z"
            fill="#ff3f6c"
          />
          <path d="M210 105V58" stroke="#d72f5c" strokeWidth="14" />
        </motion.g>
      </svg>
    </motion.button>
  )
}

type TooltipProps = {
  title: string
  visible: boolean
  className?: string
}

export function SurpriseTooltip({ title, visible, className = '' }: TooltipProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-30 ${className}`}
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 12, scale: 0.85 }
      }
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
    >
      <div className="relative max-w-[220px] rounded-2xl border-[3px] border-[#f5c3ff] bg-[#9b42c7] px-4 py-3 text-left shadow-lg">
        <p className="font-display text-sm font-extrabold leading-snug text-white">{title}</p>
        <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-[#f5c3ff] bg-[#9b42c7]" />
      </div>
    </motion.div>
  )
}

export function HeartSparkles({ className = '', size = 72 }: Props) {
  return (
    <motion.svg
      viewBox="0 0 300 240"
      width={size}
      height={(size * 240) / 300}
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1, 0], y: [0, -30, -60] }}
      transition={{ duration: 1.4 }}
      aria-hidden
    >
      <path
        d="M150 205 C110 170 35 125 55 70 C72 25 125 40 150 82 C175 40 228 25 245 70 C265 125 190 170 150 205Z"
        fill="#ff5d8f"
      />
      <g fill="#ffd86b">
        <circle cx="35" cy="40" r="8" />
        <circle cx="265" cy="55" r="8" />
        <path d="M75 10l7 18 18 7-18 7-7 18-7-18-18-7 18-7z" />
        <path d="M230 130l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" />
      </g>
    </motion.svg>
  )
}
