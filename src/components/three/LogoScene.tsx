"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildPieces } from "./logoGeometry";
import { FOCUS_Z, pieceTarget } from "./storyMath";

type Props = { svgText: string; progress: React.RefObject<number>; pointer: boolean };

const target = new THREE.Vector3();
const before = new THREE.Vector3();
const EPS = 1e-4;

function Pieces({ svgText, progress, pointer }: Props) {
  // Re-centre each part on its piece centre so a piece turns in place rather than orbiting the logo centre.
  const pieces = useMemo(
    () =>
      buildPieces(svgText).map((p) => {
        p.parts.forEach((pt) => pt.geometry.translate(-p.center.x, -p.center.y, -p.center.z));
        return p;
      }),
    [svgText],
  );
  const refs = useRef<(THREE.Group | null)[]>([]);
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  // Place every piece at its assembled position once per geometry set (never on re-render).
  useLayoutEffect(() => {
    pieces.forEach((piece, i) => refs.current[i]?.position.copy(piece.center));
    invalidate();
  }, [pieces, invalidate]);

  useEffect(() => () => pieces.forEach((p) => p.parts.forEach((pt) => pt.geometry.dispose())), [pieces]);

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    const k = 1 - Math.pow(0.0001, Math.min(delta, 0.1)); // frame-rate independent damping
    let moving = false;
    pieces.forEach((piece, i) => {
      const g = refs.current[i];
      if (!g) return;
      const t = pieceTarget(i, p, pieces.length);
      // Assembled place + story offset; the focused piece is also pulled to the frame centre.
      const pull = 1 - Math.max(0, t.pos[2]) / FOCUS_Z;
      const c = piece.center;
      before.copy(g.position);
      g.position.lerp(target.set(c.x * pull + t.pos[0], c.y * pull + t.pos[1], c.z + t.pos[2]), k);
      const drx = (t.rot[0] - g.rotation.x) * k;
      const dry = (t.rot[1] - g.rotation.y) * k;
      g.rotation.x += drx;
      g.rotation.y += dry;
      let dOpacity = 0;
      for (const child of g.children) {
        const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        dOpacity = (1 - t.dim - mat.opacity) * k;
        mat.opacity += dOpacity;
      }
      if (before.distanceToSquared(g.position) > 1e-8 || Math.abs(drx) > EPS || Math.abs(dry) > EPS || Math.abs(dOpacity) > EPS) moving = true;
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
        <group
          key={piece.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          {piece.parts.map((part) => (
            <mesh key={part.geometry.uuid} geometry={part.geometry}>
              <meshPhysicalMaterial color={part.color} roughness={0.45} clearcoat={0.3} metalness={0.05} side={THREE.DoubleSide} transparent opacity={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Frameloop is "demand": wake the scene whenever scroll progress or the pointer changes.
function Invalidator({ progress, pointer }: { progress: React.RefObject<number>; pointer: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const canvas = useThree((s) => s.gl.domElement);
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
    // Only the canvas' own pointer moves wake the scene (R3F tracks the pointer on the canvas too).
    if (pointer) canvas.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, [invalidate, progress, pointer, canvas]);
  return null;
}

function LogoSceneImpl(props: Props) {
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

// Memoised: scroll-driven state in the parent must never re-render the R3F tree; progress flows via the ref.
const LogoScene = memo(LogoSceneImpl);
export default LogoScene;
