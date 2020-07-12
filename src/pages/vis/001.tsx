import * as React from "react"
import { useRef } from "react"
import * as Meyda from "meyda"
import { motion, useMotionValue, useAnimation, useSpring } from "framer-motion"
import { Canvas, useFrame } from "react-three-fiber"
import { Mesh } from "three"

const features = [
    "amplitudeSpectrum",
    "chroma",
    "complexSpectrum",
    "energy",
    "loudness",
    "mfcc",
    "perceptualSharpness",
    "perceptualSpread",
    "powerSpectrum",
    "rms",
    "spectralCentroid",
    "spectralFlatness",
    "spectralFlux",
    "spectralKurtosis",
    "spectralRolloff",
    "spectralSkewness",
    "spectralSlope",
    "spectralSpread",
    "zcr",
    "buffer",
]

function InnerCanvas(props) {
    const { value } = props
    const mesh = useRef<Mesh>()
    const springVal = useSpring(value, {
        stiffness: 100,
        damping: 60,
        mass: 0.05,
    })

    useFrame(() => {
        const size = Math.max(1 + springVal.get() * 0.1, 1)
        mesh.current.scale.set(size, size, size)
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01
    })

    return (
        <mesh {...props} ref={mesh}>
            <meshBasicMaterial attach="material" color="pink" />
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        </mesh>
    )
}

export default function Vis() {
    const spectralCentroid = useMotionValue<number>(0)
    const rms = useMotionValue<number>(0)
    const zcr = useMotionValue<number>(0)
    const analyzer = useRef<Meyda.MeydaAnalyzer>()

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

                if (analyzer.current) analyzer.current.stop()

                analyzer.current = Meyda.createMeydaAnalyzer({
                    audioContext: audioContext,
                    source: source,
                    bufferSize: 512,
                    featureExtractors: ["rms", "spectralCentroid", "zcr"],
                    callback: (features: any) => {
                        rms.set(features.rms * 10)
                        zcr.set(features.zcr * 0.03921568627)
                        spectralCentroid.set(features.spectralCentroid * 0.1)
                    },
                })
                analyzer.current.start()
            })
    }, [rms])

    return (
        <div className="App">
            <Canvas
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            >
                <InnerCanvas value={spectralCentroid} position={[0, 2, 0]} />
                <InnerCanvas value={rms} />
                <InnerCanvas value={zcr} position={[0, -2, 0]} />
            </Canvas>
        </div>
    )
}
