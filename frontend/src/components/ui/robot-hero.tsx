import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "@tanstack/react-router";
import { Play, PlusCircle } from "lucide-react";

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  override getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    t = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();

function ResponsiveGroup({
  children,
  scale = 1,
}: {
  children: React.ReactNode;
  scale?: number;
}) {
  const { viewport } = useThree();
  const w = viewport.width > 0 ? viewport.width : 3.5;
  const s = Math.min(1.1, Math.max(0.55, w / 3.5)) * scale;
  return <group scale={s}>{children}</group>;
}

function GlassCapsule({
  color,
  power,
  intensity,
}: {
  color: string;
  power: number;
  intensity: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color("#ffffff") },
      power: { value: 2.5 },
      intensity: { value: 0.6 },
    }),
    [],
  );

  useFrame(() => {
    if (materialRef.current?.uniforms) {
      const u = materialRef.current.uniforms;
      if (u["color"]?.value) {
        u["color"].value.set(color);
      }
      if (u["power"]) {
        u["power"].value = power;
      }
      if (u["intensity"]) {
        u["intensity"].value = intensity;
      }
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(max(fresnel, 0.0001), power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({
  color: "#f5f5f5",
  roughness: 0.4,
});
const earRingMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.2,
});
const earCenterMat = new THREE.MeshStandardMaterial({
  color: "#e0e0e0",
  roughness: 0.7,
});
const antennaBaseMat = new THREE.MeshStandardMaterial({
  color: "#cccccc",
  roughness: 0.3,
  metalness: 0.4,
});
const antennaStickMat = new THREE.MeshStandardMaterial({
  color: "#e8e8e8",
  roughness: 0.3,
  metalness: 0.2,
});
const antennaTipMat = new THREE.MeshStandardMaterial({
  color: "#ff3366",
  roughness: 0.2,
  toneMapped: false,
});

function RobotEar({
  position,
  scale = 1,
  isLeft = false,
}: {
  position: [number, number, number];
  scale?: number;
  isLeft?: boolean;
}) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earBaseMat}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earRingMat}
      >
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earCenterMat}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>

      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh
          position={[0, 0.01, 0]}
          castShadow
          receiveShadow
          material={antennaBaseMat}
        >
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh
          position={[0, 0.06, 0]}
          castShadow
          receiveShadow
          material={antennaStickMat}
        >
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh
          position={[0, 0.11, 0]}
          castShadow
          receiveShadow
          material={antennaTipMat}
        >
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0, 3, 2.5),
  toneMapped: false,
  transparent: true,
});
const heartMat = new THREE.MeshBasicMaterial({
  color: "#ff3366",
  toneMapped: false,
});

function RobotEye({
  position,
  rotation,
  scale = 1,
  blinkDuration = 0.15,
  blinkCycle = 3.0,
  isLovedRef,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  blinkDuration?: number;
  blinkCycle?: number;
  isLovedRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current)
      return;

    const isHeart = isLovedRef.current;

    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    const cycle = clock.getElapsedTime() % blinkCycle;

    let targetScaleY = 1;

    if (cycle < blinkDuration && !isHeart) {
      const progress = cycle / blinkDuration;
      const blinkClose = Math.sin(progress * Math.PI);

      targetScaleY = Math.max(0.05, 1.0 - blinkClose);
    }

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;

    const tPath = new THREE.CurvePath<THREE.Vector3>();
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, g, 0),
        new THREE.Vector3(-w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, h - r, 0),
        new THREE.Vector3(-w, h, 0),
        new THREE.Vector3(-w + r, h, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, h, 0),
        new THREE.Vector3(w - r, h, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, h, 0),
        new THREE.Vector3(w, h, 0),
        new THREE.Vector3(w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, h - r, 0),
        new THREE.Vector3(w, g, 0),
      ),
    );

    const bPath = new THREE.CurvePath<THREE.Vector3>();
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, -g, 0),
        new THREE.Vector3(-w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, -(h - r), 0),
        new THREE.Vector3(-w, -h, 0),
        new THREE.Vector3(-w + r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, -h, 0),
        new THREE.Vector3(w - r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, -h, 0),
        new THREE.Vector3(w, -h, 0),
        new THREE.Vector3(w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, -(h - r), 0),
        new THREE.Vector3(w, -g, 0),
      ),
    );

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>

      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

