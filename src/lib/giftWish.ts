const STORAGE_KEY = 'little-universe-gift-wishes'

export type GiftWish = {
  id: string
  name: string
  wish: string
  createdAt: string
}

function readAll(): GiftWish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as GiftWish[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(list: GiftWish[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function saveGiftWish(name: string, wish: string): GiftWish {
  const entry: GiftWish = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    wish: wish.trim(),
    createdAt: new Date().toISOString(),
  }
  const next = [entry, ...readAll()].slice(0, 20)
  writeAll(next)
  return entry
}

export function getGiftWishes(): GiftWish[] {
  return readAll()
}

export function getLatestGiftWish(): GiftWish | null {
  return readAll()[0] ?? null
}

export function encodeGiftWishForLink(wish: GiftWish): string {
  const payload = JSON.stringify({
    n: wish.name,
    w: wish.wish,
    t: wish.createdAt,
  })
  return btoa(unescape(encodeURIComponent(payload)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeGiftWishFromLink(token: string): GiftWish | null {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
    const json = decodeURIComponent(escape(atob(b64 + pad)))
    const data = JSON.parse(json) as { n?: string; w?: string; t?: string }
    if (!data.w) return null
    return {
      id: 'link',
      name: data.n || 'Aliha',
      wish: data.w,
      createdAt: data.t || new Date().toISOString(),
    }
  } catch {
    return null
  }
}
