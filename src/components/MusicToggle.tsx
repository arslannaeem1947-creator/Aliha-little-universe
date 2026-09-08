import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'

/** Ishq Murshid instrumental (from your YouTube embed) */
const YT_VIDEO_ID = 'W74-U02SnHY'

type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (n: number) => void
  getPlayerState: () => number
  destroy: () => void
}

type MusicContextValue = {
  enabled: boolean
  toggle: () => void
  unlockAudio: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string
          width?: number
          height?: number
          playerVars?: Record<string, string | number>
          events?: {
            onReady?: (e: { target: YTPlayer }) => void
            onStateChange?: (e: { data: number; target: YTPlayer }) => void
          }
        },
      ) => YTPlayer
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  return new Promise((resolve) => {
    const prior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prior?.()
      resolve()
    }
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'yt-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [ready, setReady] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const wantPlay = useRef(false)

  useEffect(() => {
    let cancelled = false
    const wrap = document.createElement('div')
    wrap.setAttribute('aria-hidden', 'true')
    wrap.style.cssText =
      'position:fixed;width:1px;height:1px;left:-9999px;top:0;opacity:0;pointer-events:none;overflow:hidden;'
    const mount = document.createElement('div')
    wrap.appendChild(mount)
    document.body.appendChild(wrap)
    hostRef.current = wrap

    void loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return
      playerRef.current = new window.YT.Player(mount, {
        videoId: YT_VIDEO_ID,
        width: 200,
        height: 112,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          // Required for single-video loop
          playlist: YT_VIDEO_ID,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(45)
            setReady(true)
            if (wantPlay.current) {
              e.target.playVideo()
              setEnabled(true)
            }
          },
          onStateChange: (e) => {
            // Re-loop if playlist loop fails
            if (e.data === window.YT?.PlayerState.ENDED) {
              e.target.playVideo()
            }
            if (e.data === window.YT?.PlayerState.PLAYING) setEnabled(true)
            if (e.data === window.YT?.PlayerState.PAUSED) setEnabled(false)
          },
        },
      })
    })

    return () => {
      cancelled = true
      try {
        playerRef.current?.destroy()
      } catch {
        /* ignore */
      }
      playerRef.current = null
      wrap.remove()
      hostRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    wantPlay.current = true
    const player = playerRef.current
    if (!player || !ready) return
    try {
      player.setVolume(45)
      player.playVideo()
      setEnabled(true)
    } catch {
      setEnabled(false)
    }
  }, [ready])

  const pause = useCallback(() => {
    wantPlay.current = false
    try {
      playerRef.current?.pauseVideo()
    } catch {
      /* ignore */
    }
    setEnabled(false)
  }, [])

  const unlockAudio = useCallback(() => {
    play()
  }, [play])

  const toggle = useCallback(() => {
    if (enabled) {
      pause()
      return
    }
    play()
  }, [enabled, pause, play])

  const value = useMemo(
    () => ({ enabled, toggle, unlockAudio }),
    [enabled, toggle, unlockAudio],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}

export function MusicToggle() {
  const { enabled, toggle } = useMusic()
  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Mute music' : 'Play music'}
      whileHover={{ scale: 1.08, rotate: -2 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border-[3px] border-white bg-white/95 px-4 py-2.5 text-sm font-extrabold text-rose-deep shadow-[0_5px_0_rgba(255,107,157,0.25),0_12px_28px_rgba(61,42,74,0.12)] backdrop-blur-md"
    >
      <span className="text-base">{enabled ? '🎵' : '▶️'}</span>
      <span>{enabled ? 'Music on' : 'Play music'}</span>
    </motion.button>
  )
}
