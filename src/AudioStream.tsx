import React, { useRef, useEffect, AudioHTMLAttributes } from 'react'

export const AudioStream: React.FC<AudioHTMLAttributes<HTMLAudioElement> & { stream?: MediaStream }> = ({
  stream,
  ...props
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (stream) {
        audioRef.current.srcObject = stream
        // TODO: DOMException: The play() request was interrupted by a new load request.
        audioRef.current.play().catch(console.error)
      } else {
        ;(audioRef.current.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop())
        audioRef.current.srcObject = null
      }
    }
  }, [stream])

  return <audio ref={audioRef} controls playsInline autoPlay {...props} />
}
