import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FAKE_OFFLINE, GIFT_WISH, HER_NAME, REVEAL_HINT } from '../data/content'
import { StageShell } from '../components/StageShell'
import { useMusic } from '../components/MusicToggle'
import {
  encodeGiftWishForLink,
  saveGiftWish,
  type GiftWish,
} from '../lib/giftWish'

type Props = { onDone?: () => void }

export function RevealStage({ onDone }: Props) {
  const { unlockAudio } = useMusic()
  const [prankPhase, setPrankPhase] = useState<'offline' | 'kidding' | 'done'>('offline')
  const [opened, setOpened] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [wishText, setWishText] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<GiftWish | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const a = setTimeout(() => setPrankPhase('kidding'), 1600)
    const b = setTimeout(() => setPrankPhase('done'), 2400)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  const openBox = () => {
    unlockAudio()
    setOpened(true)
    // After the surprise lands, force the mandatory gift form
    setTimeout(() => setShowForm(true), 1200)
  }

  const submitWish = (e: FormEvent) => {
    e.preventDefault()
    unlockAudio()
    const trimmed = wishText.trim()
    if (!trimmed) {
      setError(GIFT_WISH.errorEmpty)
      return
    }
    if (trimmed.length < 6) {
      setError(GIFT_WISH.errorShort)
      return
    }
    setError('')
    const entry = saveGiftWish(HER_NAME, trimmed)
    setSaved(entry)
  }

  const copyLinkForHim = async () => {
    if (!saved) return
    const token = encodeGiftWishForLink(saved)
    const url = `${window.location.origin}${window.location.pathname}?gift=${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link for him:', url)
    }
  }

  return (
    <>
      <AnimatePresence>
        {prankPhase !== 'done' && (
          <motion.div
            key="fake-offline"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1a1a] px-6 text-center text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45 }}
          >
            {prankPhase === 'offline' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-sm"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
                  📡
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{FAKE_OFFLINE.title}</h2>
                <p className="mt-2 text-sm text-white/55">{FAKE_OFFLINE.subtitle}</p>
                <div className="mx-auto mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-white/70"
                    initial={{ width: '0%' }}
                    animate={{ width: '8%' }}
                    transition={{ duration: 1.4 }}
                  />
                </div>
                <p className="mt-3 text-xs text-white/40">{FAKE_OFFLINE.loading}</p>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                className="font-display text-2xl font-extrabold text-sunny"
              >
                {FAKE_OFFLINE.kidding}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <StageShell mascot="cheer">
        <div className="mx-auto max-w-xl text-center">
          <div className="glass-card rounded-[2.2rem] px-6 py-10 md:px-12 md:py-12">
            <AnimatePresence mode="wait">
              {!opened ? (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  <p className="font-display text-lg font-bold text-ink/55">
                    One last thing on this screen…
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
                    Tap the gift to open it
                  </h1>

                  <motion.button
                    type="button"
                    onClick={openBox}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.92 }}
                    className="group relative mx-auto mt-10 block"
                    aria-label="Open gift box"
                  >
                    <GiftBox closed />
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5], y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      className="mt-5 block font-extrabold text-rose-deep"
                    >
                      ↓ tap here to open ↓
                    </motion.span>
                  </motion.button>
                </motion.div>
              ) : !showForm ? (
                <motion.div
                  key="opened"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                >
                  <GiftBox closed={false} />
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 16 }}
                    className="mt-8"
                  >
                    <p className="font-display text-4xl font-extrabold text-rose-deep md:text-5xl">
                      Surprise! 🎉
                    </p>
                    <p className="mt-3 font-display text-xl font-bold text-ink/80">
                      Happy Birthday, {HER_NAME} 💗
                    </p>
                    <div className="mx-auto mt-6 max-w-md rounded-2xl border-[3px] border-dashed border-rose/40 bg-petal/60 px-5 py-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose/80">
                        Real gift waiting
                      </p>
                      <p className="mt-2 font-display text-lg font-semibold leading-relaxed text-ink/85">
                        {REVEAL_HINT}
                      </p>
                    </div>
                    <p className="mt-6 font-display text-base font-bold text-ink/50">
                      wait… one more required step 🔒
                    </p>
                  </motion.div>
                </motion.div>
              ) : !saved ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-left"
                >
                  <p className="text-center text-xs font-extrabold uppercase tracking-[0.22em] text-rose">
                    {GIFT_WISH.badge}
                  </p>
                  <h2 className="mt-2 text-center font-display text-3xl font-extrabold text-rose-deep md:text-4xl">
                    {GIFT_WISH.title}
                  </h2>
                  <p className="mt-3 text-center font-display text-lg font-bold leading-snug text-ink/85">
                    {GIFT_WISH.strict}
                  </p>
                  <p className="mt-2 text-center text-sm font-semibold text-ink/55">
                    {GIFT_WISH.subtitle}
                  </p>

                  <form onSubmit={submitWish} className="mt-8 space-y-4" noValidate>
                    <label className="block">
                      <span className="font-display text-base font-extrabold text-ink/80">
                        {GIFT_WISH.label} <span className="text-rose-deep">*</span>
                      </span>
                      <textarea
                        required
                        rows={4}
                        value={wishText}
                        onChange={(e) => {
                          setWishText(e.target.value)
                          if (error) setError('')
                        }}
                        placeholder={GIFT_WISH.placeholder}
                        className="mt-2 w-full resize-none rounded-2xl border-[3px] border-petal bg-white/95 px-4 py-3 font-display text-lg font-semibold text-ink outline-none ring-rose/30 placeholder:text-ink/30 focus:border-rose focus:ring-4"
                      />
                    </label>
                    <p className="text-sm font-bold text-ink/45">{GIFT_WISH.hint}</p>
                    {error && (
                      <p className="rounded-xl bg-rose/10 px-3 py-2 text-sm font-extrabold text-rose-deep">
                        {error}
                      </p>
                    )}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary w-full text-lg"
                    >
                      {GIFT_WISH.submit}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <p className="font-display text-4xl font-extrabold text-rose-deep">
                    {GIFT_WISH.successTitle}
                  </p>
                  <p className="mt-3 font-display text-lg font-bold text-ink/70">
                    {GIFT_WISH.successBody}
                  </p>
                  <div className="mx-auto mt-6 max-w-md rounded-2xl border-[3px] border-rose/30 bg-petal/70 px-5 py-4 text-left">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose/80">
                      Your locked wish
                    </p>
                    <p className="mt-2 font-display text-xl font-extrabold leading-snug text-ink">
                      {saved.wish}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => void copyLinkForHim()}
                      className="btn-ghost w-full"
                    >
                      {copied ? 'Link copied ✅' : 'Copy wish-link for him 📎'}
                    </motion.button>
                    <p className="text-xs font-bold text-ink/40">
                      Tip: that link lets him open your wish on his phone too
                    </p>
                    {onDone && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onDone}
                        className="btn-primary w-full"
                      >
                        Finish 💗
                      </motion.button>
                    )}
                  </div>
                  <p className="mt-8 font-display text-2xl font-extrabold text-rose">
                    Always yours
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </StageShell>
    </>
  )
}

function GiftBox({ closed }: { closed: boolean }) {
  return (
    <div className="relative mx-auto h-44 w-44 md:h-52 md:w-52" style={{ perspective: 800 }}>
      <div className="absolute inset-x-6 bottom-2 h-6 rounded-full bg-rose/25 blur-md" />

      <div className="absolute bottom-0 left-1/2 h-28 w-36 -translate-x-1/2 overflow-hidden rounded-2xl border-[3px] border-white bg-gradient-to-b from-[#ff8a8a] to-[#ff5c5c] shadow-[0_8px_0_rgba(220,60,60,0.4)] md:h-32 md:w-40">
        <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-b from-[#ffe566] to-[#ffd56a]" />
        <div className="absolute left-0 right-0 top-10 h-8 bg-gradient-to-r from-[#ffd56a] via-[#ffe566] to-[#ffd56a]" />

        {!closed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 14 }}
            className="absolute inset-0 flex items-center justify-center gap-1 text-3xl"
          >
            <span>💌</span>
            <span>✨</span>
            <span>💗</span>
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute left-1/2 top-6 z-20 h-14 w-40 -translate-x-1/2 md:w-44"
        animate={
          closed
            ? { y: 0, rotate: 0, opacity: 1 }
            : { y: -70, rotate: -18, opacity: 1 }
        }
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        style={{ originX: 0.2, originY: 1 }}
      >
        <div className="relative h-full w-full rounded-2xl border-[3px] border-white bg-gradient-to-b from-[#ff9a9a] to-[#ff6b6b] shadow-lg">
          <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-b from-[#ffe566] to-[#ffd56a]" />
          <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center">
            <div className="h-8 w-8 -rotate-12 rounded-full border-2 border-white bg-[#ffe566] shadow" />
            <div className="h-8 w-8 rotate-12 rounded-full border-2 border-white bg-[#ffd56a] shadow" />
          </div>
          <div className="absolute -top-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-[#f0b83a]" />
        </div>
      </motion.div>

      {closed && (
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="pointer-events-none absolute -right-2 top-2 text-2xl"
        >
          ✨
        </motion.div>
      )}
    </div>
  )
}
