import { motion } from 'framer-motion'

export type MascotMood = 'wave' | 'cheer' | 'shy' | 'idle' | 'sleep'

type Props = {
  mood?: MascotMood
  className?: string
  size?: number
}

/** Recurring cute blob-bird mascot across stages */
export function CuteMascot({ mood = 'idle', className = '', size = 72 }: Props) {
  const bounce =
    mood === 'cheer'
      ? { y: [0, -10, 0], rotate: [0, -8, 8, 0] }
      : mood === 'wave'
        ? { y: [0, -6, 0], rotate: [0, 6, 0] }
        : mood === 'shy'
          ? { y: [0, 2, 0], rotate: [0, -3, 0] }
          : mood === 'sleep'
            ? { y: [0, 3, 0] }
            : { y: [0, -5, 0] }

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
      animate={bounce}
      transition={{ repeat: Infinity, duration: mood === 'cheer' ? 0.9 : 2.4, ease: 'easeInOut' }}
      aria-hidden
    >
      <svg viewBox="0 0 80 80" width={size} height={size} className="sticker drop-shadow-md">
        {/* body */}
        <ellipse cx="40" cy="46" rx="28" ry="24" fill="#ff9ec7" stroke="#fff" strokeWidth="3.5" />
        {/* belly */}
        <ellipse cx="40" cy="50" rx="16" ry="13" fill="#ffe0ef" />
        {/* face blush */}
        <circle cx="26" cy="46" r="4" fill="#ff6b9d" opacity="0.35" />
        <circle cx="54" cy="46" r="4" fill="#ff6b9d" opacity="0.35" />
        {/* eyes */}
        {mood === 'sleep' ? (
          <>
            <path d="M24 42 Q28 38 32 42" stroke="#3d2a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M48 42 Q52 38 56 42" stroke="#3d2a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="28" cy="42" r="3.2" fill="#3d2a4a" />
            <circle cx="52" cy="42" r="3.2" fill="#3d2a4a" />
            <circle cx="29" cy="41" r="1" fill="#fff" />
            <circle cx="53" cy="41" r="1" fill="#fff" />
          </>
        )}
        {/* beak */}
        <ellipse cx="40" cy="48" rx="4" ry="3" fill="#ffd56a" stroke="#fff" strokeWidth="1.5" />
        {/* wing wave */}
        <motion.ellipse
          cx="14"
          cy="46"
          rx="8"
          ry="6"
          fill="#ff6b9d"
          stroke="#fff"
          strokeWidth="2"
          animate={
            mood === 'wave' || mood === 'cheer'
              ? { rotate: [-20, 25, -20] }
              : { rotate: 0 }
          }
          transition={{ repeat: Infinity, duration: 0.7 }}
          style={{ originX: '80%', originY: '50%' }}
        />
        <ellipse cx="66" cy="46" rx="8" ry="6" fill="#ff6b9d" stroke="#fff" strokeWidth="2" />
        {/* tuft */}
        <path d="M36 22 Q40 10 44 22" fill="#ff6b9d" stroke="#fff" strokeWidth="2" />
        {mood === 'cheer' && (
          <>
            <text x="8" y="18" fontSize="12">
              ✨
            </text>
            <text x="58" y="16" fontSize="12">
              💖
            </text>
          </>
        )}
        {mood === 'sleep' && (
          <text x="56" y="22" fontSize="11" fill="#c9b6ff">
            z
          </text>
        )}
      </svg>
    </motion.div>
  )
}
