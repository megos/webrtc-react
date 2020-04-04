import React, { useRef, useEffect, useState } from 'react'
import { usePeer } from './usePeer'

const WebRtc: React.FC = () => {
  const myVideoRef = useRef<HTMLVideoElement | null>(null)
  const theirVideoRef = useRef<HTMLVideoElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const peer = usePeer('1')

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideoRef.current!.srcObject = stream
      })
      .catch((e) => setErrorMessage(e))

    peer?.on('call', (call) => {
      call.answer(myVideoRef?.current?.srcObject as MediaStream)
      call.on('stream', (stream) => {
        theirVideoRef.current!.srcObject = stream
      })
    })
  }, [peer])

  return (
    <>
      <div>{errorMessage}</div>
      <video ref={myVideoRef} muted playsInline autoPlay />
      <video ref={theirVideoRef} playsInline autoPlay />
    </>
  )
}

export default WebRtc
