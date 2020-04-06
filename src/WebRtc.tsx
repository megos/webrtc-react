import React, { useRef, useEffect, useState } from 'react'
import { usePeer } from './usePeer'
import { MeshRoom, RoomStream } from 'skyway-js'
import RemoteVideo from './RemoveVideo'

const WebRtc: React.FC = () => {
  const myVideoRef = useRef<HTMLVideoElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const roomRef = useRef<MeshRoom | null>(null)
  const [remoteStreams, setRemoteStreams] = useState(new Map<string, RoomStream>())
  const peer = usePeer()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideoRef.current!.srcObject = stream
      })
      .catch((e) => setErrorMessage(e))
  }, [peer])


  const handleJoinRoom = () => {
    roomRef!.current = peer!.joinRoom('roomName', {
      mode: 'mesh',
      stream: myVideoRef.current!.srcObject as MediaStream,
    }) as MeshRoom
    roomRef.current.on('stream',  (stream) => {
      setRemoteStreams(streams => {
        streams.set(stream.peerId, stream)
          return new Map(streams)
      })
    })
  }

  return (
    <>
      <div>{errorMessage}</div>
      <button onClick={handleJoinRoom}>join room</button>
      <video ref={myVideoRef} muted playsInline autoPlay />
      {[...remoteStreams.values()].map((stream)  => {
        return <RemoteVideo key={stream.peerId} stream={stream} />
      })}
    </>
  )
}

export default WebRtc
