import { OrbitControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { Midi } from "@tonejs/midi"
import React from "react"
import { Suspense } from "react"
import { suspend, preload } from "suspend-react"

const midiPaths = [
  "midi/Afternoon Arp.mid",
  "midi/BMaj Chords.mid",
  "midi/FDOS Arp (MIDI CC01 Mod).mid",
  "midi/FDOS Arp.mid",
  "midi/Reflections Arp.mid",
]

function Inner(props: { midiPath: string }) {
  const { midiPath } = props
  const midi = suspend(async () => Midi.fromUrl(midiPath), [midiPath])

  const viewport = useThree((state) => state.viewport)

  const width = viewport.width
  const height = 2

  const track = midi.tracks[0]
  const length = track.endOfTrackTicks ?? 1000

  console.log(track)

  const maxValue = Math.max(...track.notes.map((obj) => obj.midi))
  const minValue = Math.min(...track.notes.map((obj) => obj.midi))
  const range = maxValue - minValue

  return (
    <>
      <group position={[width / -2, height / -2, 0]}>
        {track.notes.map((note, i) => {
          const time = note.ticks / length
          const nDuration = note.durationTicks / length

          const y = ((note.midi - minValue) / range) * height

          return (
            <mesh key={i} position={[time * width, y, 0]}>
              <boxGeometry args={[nDuration * width, 0.1, 0.01]} />
              <meshBasicMaterial color="blue" />
            </mesh>
          )
        })}
      </group>
    </>
  )
}

export default function Vis() {
  const [midiPath, setMidiPath] = React.useState(midiPaths[0])
  return (
    <>
      <select
        value={midiPath}
        onChange={(e) => setMidiPath(e.target.value)}
        style={{ position: "fixed", top: 10, left: 10, zIndex: 100 }}
      >
        {midiPaths.map((path) => (
          <option key={path}>{path}</option>
        ))}
      </select>

      <Canvas orthographic camera={{ zoom: 100 }}>
        <Suspense>
          <Inner midiPath={midiPath} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  )
}
