import React, { useRef, useEffect, VideoHTMLAttributes } from 'react'

export const VideoStream: React.FC<VideoHTMLAttributes<HTMLVideoElement> & { stream?: MediaStream }> = ({
  stream,
  ...props
}) => {
  const ref = useRef<HTMLVideoElement | null>(null)

  const destory = () => {
    ;(ref.current?.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop())
    if (ref.current) ref.current.srcObject = null
  }

  useEffect(() => {
    if (ref.current) {
      if (stream) {
        ref.current.srcObject = stream
        // TODO: DOMException: The play() request was interrupted by a new load request.
        ref.current.play().catch(console.error)
      } else {
        destory()
      }
    }
  }, [stream])

  useEffect(() => destory, [])

  return <video ref={ref} playsInline autoPlay {...props} />
}
