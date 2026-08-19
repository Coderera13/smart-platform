import * as THREE from "three";
import { useMemo } from "react";
import { CENTER, ORBITS } from "./orbitConfig";

function Orbit({ orbit }) {

    const points = useMemo(() => {
        return orbit.curve.getPoints(600);
    }, [orbit]);

    const geometry = useMemo(() => {

        return new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, 0))
        );
    }, [points]);

    return (

        <line
            geometry={geometry}
            position={CENTER}
            rotation={orbit.rotation}
            renderOrder={-20}
        >

            <lineBasicMaterial
                color={orbit.color}
                transparent
                opacity={orbit.opacity}
                depthWrite={false}
            />
        </line>
    );
}

export default function PlanetOrbits() {

    return (
        <group>
            <Orbit orbit={ORBITS.neptune} />
            <Orbit orbit={ORBITS.saturn} />
        </group>
    );
}