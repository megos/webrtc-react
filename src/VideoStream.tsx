import React, { useRef, useEffect, VideoHTMLAttributes } from 'react'

export const VideoStream: React.FC<VideoHTMLAttributes<HTMLVideoElement> & { stream?: MediaStream }> = ({
  stream,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream
        // TODO: DOMException: The play() request was interrupted by a new load request.
        videoRef.current.play().catch(console.error)
      } else {
        (videoRef.current.srcObject as MediaStream | null)?.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  return <video ref={videoRef} playsInline autoPlay {...props} />
}
