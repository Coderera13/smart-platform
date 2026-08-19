import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const COUNT = 1000;

const VERTEX = `
attribute float aSize;
attribute float aSeed;
uniform float uTime;
varying float vSeed;

void main(){

    vec3 pos = position;
    pos.x += sin(uTime*0.06 + aSeed)*0.25;
    pos.y += cos(uTime*0.08 + aSeed)*0.18;
    vSeed = aSeed;
    vec4 mvPosition = modelViewMatrix * vec4(pos,1.0);
    gl_PointSize = aSize * (40.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT = `
uniform float uTime;
varying float vSeed;
void main(){

    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5,0.0,d);
    float twinkle =
        0.55 +
        0.45 *
        sin(
            uTime*2.5 +
            vSeed*6.28318
        );
    vec3 blue =
        vec3(0.82,0.94,1.0);
    vec3 purple =
        vec3(0.95,0.82,1.0);
    vec3 color =
        mix(
            blue,
            purple,
            fract(vSeed)
        );
    gl_FragColor =
        vec4(
            color,
            alpha * twinkle * 0.65
        );
}
`;

export default function MicroParticles(){

    const material = useRef();
    const geometry = useMemo(()=>{
        const g = new THREE.BufferGeometry();
        const positions = [];
        const sizes = [];
        const seeds = [];

        for(let i=0;i<COUNT;i++){
            positions.push(
                THREE.MathUtils.randFloatSpread(90),
                THREE.MathUtils.randFloatSpread(55),
                THREE.MathUtils.randFloat(-50,-6)
            );
            sizes.push(
                THREE.MathUtils.randFloat(0.7,2.2)
            );
            seeds.push(Math.random());
        }
        g.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                positions,3
            )
        );
        g.setAttribute(
            "aSize",
            new THREE.Float32BufferAttribute(
                sizes,1
            )
        );
        g.setAttribute(
            "aSeed",
            new THREE.Float32BufferAttribute(
                seeds,
                1
            )
        );
        return g;
    },[]);
    useFrame(({clock})=>{
        material.current.uniforms.uTime.value =
            clock.elapsedTime;
    });

    return(
        <points geometry={geometry}>
            <shaderMaterial
                ref={material}
                transparent
                depthWrite={false}
                depthTest={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime:{value:0}
                }}
                vertexShader={VERTEX}
                fragmentShader={FRAGMENT}
            />
        </points>
    );
}