function generatePbrTextures(): {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 256;
  const canvasC = document.createElement("canvas");
  const canvasB = document.createElement("canvas");
  canvasC.width = canvasB.width = size;
  canvasC.height = canvasB.height = size;
  const ctxC = canvasC.getContext("2d");
  const ctxB = canvasB.getContext("2d");

  if (ctxC && ctxB) {
    ctxC.fillStyle = "#e5e5e5";
    ctxC.fillRect(0, 0, size, size);
    ctxB.fillStyle = "#888888";
    ctxB.fillRect(0, 0, size, size);

    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 0.5 + Math.random() * 1.5;
      const isDark = Math.random() > 0.3;

      ctxC.beginPath();
      ctxC.arc(x, y, r, 0, Math.PI * 2);
      ctxC.fillStyle = isDark ? "#888888" : "#ffffff";
      ctxC.fill();

      ctxB.beginPath();
      ctxB.arc(x, y, r, 0, Math.PI * 2);
      ctxB.fillStyle = isDark ? "#333333" : "#ffffff";
      ctxB.fill();
    }
  }

  const texC = new THREE.CanvasTexture(canvasC);
  const texB = new THREE.CanvasTexture(canvasB);
  texC.wrapS = texB.wrapS = THREE.RepeatWrapping;
  texC.wrapT = texB.wrapT = THREE.RepeatWrapping;

  texC.repeat.set(6, 3);
  texB.repeat.set(6, 3);
  texC.needsUpdate = true;
  texB.needsUpdate = true;

  return { colorMap: texC, bumpMap: texB };
}

export interface NeckParams {
  baseR: number;
  baseH: number;
  midR: number;
  midH: number;
  lipBottomR: number;
  lipBottomH: number;
  lipTopR: number;
  lipTopH: number;
  innerR: number;
  innerDropH: number;
}

export interface BodyParams {
  bodyBevelR: number;
  bodyBevelY: number;
  bodyBevelT: number;
}

