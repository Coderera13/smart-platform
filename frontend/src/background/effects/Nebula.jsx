import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";

import cloud1 from "../textures/dark/clouds/top_right_b.png";
import cloud2 from "../textures/dark/clouds/top_right_f.png";
import cloud3 from "../textures/dark/clouds/bottom_back_b.png";
import cloud4 from "../textures/dark/clouds/bottom_back_f.png";
import cloud5 from "../textures/dark/clouds/bottom_right.png";

const CLOUDS = [
  {
    texture: cloud1,
    position: [33, 19, -42],
    scale: [48, 18],
    rotation: -3.3,
    shadow: "#080C1A",
    mid: "#1C3D5E",
    light: "#4FA8C4",
    glow: "#A8E8E4",
    opacity: 0.24,
    intensity: 0.3,
    depthOrder: 0,
  },
  {
    texture: cloud2,
    position: [27, 15, -30],
    scale: [25, 7],
    rotation: -3.25,
    shadow: "#1A0B1C",
    mid: "#6B3858",
    light: "#C97D9E",
    glow: "#FAD7E8",
    opacity: 0.24,
    intensity: 0.34,
    depthOrder: 2,
  },
  {
    texture: cloud3,
    position: [-31, -18, -38],
    scale: [42, 17],
    rotation: -0.18,
    shadow: "#050F1E",
    mid: "#1F4D6B",
    light: "#4FA3C9",
    glow: "#B8F0FF",
    opacity: 0.22,
    intensity: 0.3,
    depthOrder: 1,
  },
  {
    texture: cloud4,
    position: [-19, -10.5, -18],
    scale: [15, 6],
    rotation: -0.33,
    shadow: "#180C28",
    mid: "#5C3A7A",
    light: "#A878C9",
    glow: "#E8C9FF",
    opacity: 0.18,
    intensity: 0.28,
    depthOrder: 3,
  },
  {
    texture: cloud5,
    position: [32, -15, -40],
    scale: [19, 17],
    rotation: 1.8,
    shadow: "#1F1408",
    mid: "#6B4423",
    light: "#C98A4F",
    glow: "#FFD9A8",
    opacity: 0.2,
    intensity: 0.3,
    depthOrder: -5,
  },
];

