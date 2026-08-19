import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";

import dustSmall from "../textures/dark//particles/dust_small.png";
import dustMedium from "../textures/dark/particles/dust_medium.png";
import dustLarge from "../textures/dark/particles/dust_large.png";

const LAYERS = [
  {
        texture: dustSmall,
        count: 650,
        size: 0.45,
        opacity: 0.25,
        spread: 95,
        depth: [-45,-10]
  },

  {
        texture: dustMedium,
        count: 300,
        size: 0.70,
        opacity: 0.35,
        spread: 80,
        depth: [-38,-8]
  },

  {
        texture: dustLarge,
        count: 120,
        size: 1.10,
        opacity: 0.45,
        spread: 60,
        depth: [-30,-6]
  }
];

function createGeometry(layer) {

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(layer.count * 3);
    const sizes = new Float32Array(layer.count);
    const alphas = new Float32Array(layer.count);
    const offsets = new Float32Array(layer.count);

    for (let i = 0; i < layer.count; i++) {

        positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(layer.spread);
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(layer.spread * 0.6);
        positions[i * 3 + 2] = THREE.MathUtils.randFloat(layer.depth[0], layer.depth[1]);

        sizes[i] = THREE.MathUtils.randFloat(0.6, 1.8);

        alphas[i] = THREE.MathUtils.randFloat(0.4, 1.0);

        offsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizes, 1)
    );

    geometry.setAttribute(
        "aAlpha",
        new THREE.BufferAttribute(alphas, 1)
    );

    geometry.setAttribute(
        "aOffset",
        new THREE.BufferAttribute(offsets, 1)
    );

    return geometry;
}

const PARTICLE_VERTEX = `
attribute float aSize;
attribute float aAlpha;
attribute float aOffset;

varying float vAlpha;

uniform float uTime;

void main(){

    vec3 pos = position;

    pos.x += sin(uTime*0.12 + aOffset) * 0.25;
    pos.y += cos(uTime*0.18 + aOffset) * 0.18;
    pos.z += sin(uTime*0.08 + aOffset) * 0.12;

    vAlpha =
        aAlpha *
        (0.7 + 0.3*sin(uTime*0.8 + aOffset));

    vec4 mvPosition =
        modelViewMatrix *
        vec4(pos,1.0);

    gl_PointSize =
        aSize *
        32.0 /
        -mvPosition.z;

    gl_Position =
        projectionMatrix *
        mvPosition;
}
`;

const PARTICLE_FRAGMENT = `
uniform sampler2D uTexture;

varying float vAlpha;

void main(){

    vec4 tex =
        texture2D(
            uTexture,
            gl_PointCoord
        );

    vec3 color =
        mix(
            vec3(0.80,0.93,1.0),
            vec3(0.95,0.78,1.0),
            tex.r*0.35
        );

    gl_FragColor =
        vec4(
            color,
            tex.a * vAlpha
        );

}
`;

function ParticleLayer({ layer, texture }) {

    const materialRef = useRef();
    const geometry = useMemo(
        () => createGeometry(layer),
        [layer]
    );
    useFrame(({ clock }) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime.value =
            clock.elapsedTime;
    });

    return (
        <points geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                transparent
                depthWrite={false}
                depthTest={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTexture: { value: texture },
                    uTime: { value: 0 }
                }}
                vertexShader={PARTICLE_VERTEX}
                fragmentShader={PARTICLE_FRAGMENT}
            />
        </points>
    );
}

export default function FloatingParticles() {

    const textures = useLoader(
        THREE.TextureLoader,
        LAYERS.map(
            layer => layer.texture
        )
    );
    textures.forEach(texture => {
        texture.colorSpace =
            THREE.SRGBColorSpace;
        texture.needsUpdate = true;
    });
    return (
        <>
            {
                LAYERS.map((layer,index)=>(
                    <ParticleLayer
                        key={index}
                        layer={layer}
                        texture={textures[index]}
                    />
                ))
            }
        </>
    );
}