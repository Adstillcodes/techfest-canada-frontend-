"use client";

import { useRef, useEffect, useCallback } from "react";

// Nodes spread across all hemispheres to avoid clustering
const TECH_NODES = [
  // Tech Pillars (orange)
  { lat:  47.0,  lng: -105.0, shortLabel: "AI",         type: "pillar" },  // North America
  { lat:  62.0,  lng:   18.0, shortLabel: "Quantum",    type: "pillar" },  // Scandinavia
  { lat: -28.0,  lng:  133.0, shortLabel: "Sustain.",   type: "pillar" },  // Australia
  { lat:  28.0,  lng:  -90.0, shortLabel: "Cyber",      type: "pillar" },  // SE United States
  { lat:  36.0,  lng:  138.0, shortLabel: "Robotics",   type: "pillar" },  // Japan
  // Applied Sectors (purple)
  { lat:  23.0,  lng:   44.0, shortLabel: "Energy",     type: "sector" },  // Saudi Arabia
  { lat:  18.0,  lng:   76.0, shortLabel: "Health",     type: "sector" },  // India
  { lat:  53.0,  lng:   -3.0, shortLabel: "Defence",    type: "sector" },  // UK
  { lat: -22.0,  lng:  -48.0, shortLabel: "FinServ",    type: "sector" },  // Brazil
  { lat:   2.0,  lng:  105.0, shortLabel: "Supply",     type: "sector" },  // Singapore
];

const CONNECTIONS = [
  { from: [ 47.0, -105.0], to: [ 62.0,   18.0] },
  { from: [ 47.0, -105.0], to: [ 28.0,  -90.0] },
  { from: [ 62.0,   18.0], to: [-28.0,  133.0] },
  { from: [-28.0,  133.0], to: [ 36.0,  138.0] },
  { from: [ 36.0,  138.0], to: [ 47.0, -105.0] },
  { from: [ 47.0, -105.0], to: [-22.0,  -48.0] },
  { from: [ 47.0, -105.0], to: [ 18.0,   76.0] },
  { from: [ 28.0,  -90.0], to: [ 53.0,   -3.0] },
  { from: [ 28.0,  -90.0], to: [-22.0,  -48.0] },
  { from: [ 62.0,   18.0], to: [ 23.0,   44.0] },
  { from: [ 62.0,   18.0], to: [ 53.0,   -3.0] },
  { from: [-28.0,  133.0], to: [  2.0,  105.0] },
  { from: [ 36.0,  138.0], to: [  2.0,  105.0] },
  { from: [ 36.0,  138.0], to: [ 18.0,   76.0] },
  { from: [ 23.0,   44.0], to: [  2.0,  105.0] },
  { from: [ 18.0,   76.0], to: [-22.0,  -48.0] },
];

function latLngToXYZ(lat, lng, r) {
  const phi   = ((90 - lat)  * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
  ];
}
function rotateY(x, y, z, a) { const c=Math.cos(a),s=Math.sin(a); return [x*c+z*s, y, -x*s+z*c]; }
function rotateX(x, y, z, a) { const c=Math.cos(a),s=Math.sin(a); return [x, y*c-z*s, y*s+z*c]; }
function project(x, y, z, cx, cy, fov) { const sc=fov/(fov+z); return [x*sc+cx, y*sc+cy]; }

