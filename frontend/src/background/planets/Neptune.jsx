import * as THREE from "three";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CENTER, ORBITS } from "./orbitConfig";

import neptuneTexture from "../textures/dark/planets/neptune1.png";

const SPIN = {
  tiltX: THREE.MathUtils.degToRad(28.32),
  tiltY: THREE.MathUtils.degToRad(6),
  speed: (Math.PI * 2) / 300,
};

export default function Neptune() {
  const orbitGroup = useRef();
  const spinGroup = useRef();

  const planet = useRef();

const { camera, gl } = useThree();

  const texture = useLoader(
    THREE.TextureLoader,
    neptuneTexture
  );

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
  }, [texture, gl]);

  const orbitTilt = useMemo(
    () => new THREE.Euler(...ORBITS.neptune.rotation),
    []
  );
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const orbit = ORBITS.neptune;
    const angle = THREE.MathUtils.degToRad(orbit.initialAngle) +
    clock.elapsedTime * orbit.speed;

    const x = Math.cos(angle) * orbit.radiusX;
    const y = Math.sin(angle) * orbit.radiusY;

    offset.set(x, y, 0);
    offset.applyEuler(orbitTilt);

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
            ORBITS.neptune.scale[0],
            ORBITS.neptune.scale[1]
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