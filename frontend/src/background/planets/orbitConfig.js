import * as THREE from "three";

export const CENTER = new THREE.Vector3(
    34,
    -24,
    -34
);

function createOrbit(radiusX, radiusY) {
    return new THREE.EllipseCurve(
        0,
        0,
        radiusX,
        radiusY,
        0,
        Math.PI * 2,
        false,
        0
    );
}

export const ORBITS = {

    neptune: {
        name: "Neptune",
        radiusX: 78,
        radiusY: 46,
        curve: createOrbit(78,46),
        rotation: [
            0.48,
            0.20,
            0.08
        ],
        color: "#6FB7FF",
        opacity: 0.12,
        speed: 0.06,
        start: 0.95,
        scale: [7,7,7],
        initialAngle : 235,
        selfRotation: 0.10
    },
    saturn: {
        name: "Saturn",
        radiusX: 32,
        radiusY: 19,
        curve: createOrbit(32,19),
        rotation: [
            0.48,
            0.20,
            0.08
        ],
        color: "#F0C97A",
        opacity: 0.15,
        speed: 0.150,
        start: 0.23,
        scale: [11,11,11],
        initialAngle : 35,
        selfRotation: 0.07
    }
};