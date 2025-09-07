"use client";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import CuteCat from "@/components/three/CuteCat";

export default function CatDemoPage() {
  const [fur, setFur] = useState("#f5c6a5"); // peach
  const palette = [
    ["Peach", "#f5c6a5"],
    ["Snow", "#f6f7fb"],
    ["Midnight", "#1f2937"],
    ["Ginger", "#f7b733"],
    ["Sage", "#9fd3c7"],
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          Interactive 3D Cat (React + Three)
        </h1>
        <p className="opacity-80">
          Move your mouse—head follows. Scroll/drag to orbit. Click the cat to
          cycle colors.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [2.8, 1.9, 4.3], fov: 45 }}
          style={{ height: 520, width: "100%" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <Environment preset="city" />
            <CuteCat fur={fur} />
            <ContactShadows
              opacity={0.35}
              scale={8}
              blur={2.5}
              far={8}
              color="#000000"
              position={[0, -0.001, 0]}
            />
            <OrbitControls
              enablePan={false}
              minPolarAngle={Math.PI / 3.5}
              maxPolarAngle={(Math.PI * 2) / 3}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm opacity-70 mr-1">Quick palette:</span>
        {palette.map(([name, hex]) => (
          <button
            key={hex}
            onClick={() => setFur(hex)}
            className="px-3 py-1 rounded-lg border bg-white/5 hover:bg-white/10 text-sm"
          >
            <span
              className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
              style={{ background: hex }}
            />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