export function InteractiveGlobe({ className = "", size = 460, isDarkMode = true, autoRotateSpeed = 0.0018 }) {
  const canvasRef = useRef(null);
  const rotYRef   = useRef(0.4);
  const rotXRef   = useRef(0.25);
  const dragRef   = useRef({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef   = useRef(0);
  const timeRef   = useRef(0);
  const dotsRef   = useRef([]);

  useEffect(() => {
    const dots = [], N = 1400, gr = (1 + Math.sqrt(5)) / 2;
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

    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.40;
    const fov = 600;

    if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
    timeRef.current += 0.012;
    const t = timeRef.current, ry = rotYRef.current, rx = rotXRef.current;

    ctx.clearRect(0, 0, w, h);

    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.6);
    glowGrad.addColorStop(0, isDarkMode ? "rgba(122,63,209,0.07)" : "rgba(122,63,209,0.04)");
    glowGrad.addColorStop(1, "rgba(122,63,209,0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = isDarkMode ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.15)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    for (const d of dotsRef.current) {
      let [x, y, z] = [d[0] * radius, d[1] * radius, d[2] * radius];
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const alpha = Math.max(0.08, 1 - (z + radius) / (2 * radius));
      ctx.beginPath();
      ctx.arc(sx, sy, 0.9 + alpha * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode
        ? `rgba(160,120,255,${(alpha * 0.5).toFixed(2)})`
        : `rgba(122,63,209,${(alpha * 0.32).toFixed(2)})`;
      ctx.fill();
    }

    for (const conn of CONNECTIONS) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0],   conn.to[1],   radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx); [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx); [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;
      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);
      const mX=(x1+x2)/2, mY=(y1+y2)/2, mZ=(z1+z2)/2;
      const mLen = Math.sqrt(mX*mX + mY*mY + mZ*mZ);
      const ah = radius * 1.28;
      const [scx, scy] = project((mX/mLen)*ah, (mY/mLen)*ah, (mZ/mLen)*ah, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = isDarkMode ? "rgba(160,100,255,0.28)" : "rgba(122,63,209,0.20)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      const tp = (Math.sin(t * 1.1 + conn.from[0] * 0.12) + 1) / 2;
      const bx = (1-tp)*(1-tp)*sx1 + 2*(1-tp)*tp*scx + tp*tp*sx2;
      const by = (1-tp)*(1-tp)*sy1 + 2*(1-tp)*tp*scy + tp*tp*sy2;
      ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? "rgba(245,166,35,0.9)" : "rgba(200,120,0,0.85)";
      ctx.fill();
      const bGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 6);
      bGlow.addColorStop(0, "rgba(245,166,35,0.35)");
      bGlow.addColorStop(1, "rgba(245,166,35,0)");
      ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fillStyle = bGlow; ctx.fill();
    }

    for (const node of TECH_NODES) {
      let [x, y, z] = latLngToXYZ(node.lat, node.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const isPillar = node.type === "pillar";
      const pulse = Math.sin(t * 2.2 + node.lat * 0.15) * 0.5 + 0.5;
      const rA = 0.18 + pulse * 0.22;
      ctx.beginPath(); ctx.arc(sx, sy, 5 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = isPillar ? `rgba(245,166,35,${rA})` : `rgba(122,63,209,${rA + 0.1})`;
      ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, sy, 3 + pulse * 2, 0, Math.PI * 2);
      ctx.strokeStyle = isPillar ? `rgba(245,166,35,${rA+0.15})` : `rgba(160,100,255,${rA+0.15})`;
      ctx.lineWidth = 0.8; ctx.stroke();
      const cg = ctx.createRadialGradient(sx, sy, 0, sx, sy, isPillar ? 4.5 : 3.5);
      if (isPillar) {
        cg.addColorStop(0, "rgba(255,220,100,1)");
        cg.addColorStop(1, "rgba(245,166,35,0.8)");
      } else {
        cg.addColorStop(0, isDarkMode ? "rgba(200,160,255,1)" : "rgba(140,80,220,1)");
        cg.addColorStop(1, "rgba(122,63,209,0.8)");
      }
      ctx.beginPath(); ctx.arc(sx, sy, isPillar ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = cg; ctx.fill();
      if (node.shortLabel) {
        ctx.font = `${isPillar ? "bold " : ""}9.5px monospace`;
        ctx.fillStyle = isPillar
          ? "rgba(245,180,35,0.95)"
          : isDarkMode ? "rgba(190,150,255,0.8)" : "rgba(100,50,180,0.8)";
        ctx.fillText(node.shortLabel, sx + 7, sy + 3.5);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [isDarkMode, autoRotateSpeed]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onPointerDown = useCallback((e) => {
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotYRef.current, startRotX: rotXRef.current };
    e.target.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    rotYRef.current = dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005;
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005));
  }, []);
  const onPointerUp = useCallback(() => { dragRef.current.active = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size, cursor: "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
