import React, { useRef, useEffect } from 'react'

const RemoteVideo: React.FC<any> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream 
  }, [stream])

  return (
    <video ref={videoRef} muted playsInline autoPlay />
  )
}

export default RemoteVideo
