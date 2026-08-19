import * as THREE from "three";

export default function GalaxyDust() {

    return (

        <mesh>

            <ringGeometry args={[2.4,4.2,128]} />

            <meshBasicMaterial

                color="#5c4b44"

                transparent

                opacity={0.35}

                side={THREE.DoubleSide}

            />

        </mesh>

    );

}