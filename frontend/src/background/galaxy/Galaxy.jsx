import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import GalaxyCore from "./GalaxyCore";
import GalaxyGlow from "./GalaxyGlow";
import GalaxyDust from "./GalaxyDust";
import GalaxyEmission from "./GalaxyEmission";
import GalaxyStars from "./GalaxyStars";

export default function Galaxy() {

    const galaxy = useRef();

    const glow = useRef();
    const core = useRef();
    const dust = useRef();
    const emission = useRef();
    const stars = useRef();

    useFrame(() => {

        if (!galaxy.current) return;

        glow.current.rotation.z += 0.00020;

        core.current.rotation.z += 0.00034;

        dust.current.rotation.z += 0.00045;

        emission.current.rotation.z += 0.00048;

        stars.current.rotation.z += 0.00060;

    });

    return (

        <group

            ref={galaxy}

            position={[-18,9,-42]}

        >

            <group ref={glow}>
                <GalaxyGlow />
            </group>

            <group ref={core}>
                <GalaxyCore />
            </group>

            <group ref={dust}>
                <GalaxyDust />
            </group>

            <group ref={emission}>
                <GalaxyEmission />
            </group>

            <group ref={stars}>
                <GalaxyStars />
            </group>

        </group>

    );

}