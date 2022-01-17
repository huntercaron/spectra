import type * as THREE from "three";
import { useRef, useState } from "react";

import { useSpring, MotionValue } from "framer-motion";

import { Html } from "@react-three/drei";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";

import {
  useMeydaAudioFeatures,
  audioFeatures,
} from "../../lib/hooks/useMeydaAudioFeatures";

function MotionValueDebug({ motionVal }: { motionVal: MotionValue }) {
  const [mv, setMv] = useState("");
  // useEffect(() => motionVal.onChange((value) => setMv(value)))
  return <h2>{mv}</h2>;
}

interface InnerCanvasProps extends MeshProps {
  value: MotionValue;
}

function InnerCanvas(props: InnerCanvasProps) {
  const { value } = props;
  // console.log(value);

  const mesh = useRef<
    THREE.Mesh<THREE.BoxBufferGeometry, THREE.MeshBasicMaterial>
  >();

  const springVal = useSpring(value, {
    stiffness: 100,
    damping: 60,
    mass: 0.05,
  });

  useFrame(() => {
    // console.log(springVal.get());
    const size = Math.max(1 + springVal.get() * 0.1, 1);
    // console.log(size);
    mesh.current.scale.set(size, size, size);
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh {...props} ref={mesh}>
      <Html>
        <MotionValueDebug motionVal={value} />
      </Html>
      <meshBasicMaterial color="pink" transparent opacity={0.3} />
      <boxBufferGeometry args={[0.3, 0.3, 0.3]} />
    </mesh>
  );
}

export default function Vis() {
  // rms.onChange((latest) => console.log(typeof latest))
  // ["rms", "spectralCentroid", "zcr"]
  const features = useMeydaAudioFeatures(["rms"]);

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
          );
        })}
      </Canvas>
    </div>
  );
}
