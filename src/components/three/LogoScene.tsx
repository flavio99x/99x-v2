"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildPieces } from "./logoGeometry";
import { FOCUS_Z, pieceTarget } from "./storyMath";

type Props = { svgText: string; progress: React.RefObject<number>; pointer: boolean };

const target = new THREE.Vector3();
const before = new THREE.Vector3();

function Pieces({ svgText, progress, pointer }: Props) {
  // Re-centre each piece on its own centre so it turns in place rather than orbiting the logo centre.
  const pieces = useMemo(
    () =>
      buildPieces(svgText).map((p) => {
        p.geometry.translate(-p.center.x, -p.center.y, -p.center.z);
        return p;
      }),
    [svgText],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => () => pieces.forEach((p) => p.geometry.dispose()), [pieces]);

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    const k = 1 - Math.pow(0.0001, Math.min(delta, 0.1)); // frame-rate independent damping
    let moving = false;
    pieces.forEach((_, i) => {
      const m = refs.current[i];
      if (!m) return;
      const t = pieceTarget(i, p, pieces.length);
      // Assembled place + story offset; the focused piece is also pulled to the frame centre.
      const pull = 1 - Math.max(0, t.pos[2]) / FOCUS_Z;
      const c = pieces[i].center;
      before.copy(m.position);
      m.position.lerp(target.set(c.x * pull + t.pos[0], c.y * pull + t.pos[1], c.z + t.pos[2]), k);
      m.rotation.x += (t.rot[0] - m.rotation.x) * k;
      m.rotation.y += (t.rot[1] - m.rotation.y) * k;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      const dOpacity = (1 - t.dim - mat.opacity) * k;
      mat.opacity += dOpacity;
      if (before.distanceToSquared(m.position) > 1e-8 || Math.abs(dOpacity) > 1e-4) moving = true;
    });
    if (pointer && group.current) {
      const g = group.current;
      const dy = (state.pointer.x * 0.1 - g.rotation.y) * 0.08;
      const dx = (-state.pointer.y * 0.1 - g.rotation.x) * 0.08;
      g.rotation.y += dy;
      g.rotation.x += dx;
      if (Math.abs(dx) + Math.abs(dy) > 1e-5) moving = true;
    }
    if (moving) invalidate();
  });

  return (
    <group ref={group} scale={0.95}>
      {pieces.map((piece, i) => (
        <mesh
          key={piece.id}
          ref={(el) => {
            // Start each piece at its assembled place (geometry is centred on the piece).
            if (el && refs.current[i] !== el) el.position.copy(piece.center);
            refs.current[i] = el;
          }}
          geometry={piece.geometry}
        >
          <meshPhysicalMaterial color={piece.color} roughness={0.45} clearcoat={0.3} metalness={0.05} side={THREE.DoubleSide} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

// Frameloop is "demand": wake the scene whenever scroll progress or the pointer changes.
function Invalidator({ progress, pointer }: { progress: React.RefObject<number>; pointer: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let last = -1;
    let raf = 0;
    const loop = () => {
      const p = progress.current ?? 0;
      if (p !== last) {
        last = p;
        invalidate();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onMove = () => invalidate();
    if (pointer) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [invalidate, progress, pointer]);
  return null;
}

export default function LogoScene(props: Props) {
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 3.6], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 2, 3]} scale={[6, 2, 1]} />
        <Lightformer intensity={1} position={[-3, 0, 1]} scale={[2, 4, 1]} />
        <Lightformer intensity={0.6} position={[3, -1, 2]} scale={[2, 2, 1]} color="#c49fd5" />
      </Environment>
      <ambientLight intensity={0.4} />
      <Pieces {...props} />
      <Invalidator progress={props.progress} pointer={props.pointer} />
    </Canvas>
  );
}
