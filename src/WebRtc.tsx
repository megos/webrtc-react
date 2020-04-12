import React, { useRef, useEffect, useState } from 'react'
import { usePeer } from './usePeer'
import { MeshRoom, RoomStream } from 'skyway-js'
import { VideoStream } from './VideoStream'

const WebRtc: React.FC = () => {
  const [myStream, setMyStream] = useState<MediaStream | undefined>(undefined)
  const [log, setLog] = useState<string[]>([])
  const [text, setText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const roomRef = useRef<MeshRoom | undefined>(undefined)
  const [remoteStreams, setRemoteStreams] = useState(new Map<string, RoomStream>())
  const peer = usePeer()

  const pushLog = (message: string) => setLog((l) => l.concat([message]))

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(setMyStream).catch(setErrorMessage)
  }, [])

  const handleJoinRoom = () => {
    roomRef.current = peer?.joinRoom<MeshRoom>('roomName', {
      mode: 'mesh',
      stream: myStream,
    })
    const room = roomRef.current
    if (room) {
      room.once('open', () => pushLog('Room joined.'))
      room.on('peerJoin', (peerId) => pushLog(`Joined ${peerId}.`))
      room.on('peerLeave', (peerId) => {
        setRemoteStreams((streams) => {
          const ss = new Map(streams)
          ss.delete(peerId)
          return ss
        })
      })
      room.on('log', (logs) => {
        logs.forEach((log) => {
          const { messageType, message, timestamp } = JSON.parse(log)
          pushLog(`${messageType} ${timestamp} ${message}`)
        })
      })
      room.on('stream', (stream) => {
        setRemoteStreams((streams) => new Map(streams).set(stream.peerId, stream))
      })
      room.on('data', ({ src: srcPeerId, data }) => pushLog(`Received message from ${srcPeerId}, ${data}`))
      room.on('close', () => pushLog('Room leaved.'))
    }
  }

  const handleLeaveRoom = () => {
    roomRef.current?.close()
    setRemoteStreams(new Map())
  }

  const handleSendData = () => {
    roomRef.current?.send(text)
    setText('')
  }

  return (
    <>
      <div>{errorMessage}</div>
      <div>
        {log.map((l, index) => (
          <div key={index}>{l}</div>
        ))}
      </div>
      <div>
        <button onClick={handleJoinRoom}>join room</button>
        <button onClick={handleLeaveRoom}>leave room</button>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleSendData}>send data</button>
      </div>
      <VideoStream stream={myStream} muted />
      {[...remoteStreams.values()].map((stream) => {
        return <VideoStream key={stream.peerId} stream={stream} />
      })}
    </>
  )
}

export default WebRtc
