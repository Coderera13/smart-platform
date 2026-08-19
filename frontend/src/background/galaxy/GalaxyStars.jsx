import * as THREE from "three";

export default function GalaxyStars() {

    return (

        <mesh>

            <ringGeometry args={[3.2,4.8,128]} />

            <meshBasicMaterial

                color="white"

                transparent

                opacity={0.10}

                blending={THREE.AdditiveBlending}

            />

        </mesh>

    );

}