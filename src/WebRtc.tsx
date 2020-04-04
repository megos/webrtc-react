import React, { useRef, useEffect, useState } from 'react'
import { usePeer } from './usePeer'

const WebRtc: React.FC = () => {
  const myVideoRef = useRef<HTMLVideoElement | null>(null)
  const theirVideoRef = useRef<HTMLVideoElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const peer = usePeer()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef?.current) {
          myVideoRef.current.srcObject = stream
        }
      })
      .catch((e) => setErrorMessage(e))
  }, [])

  return (
    <>
      <div>{errorMessage}</div>
      <video ref={myVideoRef} muted playsInline autoPlay />
      <video ref={theirVideoRef} playsInline autoPlay />
    </>
  )
}

export default WebRtc
