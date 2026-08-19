import * as THREE from "three";

export default function GalaxyEmission() {

    return (

        <mesh>

            <ringGeometry args={[2.8,4.4,128]} />

            <meshBasicMaterial

                color="#ff66c4"

                transparent

                opacity={0.20}

                blending={THREE.AdditiveBlending}

            />

        </mesh>

    );

}