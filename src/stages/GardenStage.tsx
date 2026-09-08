import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  GARDEN_CARD,
  GARDEN_CONTINUE,
  GARDEN_GIFT_HINT,
  GARDEN_HINT,
  GARDEN_MESSAGES,
} from '../data/content'
import { StageShell } from '../components/StageShell'
import {
  AnimatedGiftBox,
  AnimatedTulip,
  Butterfly,
  HeartSparkles,
  SurpriseTooltip,
  Windmill,
  type TulipColor,
} from '../components/garden/GardenAssets'
import gardenArch from '../assets/garden/garden-arch.svg'
import gardenPath from '../assets/garden/path.svg'
import gardenLantern from '../assets/garden/garden-lantern.svg'
import leafCluster from '../assets/garden/leaf-cluster.svg'
import flowerPetal from '../assets/garden/flower-petal.svg'
import trellisSign from '../assets/garden/trellis-sign.svg'

type Props = { onNext: () => void }

type TulipDef = {
  id: number
  color: TulipColor
  left: string
  bottom: string
  size: number
  swayDelay: number
  message: string
}

const TULIPS: TulipDef[] = [
  { id: 0, color: 'red', left: '8%', bottom: '22%', size: 78, swayDelay: 0, message: GARDEN_MESSAGES[0] },
  { id: 1, color: 'pink', left: '24%', bottom: '26%', size: 92, swayDelay: 0.4, message: GARDEN_MESSAGES[1] },
  { id: 2, color: 'yellow', left: '42%', bottom: '20%', size: 86, swayDelay: 0.8, message: GARDEN_MESSAGES[2] },
  { id: 3, color: 'purple', left: '58%', bottom: '27%', size: 94, swayDelay: 0.2, message: GARDEN_MESSAGES[3] },
  { id: 4, color: 'orange', left: '74%', bottom: '23%', size: 80, swayDelay: 0.6, message: GARDEN_MESSAGES[4] },
]

const NEED_CLICKS = 3