const OVERLAY_VERTEX = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const OVERLAY_FRAGMENT = `
    varying vec2 vUv;

    uniform sampler2D cloudTexture;

    uniform float uTime;
    uniform float uSeed;

    uniform vec3 shadowColor;
    uniform vec3 midColor;
    uniform vec3 lightColor;
    uniform vec3 glowColor;

    uniform float uIntensity;

    float hash(vec2 p)
    {
        p = fract(p * vec2(123.34,456.21));
        p += dot(p,p+45.32);
        return fract(p.x*p.y);
    }

    float noise(vec2 p)
    {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f = f*f*(3.0-2.0*f);

        float a = hash(i);
        float b = hash(i+vec2(1.,0.));
        float c = hash(i+vec2(0.,1.));
        float d = hash(i+vec2(1.,1.));

        return mix(
            mix(a,b,f.x),
            mix(c,d,f.x),
            f.y
        );
    }

    float fbm(vec2 p)
    {
        float value = 0.0;
        float amp = 0.5;

        for(int i=0;i<6;i++)
        {
            value += amp * noise(p);
            p *= 2.03;
            amp *= 0.52;
        }

        return value;
    }

    void main()
    {
        float alpha = texture2D(cloudTexture, vUv).a;
        vec2 centeredUV = vUv - 0.5;

        float radialFade =
            1.0 -
            smoothstep(
                0.30,
                0.82,
                length(centeredUV)
            );

        alpha *= radialFade;
        if(alpha < 0.01)
            discard;

        vec2 uv = vUv;

        vec2 distortion = vec2(

            fbm(
                uv * 7.5 +
                vec2(
                    uTime * 0.02,
                    -uTime * 0.015
                )
            ),

            fbm(
                uv * 7.5 +
                vec2(
                    -uTime * 0.012,
                    uTime * 0.018
                ) +
                15.0
            )

        );

        uv += (distortion - 0.5) * 0.03;

        float large =
            fbm(
                uv*4.5+
                vec2(
                    uTime*0.015,
                    -uTime*0.008
                )+
                uSeed
            );

        float medium =
            fbm(
                uv*9.0-
                vec2(
                    uTime*0.012,
                    uTime*0.016
                )-
                uSeed
            );

        float small =
            fbm(
                uv*18.0+
                medium*2.0
            );

        float turbulence =
            large*0.55+
            medium*0.30+
            small*0.15;

        float density =
            alpha *
            (
                0.20 +
                large * 0.42 +
                medium * 0.26 +
                small * 0.12
            );

        density = pow(density, 1.35);
        density = clamp(density, 0.0, 1.0);

        vec3 color =
            mix(
                shadowColor,
                midColor,
                smoothstep(
                    0.10,
                    0.35,
                    density
                )
            );

        color =
            mix(
                color,
                lightColor,
                smoothstep(
                    0.35,
                    0.70,
                    density
                )
            );

        color =
            mix(
                color,
                glowColor,
                smoothstep(
                    0.72,
                    1.0,
                    density
                )
            );

        float filament =
            smoothstep(
                0.58,
                0.90,
                medium
            );

        color +=
            lightColor*
            filament*
            0.35;

        vec3 lightDir =
            normalize(
                vec3(
                    -0.8,
                    0.7,
                    1.0
                )
            );

        vec3 normal =
            normalize(
                vec3(
                    dFdx(density),
                    dFdy(density),
                    0.25
                )
            );

        float diffuse =
            max(
                dot(
                    normal,
                    lightDir
                ),
                0.0
            );

        color *=
            0.60 +
            diffuse * 0.95;

        color +=
            lightColor *
            0.10 *
            density;

        float rim =
            smoothstep(
                0.15,
                0.80,
                1.0-alpha
            );

        rim *= rim;

        color +=
            glowColor *
            rim *
            1.15;

        color +=
            lightColor *
            rim *
            0.45;

        float core =
            smoothstep(
                0.72,
                1.0,
                density
            );

        color += glowColor * core * 0.45;
        color += glowColor * filament * 0.20;
        color *= mix(0.9,1.15,core);
        color += lightColor * turbulence * 0.40;
        color += glowColor * density * 0.30;

        gl_FragColor = vec4(color,alpha*uIntensity);
    }
`;

function CloudLayer({ cfg, texture, renderOrder }) {
  const overlayRef = useRef();

  const uniforms = useMemo(
    () => ({
      cloudTexture:{value:texture},
      uTime: { value: 0 },
      uSeed: { value: Math.random() * 100 },
      shadowColor:{
        value:new THREE.Color(cfg.shadow)
      },
      midColor:{
        value:new THREE.Color(cfg.mid)
      },
      lightColor:{
        value:new THREE.Color(cfg.light)
      },
      glowColor:{
        value:new THREE.Color(cfg.glow)
      },
      uIntensity: { value: cfg.intensity },
    }),
    [texture]
  );

  useFrame((state) => {
    if (overlayRef.current) {
      overlayRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={cfg.position} rotation={[0, 0, cfg.rotation]}>
      {/* Base: shape + color - same technique as before, values corrected */}
      <mesh renderOrder={renderOrder}>
        <planeGeometry args={cfg.scale} />
        <meshStandardMaterial
          map={texture}
          color={cfg.shadow}
          transparent
          opacity={cfg.opacity}
          roughness={1}
          metalness={0}
          emissive={cfg.mid}
          emissiveIntensity={0.08}
          depthWrite={false}
          depthTest={true}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Volumetric pass: procedural light/shadow + rim glow, additive */}
      <mesh renderOrder={renderOrder + 10}>
        <planeGeometry args={cfg.scale} />
        <shaderMaterial
          ref={overlayRef}
          transparent
          depthWrite={false}
          depthTest={true}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={OVERLAY_VERTEX}
          fragmentShader={OVERLAY_FRAGMENT}
        />
      </mesh>
    </group>
  );
}

export default function Nebula() {
  const textures = useLoader(
    THREE.TextureLoader,
    CLOUDS.map((c) => c.texture)
  );

  textures.forEach((texture) => {
    texture.flipY = true;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.premultiplyAlpha = false;
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
  });

  return (
    <>
      {CLOUDS.map((cfg, i) => (
        <CloudLayer key={i} cfg={cfg} texture={textures[i]} renderOrder={cfg.depthOrder} />
      ))}
    </>
  );
}