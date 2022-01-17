import { useRef, useEffect } from "react";
import Meyda from "meyda";
import { motionValue, MotionValue } from "framer-motion";
import { MeydaAudioFeature } from "meyda";

export function useMeydaAudioFeatures(
  features: MeydaAudioFeature[]
): Meyda.MeydaAnalyzer {
  const analyzer = useRef<Meyda.MeydaAnalyzer>();
  const featureMotionValues = useRef<AudioFeatureMotionValues>({});

  if (Object.keys(featureMotionValues.current).length === 0) {
    features.map(
      (feature) => (featureMotionValues.current[feature] = motionValue(0))
    );
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        const audioContext = new AudioContext();
        // Now we need to have the audio context take control of your HTML Audio Element.
        // Create an "Audio Node" from the Audio Element
        const source = audioContext.createMediaStreamSource(stream);
        if (analyzer.current) analyzer.current.stop();

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
                  );
                  break;
                default:
                  featureMotionValues.current[feature].set(
                    featureValues[feature].total
                  );
                  break;
              }
            });
          },
        });
        analyzer.current.start();
      });
  }, []);

  return featureMotionValues.current as any;
}
export const audioFeatures: MeydaAudioFeature[] = [
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
];
// | 'spectralFlux'
// | 'spectralKurtosis'
// | 'spectralRolloff'
// | 'spectralSkewness'
// | 'spectralSlope'
// | 'spectralSpread'
type Init<T> = () => T;
/**
 * Creates a constant value over the lifecycle of a component.
 *
 * Even if `useMemo` is provided an empty array as its final argument, it doesn't offer
 * a guarantee that it won't re-run for performance reasons later on. By using `useConstant`
 * you can ensure that initialisers don't execute twice or more.
 */

export function useConstant<T>(init: Init<T>) {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = init();
  }

  return ref.current;
}
interface AudioFeatureMotionValues {
  [key: string]: MotionValue<number>;
}