export function GardenStage({ onNext }: Props) {
  const [clicked, setClicked] = useState<Set<number>>(() => new Set())
  const [activeTip, setActiveTip] = useState<number | null>(null)
  const [sparkleId, setSparkleId] = useState<number | null>(null)
  const [giftVisible, setGiftVisible] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [popped, setPopped] = useState<number | null>(null)

  const petals = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${6 + i * 9}%`,
        bottom: `${4 + (i % 4) * 3}%`,
        rot: (i % 5) * 18 - 30,
        w: 28 + (i % 3) * 8,
      })),
    [],
  )

  const tapTulip = (id: number) => {
    setPopped(id)
    setTimeout(() => setPopped(null), 450)

    setActiveTip(id)
    setSparkleId(id)
    setTimeout(() => setSparkleId(null), 1400)
    setTimeout(() => setActiveTip((cur) => (cur === id ? null : cur)), 2200)

    setClicked((prev) => {
      const next = new Set(prev).add(id)
      if (next.size >= NEED_CLICKS && !giftVisible) {
        setTimeout(() => setGiftVisible(true), 400)
      }
      return next
    })
  }

  return (
    <StageShell
      mascot="cheer"
      noGround
      noSkyDecor
      noAmbient
      fullBleed
      className="!p-0"
    >
      <div className="relative min-h-dvh w-full flex-1 overflow-hidden">
        {/* Full-screen garden sky */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 78% 10%, rgba(255, 220, 140, 0.45), transparent 42%),
              radial-gradient(ellipse at 20% 20%, rgba(255, 170, 200, 0.25), transparent 45%),
              linear-gradient(180deg, #7ec8ff 0%, #b8e4ff 22%, #e8f6ff 42%, #dff8e8 62%, #8fe0a8 82%, #5cbc7a 100%)
            `,
          }}
        />

        {/* Full garden floor — covers lower half edge-to-edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#3d9a5c] via-[#5cbc7a] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#2f8a50] to-transparent"
        />

        {/* Path */}
        <img
          src={gardenPath}
          alt=""
          className="pointer-events-none absolute bottom-0 left-1/2 z-[2] h-[55%] w-auto max-w-[90%] -translate-x-1/2 object-contain opacity-90"
        />

        {/* Arch */}
        <img
          src={gardenArch}
          alt=""
          className="pointer-events-none absolute left-1/2 top-[2%] z-[3] h-[min(52dvh,420px)] w-auto max-w-[min(92vw,560px)] -translate-x-1/2 object-contain opacity-95"
        />

        {/* Trellis sign */}
        <div className="absolute left-1/2 top-[8%] z-20 w-[min(78vw,300px)] -translate-x-1/2 md:top-[10%]">
          <img src={trellisSign} alt={GARDEN_HINT} className="w-full drop-shadow-lg" />
        </div>

        {/* Windmill — left */}
        <div className="absolute bottom-[28%] left-[1%] z-[4] md:left-[4%]">
          <Windmill size={110} className="md:!w-[150px]" />
        </div>

        {/* Lantern — right */}
        <img
          src={gardenLantern}
          alt=""
          className="pointer-events-none absolute bottom-[30%] right-[3%] z-[4] w-14 drop-shadow-md md:right-[5%] md:w-20"
        />

        {/* Leaf clusters */}
        <img
          src={leafCluster}
          alt=""
          className="pointer-events-none absolute bottom-[8%] left-[2%] z-[5] w-28 opacity-90 md:w-40"
        />
        <img
          src={leafCluster}
          alt=""
          className="pointer-events-none absolute bottom-[6%] right-[4%] z-[5] w-32 scale-x-[-1] opacity-90 md:w-44"
        />

        {/* Petals as ground filler */}
        {petals.map((p) => (
          <img
            key={p.id}
            src={flowerPetal}
            alt=""
            className="pointer-events-none absolute z-[5] opacity-80"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.w,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}

        {/* Butterflies */}
        <Butterfly
          className="left-[15%] top-[35%]"
          size={42}
          delay={0}
          duration={16}
          path={{ x: [0, 100, 160, 40, 0], y: [0, -50, 20, -70, 0] }}
        />
        <Butterfly
          className="right-[20%] top-[28%]"
          size={36}
          delay={2}
          duration={13}
          path={{ x: [0, -70, -120, -30, 0], y: [0, -35, 15, -55, 0] }}
        />
        <Butterfly
          className="left-[45%] top-[42%]"
          size={30}
          delay={4}
          duration={18}
          path={{ x: [0, 50, -40, 70, 0], y: [0, -25, -60, -10, 0] }}
        />

        {/* Tulip row */}
        <div className="absolute inset-0 z-10">
          {TULIPS.map((t) => (
            <div
              key={t.id}
              className="absolute"
              style={{ left: t.left, bottom: t.bottom }}
            >
              <AnimatedTulip
                color={t.color}
                size={t.size}
                swayDelay={t.swayDelay}
                popped={popped === t.id}
                onTap={() => tapTulip(t.id)}
              />
              <SurpriseTooltip
                title={t.message}
                visible={activeTip === t.id}
                className="bottom-[95%] left-1/2 -translate-x-1/2"
              />
              <AnimatePresence>
                {sparkleId === t.id && (
                  <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <HeartSparkles size={64} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Progress hint */}
        <p className="absolute bottom-[14%] left-0 right-0 z-20 text-center text-sm font-extrabold text-ink/55">
          {giftOpen
            ? ''
            : giftVisible
              ? GARDEN_GIFT_HINT
              : `${GARDEN_HINT} (${clicked.size}/${NEED_CLICKS})`}
        </p>

        {/* Gift payoff */}
        <AnimatePresence>
          {giftVisible && !giftOpen && (
            <div className="absolute bottom-[16%] left-1/2 z-30 -translate-x-1/2">
              <AnimatedGiftBox open={false} onOpen={() => setGiftOpen(true)} size={130} />
            </div>
          )}
        </AnimatePresence>

        {giftOpen && (
          <motion.div
            className="absolute inset-x-4 bottom-[10%] z-40 mx-auto flex max-w-lg flex-col items-center md:inset-x-auto"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          >
            <div className="w-full rounded-[1.8rem] border-[4px] border-[#f7b3d8] bg-[#5a3767]/90 px-5 py-6 text-center shadow-[0_12px_40px_rgba(90,55,103,0.45)] backdrop-blur-sm md:px-8">
              <p className="font-display text-3xl font-extrabold text-white md:text-4xl">
                {GARDEN_CARD.title}
              </p>
              {GARDEN_CARD.lines.map((line) => (
                <p key={line} className="mt-2 font-semibold text-white/90">
                  {line}
                </p>
              ))}
              <p className="mt-4 text-sm font-bold text-[#ffd4e8]">{GARDEN_CARD.wish}</p>
            </div>

            <div className="mt-3">
              <AnimatedGiftBox open onOpen={() => undefined} size={90} />
            </div>

            <motion.button
              type="button"
              className="btn-primary mt-5"
              whileHover={{ scale: 1.06, rotate: -1 }}
              whileTap={{ scale: 0.92 }}
              onClick={onNext}
            >
              {GARDEN_CONTINUE}
            </motion.button>
          </motion.div>
        )}
      </div>
    </StageShell>
  )
}
