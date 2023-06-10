import React, { useRef, useEffect, AudioHTMLAttributes } from 'react'

export const AudioStream: React.FC<AudioHTMLAttributes<HTMLAudioElement> & { stream?: MediaStream }> = ({
  stream,
  ...props
}) => {
  const ref = useRef<HTMLAudioElement | null>(null)

  const destory = () => {
    (ref.current?.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop())
    if (ref.current) ref.current.srcObject = null
  }

  useEffect(() => {
    if (ref.current) {
      if (stream) {
        ref.current.srcObject = stream
        ref.current.play().catch(console.error)
      } else {
        (ref.current.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop())
        ref.current.srcObject = null
      }
    }
  }, [stream])

  useEffect(() => destory, [])

  return <audio ref={ref} controls playsInline autoPlay {...props} />
}
