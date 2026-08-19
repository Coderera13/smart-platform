import * as THREE from "three";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CENTER, ORBITS } from "./orbitConfig";

import saturnTexture from "../textures/dark/planets/saturn1.png";

const SPIN = {
  tiltX: THREE.MathUtils.degToRad(26.73),
  tiltY: THREE.MathUtils.degToRad(-8),
  speed: (Math.PI * 2) / 360,
};

export default function Saturn() {

  const orbitGroup = useRef();
  const spinGroup = useRef();

  const planet = useRef();

const { camera, gl } = useThree();

  const texture = useLoader(
    THREE.TextureLoader,
    saturnTexture
  );

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
  }, [texture, gl]);

  const orbitTilt = useMemo(
    () => new THREE.Euler(...ORBITS.saturn.rotation),
    []
  );
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const orbit = ORBITS.saturn;
    const curve = orbit.curve;
    const ORBIT_SPEED = 0.02;

    const t = (orbit.start + clock.elapsedTime * orbit.speed * ORBIT_SPEED) % 1;

    const point = curve.getPoint(t);

    offset.set(point.x, point.y, 0).applyEuler(orbitTilt);

    if (orbitGroup.current) {
      orbitGroup.current.position.set(
          CENTER.x + offset.x,
          CENTER.y + offset.y,
          CENTER.z + offset.z
      );
    }

    if (spinGroup.current) {
      spinGroup.current.rotation.z =
          clock.elapsedTime * SPIN.speed;
    }

    if (planet.current) {
      planet.current.lookAt(camera.position);
    }

  });

  return (
  <group ref={orbitGroup}>
    <group ref={spinGroup} rotation={[SPIN.tiltX, SPIN.tiltY, 0]}>
      <mesh
        ref={planet}
        renderOrder={5}
      >
        <planeGeometry
          args={[
            ORBITS.saturn.scale[0],
            ORBITS.saturn.scale[1]
          ]}
        />

        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  </group>
);
}