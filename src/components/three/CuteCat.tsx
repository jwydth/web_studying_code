"use client";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { QuadraticBezierLine, Line as DreiLine } from "@react-three/drei";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = { fur?: string };

export default function CuteCat({ fur = "#f5c6a5" }: Props) {
  const group = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const mouth = useRef<THREE.Mesh>(null!);
  const tail = useRef<THREE.Group>(null!);
  const earL = useRef<THREE.Group>(null!);
  const earR = useRef<THREE.Group>(null!);
  const lidL = useRef<THREE.Mesh>(null!);
  const lidR = useRef<THREE.Mesh>(null!);
  const whiskers = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [meow, setMeow] = useState(0); // 0..1 open amount
  const [cycle, setCycle] = useState(0);
  const blink = useRef(0); // 0..1 eyelid closed
  const blinkTarget = useRef(0);

  // random blink scheduler
  useEffect(() => {
    let t: number;
    const tick = () => {
      blinkTarget.current = 1; // close
      setTimeout(() => (blinkTarget.current = 0), 120); // reopen
      t = window.setTimeout(tick, 1500 + Math.random() * 2500);
    };
    t = window.setTimeout(tick, 1200);
    return () => clearTimeout(t);
  }, []);

  // Materials
  const mats = useMemo(() => {
    const furMat = new THREE.MeshStandardMaterial({
      color: fur,
      roughness: 0.75,
      metalness: 0.02,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: "#1f2937",
      roughness: 0.5,
      metalness: 0.05,
    });
    const pink = new THREE.MeshStandardMaterial({
      color: "#f9a8d4",
      roughness: 0.3,
    });
    const white = new THREE.MeshStandardMaterial({
      color: "#f6f7fb",
      roughness: 0.2,
      metalness: 0.05,
    });
    return { furMat, dark, pink, white };
  }, [fur]);

  // darker stripe color derived from fur
  const stripe = useMemo(
    () => new THREE.Color(fur).offsetHSL(0, -0.05, -0.15).getStyle(),
    [fur]
  );

  // Idle + interactive animations
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // Smooth blink towards target
    blink.current = THREE.MathUtils.damp(
      blink.current,
      blinkTarget.current,
      12, // smoothing (higher = snappier); ~0.18 lambda ≈ 10–14 here
      dt
    );

    // Subtle breathing; a bit more squash on hover
    const breath = 1 + Math.sin(t * 2) * 0.015;
    const squash = hovered ? 1.04 : 1;
    group.current.scale.set(breath * squash, breath / squash, breath * squash);

    // Head follows pointer slightly
    const { x, y } = state.pointer;
    easing.dampE(
      head.current.rotation,
      new THREE.Euler(y * 0.35, x * 0.55, 0),
      0.2,
      dt
    );

    // Pupils/glints: move with pointer (small)
    head.current.children.forEach((child) => {
      const data = child.userData as { pupil?: boolean; glint?: boolean; side?: number };
      if (data.pupil) {
        const m = child as THREE.Mesh;
        easing.damp3(
          m.position,
          new THREE.Vector3(
            (x ?? 0) * 0.05 + (data.side ?? 0) * 0.18,
            1.28 + (y ?? 0) * 0.04,
            0.78
          ),
          0.25,
          dt
        );
      }
      if (data.glint) {
        const m = child as THREE.Mesh;
        easing.damp3(
          m.position,
          new THREE.Vector3(
            (x ?? 0) * 0.03 + (data.side ?? 0) * 0.21,
            1.31 + (y ?? 0) * 0.02,
            0.86
          ),
          0.25,
          dt
        );
      }
    });

    // Eyelids scale Y by blink value
    const sY = 1 - blink.current; // 1 open, 0 closed
    if (lidL.current) lidL.current.scale.y = Math.max(0.05, sY);
    if (lidR.current) lidR.current.scale.y = Math.max(0.05, sY);

    // Ear twitch (randomish)
    const tw = Math.sin(t * 6 + 1.3) * 0.05 + Math.sin(t * 2.2) * 0.03;
    easing.dampE(
      earL.current.rotation,
      new THREE.Euler(0.02 + tw, 0.02, 0.2 + tw * 0.6),
      0.3,
      dt
    );
    easing.dampE(
      earR.current.rotation,
      new THREE.Euler(0.02 - tw, 0.02, -0.2 - tw * 0.6),
      0.3,
      dt
    );

    // Tail wag (hover increases amplitude a bit)
    const amp = hovered ? 0.55 : 0.4;
    tail.current.rotation.y = Math.sin(t * 3) * amp;
    tail.current.rotation.z = Math.cos(t * 2.2) * 0.12;

    // Slight whisker jitter
    whiskers.current.rotation.z = Math.sin(t * 3.5) * 0.02;

    // Auto close mouth when meow set
    if (meow > 0) {
      const mTarget = Math.max(0, meow - dt * 2); // ease back to 0
      setMeow(mTarget);
    }
    if (mouth.current) {
      const open = meow; // 0..1
      easing.damp3(
        mouth.current.scale,
        [1, 1 + open * 0.9, 1],
        0.2,
        dt
      );
    }
  });

  const onClick = () => {
    setCycle((c) => (c + 1) % 4);
    setMeow(1); // quick "meow"
  };

  return (
    <group
      ref={group}
      position={[0, -0.25, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Body */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.4, 0]}
        scale={[1.2, 0.9, 1.6]}
      >
        <sphereGeometry args={[0.8, 32, 32]} />
        <primitive object={mats.furMat} attach="material" />
      </mesh>

      {/* Head wrapper so we can rotate pupils with it */}
      <group ref={head}>
        {/* Head sphere */}
        <mesh castShadow position={[0, 1.2, 0.35]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <primitive object={mats.furMat} attach="material" />
        </mesh>

        {/* Eyes (pupils + glints) */}
        {([-1, 1] as const).map((side) => (
          <group key={side}>
            {/* pupil */}
            <mesh
              userData={{ pupil: true, side }}
              position={[side * 0.18, 1.28, 0.78]}
              castShadow
            >
              <sphereGeometry args={[0.06, 16, 16]} />
              <primitive object={mats.dark} attach="material" />
            </mesh>
            {/* tiny glint */}
            <mesh
              userData={{ glint: true, side }}
              position={[side * 0.21, 1.31, 0.86]}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <primitive object={mats.white} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Eyelids (scale Y to blink) */}
        <mesh ref={lidL} position={[-0.18, 1.28, 0.79]}>
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <primitive object={mats.furMat} attach="material" />
        </mesh>
        <mesh ref={lidR} position={[0.18, 1.28, 0.79]}>
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <primitive object={mats.furMat} attach="material" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 1.16, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.04, 0.06, 10]} />
          <meshStandardMaterial color={mats.pink.color} roughness={0.4} />
        </mesh>

        {/* Mouth (torus scales in Y when meowing) */}
        <mesh ref={mouth} position={[0, 1.08, 0.83]}>
          <torusGeometry args={[0.055, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color={mats.dark.color} />
        </mesh>
      </group>

      {/* Ears */}
      <group ref={earL}>
        <Ear
          position={[-0.35, 1.62, 0.25]}
          outer={mats.furMat}
          inner={mats.pink}
        />
      </group>
      <group ref={earR}>
        <Ear
          position={[0.35, 1.62, 0.25]}
          outer={mats.furMat}
          inner={mats.pink}
        />
      </group>

      {/* Whiskers */}
      <group ref={whiskers}>
        <WhiskerSide
          y={1.16}
          z={0.82}
          side={-1}
          color={mats.white.color.getStyle()}
        />
        <WhiskerSide
          y={1.16}
          z={0.82}
          side={1}
          color={mats.white.color.getStyle()}
        />
      </group>

      {/* Paws */}
      <Paw position={[-0.38, 0.25, 0.75]} material={mats.white} />
      <Paw position={[0.38, 0.25, 0.75]} material={mats.white} />

      {/* Tail */}
      <group ref={tail} position={[0, 0.9, -0.65]}>
        <QuadraticBezierLine
          start={[0, 0, 0]}
          end={[0.1, 0.2, 1.1]}
          mid={[0.2, 0.5, 0.4]}
          color={stripe}
          lineWidth={4}
          dashed={false}
        />
      </group>

      {/* Little chest/stripe variations based on cycle */}
      {cycle > 0 && (
        <mesh position={[0, 0.88, 0.7]} scale={[0.42, 0.2, 0.3]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <primitive object={mats.white} attach="material" />
        </mesh>
      )}
      {cycle > 1 && (
        <mesh position={[0, 0.55, 0.7]} scale={[0.6, 0.18, 0.22]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <primitive object={mats.white} attach="material" />
        </mesh>
      )}
      {cycle > 2 && (
        <>
          <mesh position={[-0.45, 0.8, 0.2]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.02, 0.35, 0.02]} />
            <meshStandardMaterial color={stripe} />
          </mesh>
          <mesh position={[0.45, 0.8, 0.2]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.02, 0.35, 0.02]} />
            <meshStandardMaterial color={stripe} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ------- small sub-parts -------- */

function Ear({
  position,
  outer,
  inner,
}: {
  position: [number, number, number];
  outer: THREE.Material;
  inner: THREE.Material;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <coneGeometry args={[0.2, 0.28, 4]} />
        <primitive object={outer} attach="material" />
      </mesh>
      <mesh position={[0, -0.02, 0.02]} scale={0.6}>
        <coneGeometry args={[0.2, 0.28, 4]} />
        <primitive object={inner} attach="material" />
      </mesh>
    </group>
  );
}

function Paw({
  position,
  material,
}: {
  position: [number, number, number];
  material: THREE.Material;
}) {
  return (
    <mesh castShadow position={position}>
      <sphereGeometry args={[0.14, 16, 16]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

type Vec3 = [number, number, number];

function WhiskerLine({
  from,
  to,
  color,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
}) {
  const points = useMemo(() => [from, to], [from, to]);
  return <DreiLine points={points} color={color} lineWidth={1} />;
}

function WhiskerSide({
  y,
  z,
  side,
  color,
}: {
  y: number;
  z: number;
  side: 1 | -1;
  color: string;
}) {
  const x = 0.2 * side;
  const dx = 0.5 * side;
  return (
    <group>
      <WhiskerLine from={[x, y, z]} to={[x + dx, y + 0.02, z]} color={color} />
      <WhiskerLine
        from={[x, y - 0.03, z]}
        to={[x + dx, y - 0.02, z]}
        color={color}
      />
      <WhiskerLine
        from={[x, y + 0.03, z]}
        to={[x + dx, y + 0.06, z]}
        color={color}
      />
    </group>
  );
}
