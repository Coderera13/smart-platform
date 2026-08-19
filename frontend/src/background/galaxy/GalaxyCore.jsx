import * as THREE from "three";

export default function GalaxyCore() {

    return (

        <mesh>

            <circleGeometry args={[2.2,128]} />

            <meshBasicMaterial

                color="#ffe8c2"

                transparent

                opacity={1}

                blending={THREE.AdditiveBlending}

                depthWrite={false}

            />

        </mesh>

    );

}