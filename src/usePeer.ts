import Peer from 'skyway-js'
import { useEffect, useRef } from 'react'

export function usePeer() {
  const ref = useRef<Peer | null>(null)
  useEffect(() => {
    ref.current = new Peer({
      key: process.env.REACT_APP_SKYWAY_KEY ?? 'PLEASE SET SKYWAY_KEY',
      debug: 3,
    })
    return () => ref.current?.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return ref.current
}
