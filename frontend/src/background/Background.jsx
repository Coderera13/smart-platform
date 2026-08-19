import "./Background.css";
import Scene from "./Scene";

import Nebula from "./effects/Nebula";
import MicroParticles from "./effects/MicroParticles";
import Stars from "./effects/Stars";
import Aurora from "./effects/Aurora";
import GalaxyCore from "./galaxy/GalaxyCore";
import Galaxy from "./galaxy/Galaxy";
import PlanetOrbits from "./planets/PlanetOrbits";
import Neptune from "./planets/Neptune";
import Saturn from "./planets/Saturn";

import lightVideo from "./textures/light/background.mp4";

export default function Background({ theme }) {
    return (
        <div className="background">

            {/* ---------- Dark Theme ---------- */}

            <div
                className={`galaxy-layer ${
                    theme === "dark" ? "active" : "inactive"
                }`}
            >
                <Scene active={theme === "dark"}>

                    <color
                        attach="background"
                        args={["#01020B"]}
                    />

                    <GalaxyCore />
                    <Aurora />
                    <Nebula />
                    <Stars />
                    <Galaxy />
                    <Neptune />
                    <Saturn />
                    <PlanetOrbits />
                    <MicroParticles />

                </Scene>
            </div>

            {/* ---------- Light Theme ---------- */}

            <video
                className={`background-video ${
                    theme === "light" ? "active" : "inactive"
                }`}
                src={lightVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            />

        </div>
    );
}