import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing';

export function PostEffects() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.4} intensity={1.8} distanceFalloff={0.8} quality="low" />
      <Bloom intensity={0.12} luminanceThreshold={0.92} luminanceSmoothing={0.4} mipmapBlur />
      <Vignette offset={0.25} darkness={0.45} eskil={false} />
    </EffectComposer>
  );
}
