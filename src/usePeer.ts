import Peer from 'skyway-js'
import { useEffect, useRef, useState } from 'react'

export function usePeer(id: string) {
  const ref = useRef<Peer | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  useEffect(() => {
    ref.current = new Peer(id, {
        key: process.env.REACT_APP_SKYWAY_KEY ?? 'PLEASE SET SKYWAY_KEY',
        debug: 3,
      })
    setPeer(ref.current)
    return () => ref?.current?.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return peer
}
