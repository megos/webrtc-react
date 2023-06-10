import Peer, { PeerConstructorOption } from 'skyway-js'
import { useEffect, useRef } from 'react'

const options: PeerConstructorOption = {
  key: import.meta.env.VITE_SKYWAY_KEY ?? 'PLEASE SET SKYWAY_KEY',
  debug: process.env.NODE_ENV === 'development' ? 3 : 0,
}

export function usePeer(id?: string) {
  const ref = useRef<Peer | null>(null)
  useEffect(() => {
    ref.current = id ? new Peer(id, options) : new Peer(options)
    return () => ref.current?.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return ref.current
}

export function useCreatePeer() {
  const ref = useRef<Peer | null>(null)
  useEffect(() => () => ref.current?.destroy(), [])
  return (id: string) => {
    ref.current = new Peer(id, {
      key: process.env.SKYWAY_KEY ?? 'PLEASE SET SKYWAY_KEY',
      debug: process.env.NODE_ENV === 'development' ? 3 : 0,
    })
    return ref.current
  }
}
