import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { GIFT_INBOX_PASSCODE, HER_NAME } from '../data/content'
import { StageShell } from '../components/StageShell'
import {
  getGiftWishes,
  type GiftWish,
} from '../lib/giftWish'

type Props = {
  linkWish?: GiftWish | null
}

export function GiftInboxStage({ linkWish = null }: Props) {
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(Boolean(linkWish))
  const [error, setError] = useState('')
  const wishes = useMemo(() => getGiftWishes(), [unlocked])

  const tryUnlock = (e: FormEvent) => {
    e.preventDefault()
    if (code.trim() === GIFT_INBOX_PASSCODE) {
      setUnlocked(true)
      setError('')
      return
    }
    setError('Wrong inbox code')
  }

  const visible: GiftWish[] = linkWish
    ? [linkWish, ...wishes.filter((w) => w.wish !== linkWish.wish)]
    : wishes

  return (
    <StageShell mascot="shy" noAmbient>
      <div className="mx-auto w-full max-w-lg">
        <div className="glass-card rounded-[2rem] px-6 py-10 md:px-10">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.24em] text-rose/80">
            Private inbox
          </p>
          <h1 className="mt-2 text-center font-display text-3xl font-extrabold text-rose-deep md:text-4xl">
            {HER_NAME}’s gift wishes
          </h1>

          {!unlocked ? (
            <form onSubmit={tryUnlock} className="mt-8 space-y-4">
              <p className="text-center text-sm font-bold text-ink/55">
                Enter your secret inbox code to see what she asked for.
              </p>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Inbox code"
                className="w-full rounded-2xl border-[3px] border-petal bg-white px-4 py-3 text-center font-display text-lg font-bold outline-none focus:border-rose"
              />
              {error && (
                <p className="text-center text-sm font-extrabold text-rose-deep">{error}</p>
              )}
              <button type="submit" className="btn-primary w-full">
                Open inbox
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              {visible.length === 0 ? (
                <p className="rounded-2xl border-[3px] border-dashed border-petal bg-petal/40 px-4 py-8 text-center font-display text-lg font-bold text-ink/55">
                  No gift wish yet.
                  <br />
                  <span className="text-sm font-semibold">
                    Open this on the laptop she used, or open the wish-link she copied for you.
                  </span>
                </p>
              ) : (
                visible.map((w) => (
                  <motion.article
                    key={w.id + w.createdAt}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-[3px] border-white bg-gradient-to-br from-petal/80 to-white px-5 py-4 shadow-sm"
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose/70">
                      {w.name} · {new Date(w.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 font-display text-xl font-extrabold leading-snug text-ink">
                      {w.wish}
                    </p>
                  </motion.article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </StageShell>
  )
}
