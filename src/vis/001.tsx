import * as React from "react"
import { useRef, useEffect, useState } from "react"
// @ts-ignore
import Meyda from "https://jspm.dev/meyda"
import {
    motion,
    useMotionValue,
    motionValue,
    useSpring,
    MotionValue,
} from "framer-motion"
import { Html } from "@react-three/drei"
import { Canvas, useFrame } from "react-three-fiber"
import type * as THREE from "three"
import type { MeydaAudioFeature } from "meyda"

const audioFeatures: MeydaAudioFeature[] = [
    // "amplitudeSpectrum",
    // "chroma",
    // "complexSpectrum",
    "energy",
    "loudness",
    // "mfcc",
    "perceptualSharpness",
    "perceptualSpread",
    // "powerSpectrum",
    "rms",
    "spectralCentroid",
    "spectralFlatness",
    // "spectralFlux",
    "spectralKurtosis",
    "spectralRolloff",
    "spectralSkewness",
    "spectralSlope",
    "spectralSpread",
    "zcr",
    // "buffer",
]

// | 'spectralFlux'
// | 'spectralKurtosis'
// | 'spectralRolloff'
// | 'spectralSkewness'
// | 'spectralSlope'
// | 'spectralSpread'

type Init<T> = () => T

/**
 * Creates a constant value over the lifecycle of a component.
 *
 * Even if `useMemo` is provided an empty array as its final argument, it doesn't offer
 * a guarantee that it won't re-run for performance reasons later on. By using `useConstant`
 * you can ensure that initialisers don't execute twice or more.
 */
export function useConstant<T>(init: Init<T>) {
    const ref = useRef<T | null>(null)

    if (ref.current === null) {
        ref.current = init()
    }

    return ref.current
}

interface AudioFeatureMotionValues {
    [key: string]: MotionValue<number>
}

function useMeydaAudioFeatures(
    features: MeydaAudioFeature[]
): Meyda.MeydaAnalyzer {
    const analyzer = useRef<Meyda.MeydaAnalyzer>()
    const featureMotionValues = useRef<AudioFeatureMotionValues>({})

    if (Object.keys(featureMotionValues.current).length === 0) {
        features.map(
            (feature) => (featureMotionValues.current[feature] = motionValue(0))
        )
    }

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(function (stream) {
                const audioContext = new AudioContext()
                // Now we need to have the audio context take control of your HTML Audio Element.
                // Create an "Audio Node" from the Audio Element
                const source = audioContext.createMediaStreamSource(stream)
                if (analyzer.current) analyzer.current.stop()

                analyzer.current = Meyda.createMeydaAnalyzer({
                    audioContext: audioContext,
                    source: source,
                    bufferSize: 512,
                    featureExtractors: features,
                    callback: (featureValues: any) => {
                        features.map((feature) => {
                            // console.log(feature, featureValues[feature])
                            switch (feature) {
                                case "loudness":
                                    featureMotionValues.current[feature].set(
                                        featureValues[feature]
                                    )
                                    break
                                default:
                                    featureMotionValues.current[feature].set(
                                        featureValues[feature].total
                                    )
                                    break
                            }
                        })
                    },
                })
                analyzer.current.start()
            })
    }, [])

    return featureMotionValues.current
}

function MotionValueDebug({ motionVal }: { motionVal: MotionValue }) {
    const [mv, setMv] = useState("")
    // useEffect(() => motionVal.onChange((value) => setMv(value)))
    return <h2>{mv}</h2>
}

function InnerCanvas(props: { value: MotionValue }) {
    const { value } = props
    const mesh = useRef<THREE.Mesh>()
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
            <Html>
                <MotionValueDebug motionVal={value} />
            </Html>
            <meshBasicMaterial color="pink" transparent opacity={0.3} />
            <boxBufferGeometry args={[0.3, 0.3, 0.3]} />
        </mesh>
    )
}

export default function Vis() {
    // rms.onChange((latest) => console.log(typeof latest))
    // ["rms", "spectralCentroid", "zcr"]
    const features = useMeydaAudioFeatures(audioFeatures)

    // rms.set(features.rms * 10)
    // zcr.set(features.zcr * 0.03921568627 * 10)
    // spectralCentroid.set(features.spectralCentroid * 0.1)
    // console.log(Features)
    // useEffect(() => rms.onChange(value => console.log(value)),[])

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
                {Object.keys(features).map((feature, i) => {
                    return (
                        <InnerCanvas
                            key={feature}
                            value={features[feature]}
                            position={[0, -2.5 + i * 0.3, 0]}
                        />
                    )
                })}
            </Canvas>
        </div>
    )
}
