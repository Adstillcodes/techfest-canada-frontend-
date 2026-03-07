"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  isDarkMode?: boolean;
  autoRotateSpeed?: number;
}

// ── 10 TECH PILLARS & APPLIED SECTORS ──────────────────────────────────────
const TECH_NODES = [
  // Tech Pillars
  { lat: 37.78,  lng: -122.42, label: "AI",            shortLabel: "AI",         type: "pillar" },
  { lat: 46.23,  lng:    6.05, label: "Quantum",        shortLabel: "Quantum",    type: "pillar" },
  { lat: 59.91,  lng:   10.75, label: "Sustainability", shortLabel: "Sustain.",   type: "pillar" },
  { lat: 38.89,  lng:  -77.03, label: "Cybersecurity",  shortLabel: "Cyber",      type: "pillar" },
  { lat: 35.68,  lng:  139.69, label: "Robotics",       shortLabel: "Robotics",   type: "pillar" },
  // Applied Sectors
  { lat: 25.20,  lng:   55.27, label: "Energy",         shortLabel: "Energy",     type: "sector" },
  { lat: 42.36,  lng:  -71.06, label: "Healthcare",     shortLabel: "Health",     type: "sector" },
  { lat: 51.51,  lng:   -0.13, label: "Defence",        shortLabel: "Defence",    type: "sector" },
  { lat: 40.71,  lng:  -74.01, label: "FinServ",        shortLabel: "FinServ",    type: "sector" },
  { lat:  1.35,  lng:  103.82, label: "Supply Chain",   shortLabel: "Supply",     type: "sector" },
];

// ── FULL MESH OF INTERCONNECTIONS ──────────────────────────────────────────
const CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  // Pillar ↔ Pillar
  { from: [37.78, -122.42], to: [46.23,    6.05] },  // AI → Quantum
  { from: [37.78, -122.42], to: [38.89,  -77.03] },  // AI → Cybersecurity
  { from: [46.23,    6.05], to: [59.91,   10.75] },  // Quantum → Sustainability
  { from: [59.91,   10.75], to: [51.51,   -0.13] },  // Sustainability → Defence
  { from: [35.68,  139.69], to: [37.78, -122.42] },  // Robotics → AI
  { from: [35.68,  139.69], to:  [1.35,  103.82] },  // Robotics → Supply Chain
  // Pillar ↔ Sector
  { from: [37.78, -122.42], to: [42.36,  -71.06] },  // AI → Healthcare
  { from: [37.78, -122.42], to: [40.71,  -74.01] },  // AI → FinServ
  { from: [38.89,  -77.03], to: [51.51,   -0.13] },  // Cyber → Defence
  { from: [38.89,  -77.03], to: [40.71,  -74.01] },  // Cyber → FinServ
  { from: [59.91,   10.75], to: [25.20,   55.27] },  // Sustain → Energy
  { from: [35.68,  139.69], to: [42.36,  -71.06] },  // Robotics → Healthcare
  { from: [46.23,    6.05], to: [25.20,   55.27] },  // Quantum → Energy
  // Sector ↔ Sector
  { from: [25.20,   55.27], to:  [1.35,  103.82] },  // Energy → Supply Chain
  { from: [42.36,  -71.06], to: [40.71,  -74.01] },  // Healthcare → FinServ
  { from:  [1.35,  103.82], to: [35.68,  139.69] },  // Supply → Robotics
];

// ── MATH HELPERS ───────────────────────────────────────────────────────────
function latLngToXYZ(lat: number, lng: number, r: number): [number, number, number] {
  const phi   = ((90 - lat)   * Math.PI) / 180;
  const theta = ((lng + 180)  * Math.PI) / 180;
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
  ];
}
function rotateY(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function rotateX(x: number, y: number, z: number, a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}
function project(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy];
}

