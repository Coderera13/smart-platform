import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const STAR_FIELD = {
  count: 1800,
  heroCount: 35,
  spreadX: 45,
  spreadY: 28,
  zNear: -8,
  zFar: -70,
};

const STAR_COLORS = [

    "#FFFFFF",
    "#F8FCFF",
    "#E6F7FF",
    "#D5EDFF",
    "#CFE3FF",
    "#E7D9FF",
    "#FFF4DA"

];

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

const VERTEX_SHADER = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aFlare;
  attribute float aTwinkle;
  attribute vec3 aTint;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vTwinkle;
  varying float vFlare;
  varying vec3 vTint;

  void main() {
    vFlare = aFlare;
    vTint = aTint;

    float twinkle;

    if(aTwinkle < 0.5){
        // Static stars
        twinkle = 0.92;
    }
    else if(aTwinkle < 1.5){
        // Slow breathing
        twinkle = 0.60 + 0.40 * sin(uTime * aSpeed + aPhase);
    }
    else if(aTwinkle < 2.5){
        // Stronger pulse
        twinkle = 0.40 + 0.60 * sin(uTime * aSpeed * 1.3 + aPhase);
    }
    else{
        // Hero stars
        twinkle = 0.15 + 0.85 * sin(uTime * aSpeed * 2.0 + aPhase);
    }

    vTwinkle = twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float attenuation = 340.0 / -mvPosition.z;
    gl_PointSize = aSize * attenuation * uPixelRatio * mix(0.75, 1.15, twinkle);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  varying float vTwinkle;
  varying float vFlare;
  varying vec3 vTint;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float dist = length(c) * 2.0;
    float core = smoothstep(1.0, 0.0, dist);
    core = pow(core, 2.2);

    float alpha = core;
    float halo = smoothstep(1.2, 0.2, dist);
    alpha = max(alpha, halo * 0.10);

    if (vFlare > 0.5) {
      float spikeH = smoothstep(0.05, 0.0, abs(c.y) * 2.0) * smoothstep(0.5, 0.0, abs(c.x));
      float spikeV = smoothstep(0.05, 0.0, abs(c.x) * 2.0) * smoothstep(0.5, 0.0, abs(c.y));
      alpha = max(alpha, max(spikeH, spikeV) * 0.85);
    }

    if (alpha < 0.02) discard;
    float glow = mix(1.0, 2.2, smoothstep(0.60, 1.0, vTwinkle));

    gl_FragColor = vec4(vTint, alpha * vTwinkle * glow);
  }
`;

function buildGeometry() {
  const { count, heroCount, spreadX, spreadY, zNear, zFar } = STAR_FIELD;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const flares = new Float32Array(count);
  const twinkles = new Float32Array(count);
  const tints = new Float32Array(count * 3);

  const tintColors = STAR_COLORS.map((c) => new THREE.Color(c));

  for (let i = 0; i < count; i++) {
    const isHero = i < heroCount;
    const cluster = Math.random() < 0.25;

    if (cluster) {
      positions[i * 3 + 0] = randRange(-18, 18);
      positions[i * 3 + 1] = randRange(-10, 10);
    } else {
      positions[i * 3 + 0] = randRange(-spreadX, spreadX);
      positions[i * 3 + 1] = randRange(-spreadY, spreadY);
    }
    positions[i * 3 + 2] = randRange(zFar, zNear);

    const r = Math.random();

    if (isHero) {

      sizes[i] = randRange(2.6,4.0);
      flares[i] = 1;

    } else if (r < 0.08) {

      sizes[i] = randRange(1.5,2.4);
      flares[i] = Math.random() > 0.5 ? 1 : 0;

    } else {

      sizes[i] = randRange(0.35,0.85);
      flares[i] = 0;

    }

    const twinkleChance = Math.random();

    if (twinkleChance < 0.45) {
        // 70% stay almost constant
        twinkles[i] = 0.0;

    } else if (twinkleChance < 0.80) {
        // 20% slow twinkle
        twinkles[i] = 1.0;

    } else if (twinkleChance < 0.95) {
        // 8% brighter twinkle
        twinkles[i] = 2.0;

    } else {
        // 2% hero stars
        twinkles[i] = 3.0;

    }

    phases[i] = randRange(0, Math.PI * 2);
    speeds[i] = randRange(0.15, 1.1);

    const tint = tintColors[Math.floor(Math.random() * tintColors.length)];
    tints[i * 3 + 0] = tint.r;
    tints[i * 3 + 1] = tint.g;
    tints[i * 3 + 2] = tint.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aFlare", new THREE.BufferAttribute(flares, 1));
  geometry.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));
  geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 3));
  return geometry;
}

export default function Stars() {
  const materialRef = useRef();
  const geometry = useMemo(() => buildGeometry(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} renderOrder={0}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}