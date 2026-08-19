import * as THREE from "three";

export default function GalaxyGlow() {

    return (

        <mesh>

            <circleGeometry args={[3.8,128]} />

            <meshBasicMaterial

                color="#7cb7ff"

                transparent

                opacity={0.20}

                blending={THREE.AdditiveBlending}

                depthWrite={false}

            />

        </mesh>

    );

}