function RobotPrototype({
  neckParams = {
    baseR: 0.25,
    baseH: -0.01,
    midR: 0.23,
    midH: 0.02,
    lipBottomR: 0.27,
    lipBottomH: 0.025,
    lipTopR: 0.28,
    lipTopH: 0.05,
    innerR: 0.24,
    innerDropH: 0.03,
  },
  bodyParams = { bodyBevelR: 0.21, bodyBevelY: 0.38, bodyBevelT: 0.015 },
  color = "#ececec",
  pantallaColor = "#00ffc6",
  pantallaBrillo = 1.2,
  blinkCycle = 3.0,
  metalness = 0.0,
}: {
  neckParams?: NeckParams;
  bodyParams?: BodyParams;
  color?: string;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
}) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Procedural marble textures generated synchronously once in browser
  const textures = useMemo(() => {
    if (typeof document === "undefined") return null;
    try {
      return generatePbrTextures();
    } catch {
      return null;
    }
  }, []);

  const design = {
    pantallaColor: pantallaColor,
    pantallaGrosor: 3.8,
    pantallaBrillo: pantallaBrillo,
    separacionOjos: 0.07,
    tamañoOrejas: 1.3,
    escalaOjos: 1.1,
    parpadeoFrecuencia: blinkCycle,
    parpadeoDuracion: 0.45,
    colorChasis: color,
    alturaCabeza: 0.6,
  };

  const config = {
    moveSpeed: 0.35,
    bodyRotSpeed: 10.0,
    headRotSpeed: 20.0,
    bodyTiltX: 0.0,
    bodyTiltY: 0.95,
    headLookX: 0.3,
    headLookY: 1.8,
  };

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(Math.max(delta || 0, 0), 0.1);

    const tx =
      typeof state.pointer?.x === "number" && !isNaN(state.pointer.x)
        ? state.pointer.x
        : 0;
    const ty =
      typeof state.pointer?.y === "number" && !isNaN(state.pointer.y)
        ? state.pointer.y
        : 0;

    const vWidth = state.viewport.width > 0 ? state.viewport.width : 3.5;
    const maxMoveX = vWidth / 3.5;
    const targetPosX = tx * maxMoveX;

    bodyRef.current.position.x = THREE.MathUtils.lerp(
      bodyRef.current.position.x,
      targetPosX,
      config.moveSpeed * dt,
    );

    const relativeX = tx - bodyRef.current.position.x / 2.5;

    const bodyTargetRotY = -relativeX * config.bodyTiltY;
    const bodyTargetRotX = relativeX * relativeX * config.bodyTiltX - ty * 0.25;
    const bodyTargetRotZ = -relativeX * 0.15;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(
      bodyRef.current.rotation.y,
      bodyTargetRotY,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(
      bodyRef.current.rotation.x,
      bodyTargetRotX,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(
      bodyRef.current.rotation.z,
      bodyTargetRotZ,
      config.bodyRotSpeed * dt,
    );

    const headTargetRotY = relativeX * config.headLookY;
    const headTargetRotX = -ty * config.headLookX;

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      headTargetRotY,
      config.headRotSpeed * dt,
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      headTargetRotX,
      config.headRotSpeed * dt,
    );
  });

  const handlePointerDown = (
    e: import("@react-three/fiber").ThreeEvent<PointerEvent>,
  ) => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(() => {
    const points = [];

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.baseR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.midR, neckParams.midH));
    points.push(
      new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH),
    );
    points.push(new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH));
    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH));
    points.push(
      new THREE.Vector2(
        neckParams.innerR,
        neckParams.lipTopH - neckParams.innerDropH,
      ),
    );
    return points;
  }, [neckParams]);

  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#111111",
      roughness: 0.7,
      metalness: 0.1,
    });
  }, []);

  return (
    <group
      ref={bodyRef}
      position={[0, -0.3, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry
          args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]}
        />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures?.colorMap ?? null}
          bumpMap={textures?.bumpMap ?? null}
          bumpScale={0.005}
          roughness={0.9}
          metalness={metalness}
          envMapIntensity={0.2}
        />
      </mesh>

      {bodyParams.bodyBevelT > 0 && (
        <mesh
          position={[0, bodyParams.bodyBevelY, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry
            args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]}
          />
          <meshStandardMaterial
            color={design.colorChasis}
            map={textures?.colorMap ?? null}
            bumpMap={textures?.bumpMap ?? null}
            bumpScale={0.005}
            roughness={0.9}
            metalness={metalness}
            envMapIntensity={0.2}
          />
        </mesh>
      )}

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
        <latheGeometry args={[neckProfile, 64]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures?.colorMap ?? null}
          bumpMap={textures?.bumpMap ?? null}
          bumpScale={0.005}
          roughness={0.9}
          metalness={metalness}
          envMapIntensity={0.2}
        />
      </mesh>

      <group ref={headRef} position={[0, design.alturaCabeza, 0]}>
        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        </mesh>

        <GlassCapsule
          color={design.pantallaColor}
          power={design.pantallaGrosor}
          intensity={design.pantallaBrillo}
        />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye
            position={[-design.separacionOjos, 0, 0]}
            rotation={[0, -0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
          <RobotEye
            position={[design.separacionOjos, 0, 0]}
            rotation={[0, 0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
        </group>

        <RobotEar
          position={[-0.29, 0, 0]}
          isLeft={true}
          scale={design.tamañoOrejas}
        />
        <RobotEar
          position={[0.29, 0, 0]}
          isLeft={false}
          scale={design.tamañoOrejas}
        />
      </group>
    </group>
  );
}

export interface RobotHeroProps {
  backgroundText?: string;
  subtitle?: string;
  color?: string;
  scale?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
  startAuctionHref?: string;
  newAuctionTo?: string;
}

export function RobotHero({
  backgroundText = "AUCTION",
  subtitle = "Live cricket auction platform for real-time player bidding",
  color = "#c7cdd3",
  scale = 1,
  pantallaColor = "#a1b5d8",
  pantallaBrillo = 1.6,
  blinkCycle = 3.0,
  metalness = 0.3,
  startAuctionHref = "#today",
  newAuctionTo = "/my-auctions/new",
}: RobotHeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    setIsClient(true);

    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[620px] md:h-[720px] min-h-[550px] overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 25%, #2e343a 0%, #1c2227 45%, #171a1d 75%, #0f1214 100%)",
      }}
    >
      {/* Powder Blue & Frosted Mint Ambient Sky Halo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(161,181,216,0.25)_0%,rgba(228,240,208,0.12)_32%,transparent_70%)] pointer-events-none" />

      {/* Slate Grey & Ocean Blue Atmospheric Depth Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(67,101,160,0.22)_0%,rgba(23,26,29,0.4)_45%,transparent_72%)] pointer-events-none" />

      {/* Tea Green Subtle Floor Bounce */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(194,216,185,0.15)_0%,transparent_55%)] pointer-events-none" />

      {/* Ambient Dark Vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,18,20,0.35)_0%,transparent_20%,transparent_80%,rgba(15,18,20,0.6)_100%)] pointer-events-none" />

      {/* Top Tagline, Subtitle & Action Buttons in Middle Area */}
      <div className="absolute top-8 md:top-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162235]/85 border border-[#a1b5d8]/40 backdrop-blur-md shadow-[0_0_20px_rgba(161,181,216,0.25)] mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#a1b5d8] animate-pulse" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#e4f0d0]">
            Live Cricket Arena
          </span>
        </div>
        <p className="text-sm md:text-base font-semibold text-[#fffcf7] max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-4">
          {subtitle}
        </p>

        {/* Start Auction & New Auction Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
          {/* Start Auction Button */}
          <a
            href={startAuctionHref}
            className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.45)] hover:shadow-[0_0_35px_rgba(161,181,216,0.7)] hover:scale-105 transition-all duration-300 border border-[#fffcf7]/40"
          >
            <span className="flex items-center justify-center size-6 rounded-full bg-[#162235]/20 text-[#162235]">
              <Play className="size-3.5 fill-current ml-0.5" />
            </span>
            <span>Start Auction</span>
          </a>

          {/* New Auction Button */}
          <Link
            to={newAuctionTo}
            className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-sm text-[#fffcf7] bg-[#162235]/90 hover:bg-[#2d436a] border-2 border-[#a1b5d8]/50 hover:border-[#fffcf7] shadow-[0_0_20px_rgba(22,34,53,0.5)] hover:shadow-[0_0_25px_rgba(161,181,216,0.3)] hover:scale-105 transition-all duration-300 backdrop-blur-md"
          >
            <span className="flex items-center justify-center size-6 rounded-full bg-[#a1b5d8]/25 text-[#a1b5d8] group-hover:bg-[#fffcf7]/25 group-hover:text-[#fffcf7] transition-colors">
              <PlusCircle className="size-4" />
            </span>
            <span>New Auction</span>
          </Link>
        </div>
      </div>

      {/* Background ( AUCTION ) Ambient Luminous Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <h1
          className="font-sans font-black select-none whitespace-nowrap tracking-tighter uppercase"
          style={{
            color: "#fffcf7",
            opacity: 0.06,
            letterSpacing: "-0.04em",
            fontSize: "clamp(5rem, 19vw, 18rem)",
            lineHeight: 1,
            transform: "translate(0px, 40px)",
            textShadow: "0 0 80px rgba(161, 181, 216, 0.4)",
          }}
        >
          {backgroundText}
        </h1>
      </div>

      {/* 3D Canvas with High-Performance Ambient Studio Setup */}
      <div className="absolute inset-0 z-10">
        {isClient && (
          <Canvas
            shadows
            frameloop={isInView ? "always" : "never"}
            dpr={[1, 1.5]}
            gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
            camera={{ position: [0, 0.2, 6], fov: 40 }}
          >
            {/* Powder Blue / Porcelain Warm Ambient Light */}
            <ambientLight intensity={0.9} color="#dae2ef" />

            {/* Key White Studio Light */}
            <directionalLight
              position={[3, 8, 5]}
              intensity={1.6}
              color="#ffffff"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0005}
            >
              <orthographicCamera
                attach="shadow-camera"
                args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]}
              />
            </directionalLight>

            {/* Powder Blue Fill Light */}
            <directionalLight
              position={[-4, 3, -2]}
              intensity={1.0}
              color="#a1b5d8"
            />

            {/* Tea Green Back Rim Light */}
            <directionalLight
              position={[0, 4, -5]}
              intensity={0.7}
              color="#c2d8b9"
            />

            <Suspense fallback={null}>
              <ResponsiveGroup scale={scale}>
                <ContactShadows
                  position={[0, -0.79, 0]}
                  opacity={0.75}
                  scale={12}
                  resolution={512}
                  frames={1}
                  blur={2.2}
                  far={2.5}
                  color="#0a0d0f"
                />
                <RobotPrototype
                  neckParams={{
                    baseR: 0.215,
                    baseH: -0.05,
                    midR: 0.28,
                    midH: 0.02,
                    lipBottomR: 0.295,
                    lipBottomH: 0.045,
                    lipTopR: 0.27,
                    lipTopH: 0.055,
                    innerR: 0.1,
                    innerDropH: 0.0,
                  }}
                  bodyParams={{
                    bodyBevelR: 0.235,
                    bodyBevelY: 0.34,
                    bodyBevelT: 0.025,
                  }}
                  color={color}
                  pantallaColor={pantallaColor}
                  pantallaBrillo={pantallaBrillo}
                  blinkCycle={blinkCycle}
                  metalness={metalness}
                />
              </ResponsiveGroup>
            </Suspense>
          </Canvas>
        )}
      </div>
    </section>
  );
}

export default RobotHero;
