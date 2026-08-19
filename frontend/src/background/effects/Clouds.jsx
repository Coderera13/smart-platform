import { Cloud } from "@react-three/drei";

export default function Clouds() {
  return (
    <>
      {/* Left Bottom */}
      <Cloud
        position={[-8, -3, -6]}
        scale={2.8}
        speed={0.15}
        opacity={0.35}
        color="#4ecbff"
      />

      {/* Left Middle */}
      <Cloud
        position={[-5, 2, -5]}
        scale={2.2}
        speed={0.12}
        opacity={0.28}
        color="#61c7ff"
      />

      {/* Top Right */}
      <Cloud
        position={[7, 3, -6]}
        scale={3.5}
        speed={0.18}
        opacity={0.40}
        color="#ff4ad8"
      />

      {/* Right Bottom */}
      <Cloud
        position={[6, -3, -5]}
        scale={3}
        speed={0.14}
        opacity={0.35}
        color="#b65cff"
      />

      {/* Center */}
      <Cloud
        position={[0, 0.8, -8]}
        scale={1.6}
        speed={0.08}
        opacity={0.18}
        color="#ffffff"
      />
    </>
  );
}