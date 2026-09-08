import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { MusicProvider, MusicToggle } from './components/MusicToggle'
import { AskStage } from './stages/AskStage'
import { BalloonWelcomeStage } from './stages/BalloonWelcomeStage'
import { BloomStage } from './stages/BloomStage'
import { BowStage } from './stages/BowStage'
import { FakeEndStage } from './stages/FakeEndStage'
import { FunFactsStage } from './stages/FunFactsStage'
import { GalleryStage } from './stages/GalleryStage'
import { GardenStage } from './stages/GardenStage'
import { GiftInboxStage } from './stages/GiftInboxStage'
import { GlitchStage } from './stages/GlitchStage'
import { LetterStage } from './stages/LetterStage'
import { PasscodeStage } from './stages/PasscodeStage'
import { RevealStage } from './stages/RevealStage'
import { decodeGiftWishFromLink } from './lib/giftWish'

export type Stage =
  | 'passcode'
  | 'welcome'
  | 'ask'
  | 'bow'
  | 'glitch'
  | 'bloom'
  | 'gallery'
  | 'garden'
  | 'facts'
  | 'fakeEnd'
  | 'letter'
  | 'reveal'

function readQuery() {
  if (typeof window === 'undefined') return { inbox: false, gift: null as string | null }
  const q = new URLSearchParams(window.location.search)
  return {
    inbox: q.has('inbox'),
    gift: q.get('gift'),
  }
}

export default function App() {
  const query = useMemo(() => readQuery(), [])
  const linkWish = useMemo(
    () => (query.gift ? decodeGiftWishFromLink(query.gift) : null),
    [query.gift],
  )
  const [stage, setStage] = useState<Stage>('passcode')

  if (query.inbox || linkWish) {
    return (
      <MusicProvider>
        <div className="min-h-dvh font-body">
          <MusicToggle />
          <GiftInboxStage linkWish={linkWish} />
        </div>
      </MusicProvider>
    )
  }

  return (
    <MusicProvider>
      <div className="min-h-dvh font-body">
        <MusicToggle />
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="min-h-dvh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {stage === 'passcode' && (
              <PasscodeStage onUnlock={() => setStage('welcome')} />
            )}
            {stage === 'welcome' && (
              <BalloonWelcomeStage onNext={() => setStage('ask')} />
            )}
            {stage === 'ask' && <AskStage onYes={() => setStage('bow')} />}
            {stage === 'bow' && <BowStage onComplete={() => setStage('glitch')} />}
            {stage === 'glitch' && <GlitchStage onDone={() => setStage('bloom')} />}
            {stage === 'bloom' && <BloomStage onNext={() => setStage('gallery')} />}
            {stage === 'gallery' && <GalleryStage onNext={() => setStage('garden')} />}
            {stage === 'garden' && <GardenStage onNext={() => setStage('facts')} />}
            {stage === 'facts' && <FunFactsStage onNext={() => setStage('fakeEnd')} />}
            {stage === 'fakeEnd' && <FakeEndStage onNext={() => setStage('letter')} />}
            {stage === 'letter' && <LetterStage onNext={() => setStage('reveal')} />}
            {stage === 'reveal' && <RevealStage />}
          </motion.div>
        </AnimatePresence>
      </div>
    </MusicProvider>
  )
}
