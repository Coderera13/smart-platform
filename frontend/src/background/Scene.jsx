import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CAMERA } from "./config";
import * as THREE from "three";

export default function Scene({ children, active }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{
        position: CAMERA.position,
        fov: CAMERA.fov,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
      }}
    >
      <ambientLight
        intensity={0.18}
        color="#AFCFFF"
      />
      <directionalLight
        position={[-25, 10, 12]}
        intensity={3.0}
        color="#FFF7E5"
        castShadow
      />
      <pointLight
        position={[-18, 9, -42]}
        intensity={7}
        distance={140}
        decay={2}
        color="#FFD7A3"
      />
      <EffectComposer multisampling={8}>
        <Bloom
          mipmapBlur
          intensity={0.8}
          luminanceThreshold={0.012}
          luminanceSmoothing={0.8}
        />
      </EffectComposer>
      {children}
    </Canvas>
  );
}