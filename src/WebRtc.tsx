import React, { useRef, useEffect, useState } from 'react'
import { usePeer } from './usePeer'
import { MeshRoom, RoomStream } from 'skyway-js'
import { VideoStream } from './VideoStream'

const WebRtc: React.FC = () => {
  const [myStream, setMyStream] = useState<MediaStream | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const roomRef = useRef<MeshRoom | undefined>(undefined)
  const [remoteStreams, setRemoteStreams] = useState(new Map<string, RoomStream>())
  const peer = usePeer()

  useEffect(() => {
    if (!myStream) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(setMyStream)
        .catch(setErrorMessage)
    }
  }, [myStream, peer])


  const handleJoinRoom = () => {
    roomRef.current = peer?.joinRoom<MeshRoom>('roomName', {
      mode: 'mesh',
      stream: myStream,
    })
    roomRef.current?.on('stream',  (stream) => {
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
      <VideoStream stream={myStream} muted />
      {[...remoteStreams.values()].map((stream)  => {
        return <VideoStream key={stream.peerId} stream={stream} />
      })}
    </>
  )
}

export default WebRtc
