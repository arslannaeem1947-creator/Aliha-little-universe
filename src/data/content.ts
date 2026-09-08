export const PASSCODE = '0709'

/** Birthday girl — used across stages */
export const HER_NAME = 'Aliha'

export const WRONG_ROASTS = [
  'not even close 😭',
  'really?',
  'okay last chance for my favorite person',
  'Aliha, try again 💗',
]

export const PASSCODE_SHUFFLE_CAPTION = 'numbers get shy when you’re wrong 😏'

export const FUN_FACTS_TRICK_LABEL = 'not yet 👀'
export const FUN_FACTS_CONTINUE_LABEL = 'okay… keep going →'

export const FAKE_OFFLINE = {
  title: 'No internet connection 📡',
  subtitle: 'Trying to reconnect…',
  loading: 'Loading… 0%',
  kidding: 'just kidding, one more surprise ✨',
}

export const FAKE_GLITCH = {
  code: '404',
  title: "you're not supposed to be here 👀",
  subtitle: 'wrong universe… redirecting',
  wink: 'jk — right this way ✨',
}

export const STUCK_LOADING = {
  label: 'Wrapping up the surprise…',
  stall: '99%… almost…',
  done: 'gotcha — just kidding 💗',
}

export const BUTTON_SWAP = {
  continue: 'continue →',
  stay: '← stay a bit',
  swapHint: 'oops, buttons got mixed up 🙈',
}

export const FAKE_NOTIFICATION = {
  title: '1 new notification',
  body: "You've been pranked 🎉",
}

export const BALLOON_WELCOME = {
  title: "Welcome to  Little Universe 🎈",
  subtitle: 'a little garden of surprises, just for Aliha',
  continue: 'come on in →',
}

export const GARDEN_MESSAGES = [
  'You make ordinary days feel magical, Aliha ✨',
  'Still my favorite argument partner 😌',
  'Kucchu pucchu forever, Aliha 💗',
  'Every universe somehow still has us',
  'Thank you for choosing this story',
]

export const GARDEN_CARD = {
  title: 'Happy Birthday, Aliha!',
  lines: [
    'May your life be as beautiful, colorful,',
    'and bright as this garden of tulips! ♥',
  ],
  wish: 'Wishing you endless joy and beautiful moments, Aliha!',
}

export const GARDEN_CONTINUE = 'continue to fun facts →'
export const GARDEN_HINT = 'Tap the tulips to wake the garden 🌷'
export const GARDEN_GIFT_HINT = 'A gift appeared — tap to open 🎁'

export type GalleryItem = {
  src: string
  caption: string
  title: string
}

export const GALLERY: GalleryItem[] = [
  {
    src: '/gallery/universe-sunset.png',
    title: 'A FEW MOMENTS, KEPT SAFE',
    caption: 'from arguments… to forever',
  },
  {
    src: '/gallery/universe-rain.png',
    title: 'A FEW MOMENTS, KEPT SAFE',
    caption: 'even the quiet days feel warmer with you',
  },
  {
    src: '/gallery/universe-flowers.png',
    title: 'A FEW MOMENTS, KEPT SAFE',
    caption: 'us, blooming slowly',
  },
  {
    src: '/gallery/universe-cafe.png',
    title: 'A FEW MOMENTS, KEPT SAFE',
    caption: 'small memories, kept forever',
  },
  {
    src: '/gallery/universe-stars.png',
    title: 'A FEW MOMENTS, KEPT SAFE',
    caption: 'in every universe, somehow still us',
  },
]

export const FUN_FACTS = [
  'We started as cousins who fought like rivals.',
  'We never imagined we’d end up here.',
  'Somehow the arguments turned into this beautiful relation.',
  'Now you’re my fiancé… and still my kucchu pucchu.',
  'Family may be strict — but my heart isn’t confused about you.',
]

export const LETTER = {
  greeting: 'Happy Birthday,',
  nickname: 'My kucchu pucchu,',
  body: [
    'Before our engagement, we were cousins who fought and never kept each other in mind like this.',
    'And then life surprised us — softly, strangely, beautifully — until we became us.',
    'I still can’t believe the same person I argued with became my favorite person, my safe place, and my forever.',
    'Today is your day. I hope it feels as warm as you make every ordinary day feel for me.',
    'Thank you for choosing this story with me.',
  ],
  signoff: 'Hamesha tumhara,',
  /** Change this to your name before sharing */
  name: 'Your KUcchu Puchu 🫂',
}

export const REVEAL_LINE = 'Open the gift box'
export const REVEAL_HINT =
  'After this, look for the real box I left for you nearby — open that one too.'

/** Secret code to open the gift inbox (for you — not for her) */
export const GIFT_INBOX_PASSCODE = 'giftbox'

export const GIFT_WISH = {
  badge: 'Mandatory · last step',
  title: `Stop, ${HER_NAME} ✋`,
  strict: 'You cannot finish this surprise without telling me your gift wish.',
  subtitle:
    'Be honest and specific — write the gift YOU want. No skipping. No “anything is fine”.',
  label: 'The gift I want is…',
  placeholder: 'e.g. a soft hoodie, a watch, a day out together, earrings…',
  hint: 'Minimum a few words. This is required 🔒',
  submit: 'Lock my gift wish 🔒',
  errorEmpty: 'Nope — you must write a gift wish first.',
  errorShort: 'Too short. Tell me clearly what you want 🥺',
  successTitle: 'Wish locked 💝',
  successBody: 'I will see this. No take-backs. Thank you for telling me, jaan.',
}