export function InteractiveGlobe({ className, size = 460, isDarkMode = true, autoRotateSpeed = 0.0018 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef   = useRef(0.4);
  const rotXRef   = useRef(0.25);
  const dragRef   = useRef({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef   = useRef<number>(0);
  const timeRef   = useRef(0);
  const dotsRef   = useRef<[number, number, number][]>([]);

  // Fibonacci sphere dot lattice
  useEffect(() => {
    const dots: [number, number, number][] = [];
    const N = 1400;
    const gr = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / gr;
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / N);
      dots.push([Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi)]);
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.clientWidth;
    const h   = canvas.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx     = w / 2;
    const cy     = h / 2;
    const radius = Math.min(w, h) * 0.40;
    const fov    = 600;

    if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
    timeRef.current += 0.012;
    const t  = timeRef.current;
    const ry = rotYRef.current;
    const rx = rotXRef.current;

    ctx.clearRect(0, 0, w, h);

    // ── AMBIENT GLOW ───────────────────────────────────────────────────────
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.6);
    if (isDarkMode) {
      glowGrad.addColorStop(0, "rgba(122,63,209,0.06)");
      glowGrad.addColorStop(0.5, "rgba(122,63,209,0.02)");
    } else {
      glowGrad.addColorStop(0, "rgba(122,63,209,0.04)");
      glowGrad.addColorStop(0.5, "rgba(122,63,209,0.01)");
    }
    glowGrad.addColorStop(1, "rgba(122,63,209,0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // ── GLOBE BASE CIRCLE ──────────────────────────────────────────────────
    const baseAlpha = isDarkMode ? "0.07" : "0.12";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(122,63,209,${baseAlpha})`;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // ── DOT LATTICE ────────────────────────────────────────────────────────
    for (const d of dotsRef.current) {
      let [x, y, z] = [d[0] * radius, d[1] * radius, d[2] * radius];
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const alpha    = Math.max(0.08, 1 - (z + radius) / (2 * radius));
      const dotSize  = 0.9 + alpha * 0.7;
      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode
        ? `rgba(160,120,255,${(alpha * 0.5).toFixed(2)})`
        : `rgba(122,63,209,${(alpha * 0.35).toFixed(2)})`;
      ctx.fill();
    }

    // ── CONNECTIONS (ARCS + TRAVELLING DOTS) ──────────────────────────────
    for (const conn of CONNECTIONS) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0],   conn.to[1],   radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx); [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx); [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      // Elevated bezier midpoint
      const mX = (x1 + x2) / 2, mY = (y1 + y2) / 2, mZ = (z1 + z2) / 2;
      const mLen = Math.sqrt(mX * mX + mY * mY + mZ * mZ);
      const ah   = radius * 1.28;
      const [scx, scy] = project((mX / mLen) * ah, (mY / mLen) * ah, (mZ / mLen) * ah, cx, cy, fov);

      // Arc line (purple-tinted)
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = isDarkMode
        ? "rgba(160,100,255,0.28)"
        : "rgba(122,63,209,0.20)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Travelling bead (orange accent)
      const tp  = (Math.sin(t * 1.1 + conn.from[0] * 0.12) + 1) / 2;
      const bx  = (1 - tp) * (1 - tp) * sx1 + 2 * (1 - tp) * tp * scx + tp * tp * sx2;
      const by  = (1 - tp) * (1 - tp) * sy1 + 2 * (1 - tp) * tp * scy + tp * tp * sy2;
      ctx.beginPath();
      ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? "rgba(245,166,35,0.9)" : "rgba(200,120,0,0.85)";
      ctx.fill();
      // Bead glow
      const beadGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 6);
      beadGlow.addColorStop(0, "rgba(245,166,35,0.35)");
      beadGlow.addColorStop(1, "rgba(245,166,35,0)");
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fillStyle = beadGlow;
      ctx.fill();
    }

    // ── NODES ──────────────────────────────────────────────────────────────
    for (const node of TECH_NODES) {
      let [x, y, z] = latLngToXYZ(node.lat, node.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const isPillar  = node.type === "pillar";
      const pulse     = Math.sin(t * 2.2 + node.lat * 0.15) * 0.5 + 0.5;

      // ── Outer pulse ring ──
      const ringAlpha = 0.18 + pulse * 0.22;
      ctx.beginPath();
      ctx.arc(sx, sy, 5 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = isPillar
        ? `rgba(245,166,35,${ringAlpha})`
        : `rgba(122,63,209,${ringAlpha + 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Mid ring ──
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + pulse * 2, 0, Math.PI * 2);
      ctx.strokeStyle = isPillar
        ? `rgba(245,166,35,${ringAlpha + 0.15})`
        : `rgba(160,100,255,${ringAlpha + 0.15})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // ── Core dot ──
      const coreGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, isPillar ? 4.5 : 3.5);
      if (isPillar) {
        coreGrad.addColorStop(0, "rgba(255,220,100,1)");
        coreGrad.addColorStop(1, "rgba(245,166,35,0.8)");
      } else {
        coreGrad.addColorStop(0, isDarkMode ? "rgba(200,160,255,1)" : "rgba(140,80,220,1)");
        coreGrad.addColorStop(1, "rgba(122,63,209,0.8)");
      }
      ctx.beginPath();
      ctx.arc(sx, sy, isPillar ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // ── Label ──
      if (node.shortLabel) {
        ctx.font = `${isPillar ? "bold " : ""}9.5px 'Orbitron', monospace, sans-serif`;
        const labelAlpha = isDarkMode
          ? (isPillar ? "0.95" : "0.75")
          : (isPillar ? "0.85" : "0.65");
        ctx.fillStyle = isPillar
          ? `rgba(245,180,35,${labelAlpha})`
          : isDarkMode
            ? `rgba(190,150,255,${labelAlpha})`
            : `rgba(100,50,180,${labelAlpha})`;
        ctx.fillText(node.shortLabel, sx + 7, sy + 3.5);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [isDarkMode, autoRotateSpeed]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotYRef.current, startRotX: rotXRef.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    rotYRef.current = dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005;
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005));
  }, []);

  const onPointerUp = useCallback(() => { dragRef.current.active = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("cursor-grab active:cursor-grabbing", className)}
      style={{ width: size, height: size }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
