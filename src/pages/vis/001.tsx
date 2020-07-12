import * as React from "react"
import { useRef } from "react"
import * as Meyda from "meyda"
import { motion, useMotionValue, useAnimation } from "framer-motion"
import { Canvas } from "react-three-fiber"

export default function Vis() {
    const rms = useMotionValue<number>(0)
    const mounted = useRef(false)
    const analyzer = useRef<any>()

    const controls = useAnimation()

    // rms.onChange((latest) => console.log(typeof latest))

    React.useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(function (stream) {
                const audioContext = new AudioContext()
                //Now we need to have the audio context take control of your HTML Audio Element.
                // Create an "Audio Node" from the Audio Element
                const source = audioContext.createMediaStreamSource(stream)
                // Connect the Audio Node to your speakers. Now that the audio lives in the
                // Audio Context, you have to explicitly connect it to the speakers in order to
                // hear it
                // source.connect(audioContext.destination)

                // jesus how do i mute this

                if (analyzer.current) analyzer.stop()

                analyzer.current = Meyda.createMeydaAnalyzer({
                    audioContext: audioContext,
                    source: source,
                    bufferSize: 512,
                    featureExtractors: ["rms"],
                    callback: (features: any) => {
                        const num: number = parseFloat(features.rms) * 100
                        const number = +num.toFixed(2)
                        if (typeof number !== "number") return
                        // console.log(features.rms)
                        controls.start({ scale: number })
                    },
                })
                analyzer.current.start()
            })
    }, [rms])
    return (
        <div className="App">
            <h1>Hello CodeSandbox</h1>
            <h2>Start editing to see some magic happen!</h2>
            <motion.div
                onTap={() => console.log(rms.get())}
                style={{
                    backgroundColor: "blue",
                    width: 50,
                    height: 50,
                    margin: "auto",
                    scale: 1,
                }}
                animate={controls}
            />

            <Canvas
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            >
                <mesh position={[0, 0, 0]}>
                    <meshBasicMaterial attach="material" color="pink" />
                    <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                </mesh>
            </Canvas>
        </div>
    )
}
