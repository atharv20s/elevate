import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   Inner scene component – runs inside the R3F <Canvas>
   ──────────────────────────────────────────────────────────── */

interface StatueModelProps {
  dragDeltaX: number;
  isDragging: boolean;
  onLoaded: () => void;
}

function StatueModel({ dragDeltaX, isDragging, onLoaded }: StatueModelProps) {
  const { scene } = useGLTF("/scene-v1.glb");
  const groupRef = useRef<THREE.Group>(null);
  const currentRotY = useRef(0);
  const targetRotY = useRef(0);
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.roughness = 0.22;
          mesh.material.metalness = 0.92;
          mesh.material.envMapIntensity = 1.2;
        }
      }
    });

    // Centre the model at origin
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    scene.position.x -= center.x;
    scene.position.y -= center.y;
    scene.position.z -= center.z;

    // Scale model to fill viewport — target ~3 units tall
    const maxDim = Math.max(size.x, size.y, size.z);
    const desiredHeight = 2.6;
    const scaleFactor = desiredHeight / maxDim;
    scene.scale.setScalar(scaleFactor);

    if (!hasNotified.current) {
      hasNotified.current = true;
      onLoaded();
    }
  }, [scene, onLoaded]);

  const AUTOPLAY_SPEED = 0.002;
  const LERP_FACTOR = 0.08;

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isDragging) {
      groupRef.current.rotation.y += AUTOPLAY_SPEED;
      currentRotY.current = groupRef.current.rotation.y;
      targetRotY.current = groupRef.current.rotation.y;
    } else {
      targetRotY.current = currentRotY.current + dragDeltaX * 0.008;
      const newRot =
        groupRef.current.rotation.y +
        (targetRotY.current - groupRef.current.rotation.y) * LERP_FACTOR;
      groupRef.current.rotation.y = newRot;
    }

    groupRef.current.rotation.x = 0;
    groupRef.current.rotation.z = 0;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Lighting ── */
function ShadowGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <shadowMaterial opacity={0.45} />
    </mesh>
  );
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.5} color={0xffffff} />
      {/* Key light – warm golden from upper-right, casts shadows */}
      <directionalLight
        intensity={2.2}
        color={0xfff3d1}
        position={[4, 8, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.001}
      />
      {/* Fill light – cool from left */}
      <directionalLight intensity={0.5} color={0x8fa3ff} position={[-5, 2, -2]} />
      {/* Rim light – subtle backlight */}
      <directionalLight intensity={0.8} color={0xebd197} position={[-2, 4, -5]} />
      {/* Under fill */}
      <pointLight intensity={0.3} color={0xfff8e7} position={[0, -3, 3]} />
    </>
  );
}

/* ── Camera ── */
function CameraSetup({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  const targetZ = useRef(5.5);

  useEffect(() => {
    camera.position.set(0, 0.2, 5.5);
    camera.lookAt(0, 0.1, 0);
  }, [camera]);

  useEffect(() => {
    targetZ.current = zoom;
  }, [zoom]);

  useFrame(() => {
    camera.position.z += (targetZ.current - camera.position.z) * 0.08;
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

/* ────────────────────────────────────────────────────────────
   Public component
   ──────────────────────────────────────────────────────────── */

export default function ThreeStatue() {
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [cameraZ, setCameraZ] = useState(5.5);
  const lastPointerX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  /* ── Scroll-wheel zoom ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCameraZ((prev) => {
        const next = prev + e.deltaY * 0.004;
        return Math.max(4.0, Math.min(7.0, next)); // tighter clamp to prevent overflow
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setDragDeltaX(0);
    lastPointerX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - lastPointerX.current;
      setDragDeltaX(delta);
    },
    [isDragging]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    setDragDeltaX(0);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 50, near: 0.1, far: 1000 }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <CameraSetup zoom={cameraZ} />
        <StudioLights />
        <ShadowGround />
        <StatueModel
          dragDeltaX={dragDeltaX}
          isDragging={isDragging}
          onLoaded={handleLoaded}
        />
      </Canvas>

      {/* Subtle drag hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 0.45 : 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="rgba(235,209,151,0.55)" strokeWidth="1.5"
          animate={{ x: [0, 10, -10, 0] }}
          transition={{ duration: 2.5, repeat: 3, ease: "easeInOut", delay: 2.5 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
        <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(235,209,151,0.4)" }}>
          Drag to explore
        </span>
      </motion.div>
    </motion.div>
  );
}

useGLTF.preload("/scene-v1.glb");
