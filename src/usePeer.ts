import Peer from 'skyway-js'
import { useEffect, useRef } from 'react'

export function usePeer() {
  const ref = useRef<Peer | null>(null)
  useEffect(() => {
    ref.current = new Peer({
      key: process.env.REACT_APP_SKYWAY_KEY ?? 'PLEASE SET SKYWAY_KEY',
      debug: process.env.NODE_ENV === 'development' ? 3 : 0,
    })
    return () => ref.current?.destroy()
  }, [])
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
