import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

import aurora1 from "../textures/dark/aurora/01.png";
import aurora2 from "../textures/dark/aurora/05.png";
import aurora3 from "../textures/dark/aurora/06.png";

const LAYERS = [
  {
    texture: aurora1,
    position: [0, 2, -65],
    scale: [120, 70],
    color: "#4DA8FF",
    opacity: 0.02,
    rotation: 0.08,
    speed: 0.010,
  },

  {
    texture: aurora2,
    position: [10, -5, -62],
    scale: [105, 62],
    color: "#B678FF",
    opacity: 0.035,
    rotation: -0.05,
    speed: 0.008,
  },

  {
    texture: aurora3,
    position: [-8, 6, -60],
    scale: [135, 82],
    color: "#FFD4FF",
    opacity: 0.02,
    rotation: 0.03,
    speed: 0.006,
  },
];

function AuroraLayer({ layer, texture }) {

    const mesh = useRef();

    useFrame(({ clock }) => {
        if(!mesh.current) return;

        mesh.current.position.x =
            layer.position[0] +
            Math.sin(
                clock.elapsedTime * layer.speed
            ) * 2.2;

        mesh.current.position.y =
            layer.position[1] +
            Math.cos(
                clock.elapsedTime * layer.speed
            ) * 1.1;
    });

    return (
        <mesh
          renderOrder={-10}
            ref={mesh}
            position={layer.position}
            rotation={[0,0,layer.rotation]}
        >

            <planeGeometry args={layer.scale}/>

            <meshBasicMaterial
                map={texture}
                transparent
                color={layer.color}
                opacity={layer.opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                depthTest={false}
                side={THREE.DoubleSide}
                toneMapped={false}
            />

        </mesh>
    );
}

export default function Aurora(){

    const textures = useLoader(
        THREE.TextureLoader,
        LAYERS.map(layer => layer.texture)
    );

    textures.forEach(texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
    });

    return (
        <>
            {
                LAYERS.map((layer,index)=>(
                    <AuroraLayer
                        key={index}
                        layer={layer}
                        texture={textures[index]}
                    />
                ))
            }
        </>
    );
}