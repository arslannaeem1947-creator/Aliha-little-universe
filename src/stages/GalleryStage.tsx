import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BUTTON_SWAP, GALLERY } from '../data/content'
import { StageShell } from '../components/StageShell'

type Props = { onNext: () => void }

export function GalleryStage({ onNext }: Props) {
  const [index, setIndex] = useState(0)
  const [seen, setSeen] = useState(() => new Set<number>([0]))
  const [swapped, setSwapped] = useState(false)
  const [didSwap, setDidSwap] = useState(false)
  const swapBusy = useRef(false)
  const item = GALLERY[index]
  const canContinue = seen.size >= 3

  const mark = (i: number) => {
    setIndex(i)
    setSeen((prev) => new Set(prev).add(i))
  }

  const prev = () => mark((index - 1 + GALLERY.length) % GALLERY.length)
  const next = () => mark((index + 1) % GALLERY.length)

  const previews = useMemo(() => {
    const a = (index - 1 + GALLERY.length) % GALLERY.length
    const b = index
    const c = (index + 1) % GALLERY.length
    return [a, b, c]
  }, [index])

  const playSwap = () => {
    if (didSwap || swapBusy.current || !canContinue) return
    swapBusy.current = true
    setDidSwap(true)
    setSwapped(true)
    setTimeout(() => {
      setSwapped(false)
      swapBusy.current = false
    }, 1200)
  }

  const onContinueClick = () => {
    if (!canContinue) return
    if (!didSwap) {
      playSwap()
      return
    }
    if (swapBusy.current) return
    onNext()
  }

  const continueBtn = (
    <motion.button
      key="continue"
      type="button"
      layout
      onClick={onContinueClick}
      onMouseEnter={() => {
        if (canContinue && !didSwap) playSwap()
      }}
      onTouchStart={(e) => {
        if (canContinue && !didSwap) {
          e.preventDefault()
          playSwap()
        }
      }}
      whileHover={canContinue && didSwap && !swapped ? { scale: 1.06 } : undefined}
      whileTap={canContinue && didSwap && !swapped ? { scale: 0.94 } : undefined}
      className="rounded-2xl border-[3px] border-white bg-sunny px-7 py-3 font-extrabold text-night shadow-[0_5px_0_rgba(230,180,60,0.8)]"
    >
      {BUTTON_SWAP.continue}
    </motion.button>
  )

  const stayBtn = (
    <motion.button
      key="stay"
      type="button"
      layout
      onClick={() => {
        /* intentional no-op — just a decoy */
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-2xl border-[3px] border-white/40 bg-white/15 px-7 py-3 font-extrabold text-gold-soft backdrop-blur"
    >
      {BUTTON_SWAP.stay}
    </motion.button>
  )

  return (
    <StageShell dark mascot="shy" noGround>
      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-sunny">
          A few moments, kept safe
        </p>
        <h2 className="mt-2 font-display text-4xl font-extrabold text-gold-soft md:text-5xl">
          us in every universe
        </h2>

        <div className="mt-8 flex items-end justify-center gap-3 md:gap-5">
          {previews.map((i, pos) => {
            const g = GALLERY[i]
            const active = pos === 1
            return (
              <motion.button
                key={`${g.src}-${pos}`}
                type="button"
                onClick={() => mark(i)}
                whileHover={active ? undefined : { scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`overflow-hidden rounded-[1.4rem] border-[3px] transition ${
                  active
                    ? 'w-[min(100%,380px)] border-white shadow-[0_12px_0_rgba(255,213,106,0.25),0_28px_60px_rgba(0,0,0,0.4)]'
                    : 'hidden w-28 border-white/25 opacity-55 hover:opacity-90 md:block md:w-36'
                }`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  className={`object-cover ${active ? 'aspect-square w-full' : 'aspect-[3/4] h-40 w-full'}`}
                />
              </motion.button>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <motion.button
            type="button"
            onClick={prev}
            aria-label="Previous memory"
            whileHover={{ scale: 1.1, rotate: -6 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-white/40 bg-white/15 text-2xl text-gold backdrop-blur"
          >
            ←
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.p
              key={item.caption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="min-w-[220px] font-display text-xl font-bold text-gold-soft md:text-2xl"
            >
              {item.caption}
            </motion.p>
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={next}
            aria-label="Next memory"
            whileHover={{ scale: 1.1, rotate: 6 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-white/40 bg-white/15 text-2xl text-gold backdrop-blur"
          >
            →
          </motion.button>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {GALLERY.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => mark(i)}
              className={`h-3 rounded-full border-2 border-white/30 transition ${
                i === index ? 'w-9 bg-sunny' : 'w-3 bg-white/25'
              }`}
              aria-label={`Memory ${i + 1}: ${g.caption}`}
            />
          ))}
        </div>

        <p className="mt-4 text-sm font-bold text-blush/55">
          {canContinue
            ? didSwap && swapped
              ? BUTTON_SWAP.swapHint
              : 'Ready when you are ✨'
            : `Browse at least 3 memories (${seen.size}/3)`}
        </p>

        {canContinue && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {swapped ? (
              <>
                {stayBtn}
                {continueBtn}
              </>
            ) : (
              <>
                {continueBtn}
                {stayBtn}
              </>
            )}
          </div>
        )}
      </div>
    </StageShell>
  )
}
