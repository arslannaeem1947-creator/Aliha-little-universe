import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FAKE_NOTIFICATION } from '../data/content'

type Props = {
  /** When true, shows the toast once then auto-dismisses */
  trigger: boolean
}

export function PrankToast({ trigger }: Props) {
  const [visible, setVisible] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (!trigger) return
    const show = setTimeout(() => {
      setVisible(true)
      setBurst(true)
    }, 700)
    const hide = setTimeout(() => setVisible(false), 3200)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [trigger])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          className="fixed left-1/2 top-4 z-[90] w-[min(92vw,340px)] -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl border-[3px] border-white bg-white px-4 py-3 shadow-[0_8px_0_rgba(255,107,157,0.25),0_20px_40px_rgba(61,42,74,0.2)]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-rose/70">
                  {FAKE_NOTIFICATION.title}
                </p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-ink">
                  {FAKE_NOTIFICATION.body}
                </p>
              </div>
            </div>
            {burst &&
              Array.from({ length: 12 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute left-1/2 top-1/2 text-sm"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 160,
                    y: (Math.random() - 0.5) * 80 - 20,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  {i % 2 === 0 ? '🎉' : '✨'}
                </motion.span>
              ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
