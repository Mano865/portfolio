"use client";

import { useEffect, useRef } from "react";

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // Depth layer (0.52..1.0)
  radius: number;
  phase: number;
  pulseSpeed: number;
  role: "hub" | "token";
  tint: "gold" | "blue" | "slate";
  activation: number; // 0..1 smooth decay glow
  ripple: number; // 0..1 expanding ring progress
}

interface NeuralEdge {
  a: number;
  b: number;
  curveOffset: number;
  dist: number;
}

interface SignalPulse {
  from: number;
  to: number;
  curveOffset: number;
  t: number; // 0..1
  speed: number;
  tint: "gold" | "blue";
  hopsLeft: number;
}

interface NavigateEventDetail {
  href: string;
  id?: string;
}

// Keep the neural network clearly alive and continuously moving across every section
const SECTION_INTENSITY: Record<string, number> = {
  top: 1.0,
  about: 0.9,
  projects: 0.96,
  experience: 0.9,
  skills: 0.96,
  education: 0.9,
  contact: 0.95,
};

function quadPoint(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  t: number
): [number, number] {
  const inv = 1 - t;
  return [
    inv * inv * x0 + 2 * inv * t * cx + t * t * x1,
    inv * inv * y0 + 2 * inv * t * cy + t * t * y1,
  ];
}

function getControlPoint(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  curveOffset: number
): [number, number] {
  const mx = (x0 + x1) * 0.5;
  const my = (y0 + y1) * 0.5;
  const dx = x1 - x0;
  const dy = y1 - y0;
  return [mx - dy * curveOffset, my + dx * curveOffset];
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Persistent Continuous AI Neural Network Background ("Latent Attention Field").
 * Runs as a single unbroken HTML5 2D Canvas RAF loop across all sections,
 * never resetting on section navigation, with clearly visible drifting nodes,
 * dynamically adapting connections, traveling signal pulses, and pulsing hubs.
 * When prefers-reduced-motion is enabled on the OS, switches to a calm ambient
 * pace (no scroll-parallax shifts) while remaining continuously alive.
 */
export function AiNeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let calmMode = motionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let connectionDist = 275;
    let maxPulses = 22;
    let currentTier: "desktop" | "tablet" | "mobile" | null = null;

    let nodes: NeuralNode[] = [];
    let pulses: SignalPulse[] = [];
    let renderY = new Float32Array(0);
    let rafId: number | null = null;
    let lastTime = 0;
    let elapsed = 0;
    let bootAlpha = 0.2;
    let pulseSpawnTimer = 0.08;

    // Continuous scroll & section awareness (zero React state updates per frame)
    let scrollY = window.scrollY;
    let smoothScrollY = scrollY;
    let targetIntensity = 1.0;
    let currentIntensity = 1.0;
    let hasLeftHero = scrollY > 420;
    let lastHomeBurstAt = 0;

    // Subtle desktop pointer coupling
    const pointer = { x: -9999, y: -9999, active: false };
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    function getViewportTier(w: number): "desktop" | "tablet" | "mobile" {
      if (w >= 1024) return "desktop";
      if (w >= 640) return "tablet";
      return "mobile";
    }

    function updateRenderPositions() {
      if (renderY.length !== nodes.length) {
        renderY = new Float32Array(nodes.length);
      }
      const pad = 48;
      const wrapH = height + pad * 2;
      const parallaxOffset = calmMode ? 0 : smoothScrollY;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const shift = parallaxOffset * (0.04 + n.z * 0.075);
        let sy = (n.y - shift + pad) % wrapH;
        if (sy < 0) sy += wrapH;
        renderY[i] = sy - pad;
      }
    }

    function createTopology() {
      const tier = getViewportTier(width);
      currentTier = tier;
      const isDesktop = tier === "desktop";
      const isTablet = tier === "tablet";

      const cols = isDesktop ? 8 : isTablet ? 6 : 4;
      const rows = isDesktop ? 6 : isTablet ? 5 : 5;
      connectionDist = isDesktop ? 275 : isTablet ? 225 : 185;
      maxPulses = isDesktop ? 22 : isTablet ? 14 : 9;

      const cellW = width / cols;
      const cellH = height / rows;
      const created: NeuralNode[] = [];

      let index = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          index++;
          const jx = (Math.random() - 0.5) * cellW * 0.78;
          const jy = (Math.random() - 0.5) * cellH * 0.78;
          const x = clamp((c + 0.5) * cellW + jx, 20, width - 20);
          const y = clamp((r + 0.5) * cellH + jy, 20, height - 20);
          const z = 0.54 + Math.random() * 0.46;
          const isHub = index % 4 === 0 || (r === 1 && c === cols - 2);
          const tint: NeuralNode["tint"] = isHub
            ? index % 2 === 0
              ? "gold"
              : "blue"
            : Math.random() < 0.36
              ? "blue"
              : "slate";

          // Clearly perceptible continuous drift in varied directions
          const speedBase = (22 + Math.random() * 20) * z;
          const angle = Math.random() * Math.PI * 2;

          created.push({
            x,
            y,
            vx: Math.cos(angle) * speedBase,
            vy: Math.sin(angle) * speedBase,
            z,
            radius: isHub ? 2.6 + z * 1.25 : 1.5 + z * 0.9,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 1.55 + Math.random() * 1.2,
            role: isHub ? "hub" : "token",
            tint,
            activation: isHub ? 0.55 : 0.14,
            ripple: 0,
          });
        }
      }

      nodes = created;
      pulses = [];
      updateRenderPositions();
    }

    /**
     * Compute nearest-neighbor synaptic edges using actual rendered positions
     * so lines smoothly form, stretch, rotate, and reconnect based on distance.
     */
    function computeEdges(): NeuralEdge[] {
      const nCount = nodes.length;
      if (nCount === 0) return [];

      const maxPerNode = width >= 1024 ? 4 : 3;
      const maxDistSq = connectionDist * connectionDist;
      const candidates: NeuralEdge[] = [];

      for (let i = 0; i < nCount; i++) {
        const a = nodes[i];
        const ay = renderY[i];

        for (let j = i + 1; j < nCount; j++) {
          const b = nodes[j];
          const by = renderY[j];
          const dx = b.x - a.x;
          const dy = by - ay;
          const distSq = dx * dx + dy * dy;
          if (distSq > maxDistSq || distSq < 625) continue;

          const bendDir = (i + j) % 2 === 0 ? 1 : -1;
          candidates.push({
            a: i,
            b: j,
            curveOffset: bendDir * (0.05 + ((i * 7 + j * 13) % 7) * 0.011),
            dist: Math.sqrt(distSq),
          });
        }
      }

      // Prioritize shortest distances so reconnections feel natural and organic
      candidates.sort((u, v) => u.dist - v.dist);

      const counts = new Uint8Array(nCount);
      const edges: NeuralEdge[] = [];
      for (let i = 0; i < candidates.length; i++) {
        const e = candidates[i];
        if (counts[e.a] >= maxPerNode || counts[e.b] >= maxPerNode) continue;
        counts[e.a]++;
        counts[e.b]++;
        edges.push(e);
      }

      return edges;
    }

    function spawnPulse(
      edges: NeuralEdge[],
      preferredStart?: number,
      preferredTint?: "gold" | "blue",
      hopsLeft = 2
    ) {
      if (edges.length === 0 || pulses.length >= maxPulses) return;

      let candidates = edges;
      if (preferredStart !== undefined) {
        const linked = edges.filter(
          (e) => e.a === preferredStart || e.b === preferredStart
        );
        if (linked.length > 0) candidates = linked;
      }

      const edge = candidates[Math.floor(Math.random() * candidates.length)];
      const forward =
        preferredStart !== undefined
          ? edge.a === preferredStart
          : Math.random() > 0.5;
      const from = forward ? edge.a : edge.b;
      const to = forward ? edge.b : edge.a;

      if (pulses.some((p) => p.from === from && p.to === to && p.t < 0.3)) {
        return;
      }

      const fromNode = nodes[from];
      const tint: "gold" | "blue" =
        preferredTint ??
        (fromNode.tint === "gold"
          ? "gold"
          : Math.random() < 0.55
            ? "gold"
            : "blue");

      fromNode.activation = Math.max(fromNode.activation, 0.85);
      pulses.push({
        from,
        to,
        curveOffset: forward ? edge.curveOffset : -edge.curveOffset,
        t: 0,
        speed: 0.65 + Math.random() * 0.42,
        tint,
        hopsLeft,
      });
    }

    function triggerBurst(count: number, preferGold = true) {
      if (nodes.length === 0) return;
      updateRenderPositions();
      const edges = computeEdges();
      if (edges.length === 0) return;

      const hubs = nodes
        .map((n, idx) => (n.role === "hub" ? idx : -1))
        .filter((idx) => idx >= 0);

      for (let i = 0; i < count; i++) {
        const hubIdx =
          hubs.length > 0
            ? hubs[Math.floor(Math.random() * hubs.length)]
            : undefined;
        spawnPulse(
          edges,
          hubIdx,
          preferGold && i % 2 === 0 ? "gold" : "blue",
          2
        );
      }
    }

    function resolveActiveSectionIntensity() {
      const y = window.scrollY;
      if (y < 260) {
        targetIntensity = SECTION_INTENSITY.top;
        if (hasLeftHero && performance.now() - lastHomeBurstAt > 1800) {
          hasLeftHero = false;
          lastHomeBurstAt = performance.now();
          triggerBurst(6, true);
        }
        return;
      }

      if (y > 420) {
        hasLeftHero = true;
      }

      const sectionIds = [
        "about",
        "projects",
        "experience",
        "skills",
        "education",
        "contact",
      ];
      const focusLine = window.innerHeight * 0.42;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focusLine && rect.bottom >= focusLine) {
          targetIntensity = SECTION_INTENSITY[id] ?? 0.92;
          return;
        }
      }
    }

    function drawFrame(dt: number) {
      ctx!.clearRect(0, 0, width, height);

      const intensity = currentIntensity * bootAlpha;
      if (intensity <= 0.005) return;

      // Calm ambient speed scaling if OS prefers-reduced-motion is enabled
      const motionScale = calmMode ? 0.72 : 1.0;
      const stepDt = dt * motionScale;
      const parallaxOffset = calmMode ? 0 : smoothScrollY;

      // 1. Ambient atmospheric neural blooms
      const driftX = Math.sin(elapsed * 0.24) * 44;
      const driftY = Math.cos(elapsed * 0.19) * 32;

      const warmX = width * 0.78 + driftX;
      const warmY =
        height * 0.24 + driftY + Math.sin(parallaxOffset * 0.0012) * 34;
      const warmR = Math.max(width, height) * 0.5;
      const warmGrad = ctx!.createRadialGradient(
        warmX,
        warmY,
        0,
        warmX,
        warmY,
        warmR
      );
      warmGrad.addColorStop(0, `rgba(212, 163, 115, ${0.095 * intensity})`);
      warmGrad.addColorStop(0.5, `rgba(212, 163, 115, ${0.032 * intensity})`);
      warmGrad.addColorStop(1, "rgba(212, 163, 115, 0)");
      ctx!.fillStyle = warmGrad;
      ctx!.fillRect(0, 0, width, height);

      const coolX = width * 0.18 - driftX * 0.85;
      const coolY = height * 0.72 - driftY * 0.85;
      const coolR = Math.max(width, height) * 0.48;
      const coolGrad = ctx!.createRadialGradient(
        coolX,
        coolY,
        0,
        coolX,
        coolY,
        coolR
      );
      coolGrad.addColorStop(0, `rgba(143, 168, 191, ${0.085 * intensity})`);
      coolGrad.addColorStop(0.55, `rgba(143, 168, 191, ${0.028 * intensity})`);
      coolGrad.addColorStop(1, "rgba(143, 168, 191, 0)");
      ctx!.fillStyle = coolGrad;
      ctx!.fillRect(0, 0, width, height);

      // 2. Subtle computational coordinate dot lattice
      const spacing = width >= 768 ? 64 : 56;
      const gridShiftY = -(parallaxOffset * 0.06) % spacing;
      ctx!.fillStyle = `rgba(148, 163, 179, ${0.065 * intensity})`;
      for (let gx = spacing * 0.5; gx < width; gx += spacing) {
        for (let gy = gridShiftY; gy < height; gy += spacing) {
          if (gy < 0) continue;
          ctx!.fillRect(gx, gy, 1.25, 1.25);
        }
      }

      // 3. Continuous organic laminar drift for all neural nodes
      if (stepDt > 0) {
        const pad = 48;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const flowX = Math.sin(elapsed * 0.55 + n.phase) * 14 * n.z;
          const flowY = Math.cos(elapsed * 0.47 + n.phase * 1.25) * 14 * n.z;
          n.x += (n.vx + flowX) * stepDt;
          n.y += (n.vy + flowY) * stepDt;

          if (n.x < -pad) n.x = width + pad;
          else if (n.x > width + pad) n.x = -pad;
          if (n.y < -pad) n.y = height + pad;
          else if (n.y > height + pad) n.y = -pad;

          if (pointer.active && !calmMode) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < 230 * 230 && dSq > 4) {
              const d = Math.sqrt(dSq);
              const pull = (1 - d / 230) * 18 * stepDt;
              n.x += (dx / d) * pull;
              n.y += (dy / d) * pull;
              n.activation = Math.max(n.activation, (1 - d / 230) * 0.78);
            }
          }

          if (n.activation > 0) {
            n.activation = Math.max(0, n.activation - dt * 0.65);
          }
          if (n.ripple > 0) {
            n.ripple = Math.min(1, n.ripple + dt * 1.15);
            if (n.ripple >= 1) n.ripple = 0;
          }
        }
      }

      updateRenderPositions();
      const edges = computeEdges();

      // 4. Curved dynamically adapting synaptic connections
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const ay = renderY[e.a];
        const by = renderY[e.b];

        const proximity = smoothstep(connectionDist, 28, e.dist);
        const depthFade = (a.z + b.z) * 0.5;
        const energy = Math.max(a.activation, b.activation);
        const dynamicBend =
          e.curveOffset * (1 + Math.sin(elapsed * 0.9 + a.phase) * 0.25);
        const [cx, cy] = getControlPoint(a.x, ay, b.x, by, dynamicBend);

        let pointerBoost = 0;
        if (pointer.active && !calmMode) {
          const pdx = pointer.x - cx;
          const pdy = pointer.y - cy;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pDist < 220) pointerBoost = (1 - pDist / 220) * 0.22;
        }

        const baseAlpha =
          (0.06 + proximity * 0.26 * depthFade + energy * 0.18 + pointerBoost) *
          intensity;

        ctx!.beginPath();
        ctx!.moveTo(a.x, ay);
        ctx!.quadraticCurveTo(cx, cy, b.x, by);
        ctx!.lineWidth = 0.95 + proximity * 0.45 + energy * 0.35;
        ctx!.strokeStyle =
          energy > 0.22 || pointerBoost > 0.06
            ? `rgba(212, 163, 115, ${clamp(baseAlpha * 1.18, 0, 0.48)})`
            : `rgba(143, 168, 191, ${clamp(baseAlpha, 0, 0.34)})`;
        ctx!.stroke();
      }

      // 5. Continuous flowing neural signal pulses
      if (stepDt > 0) {
        pulseSpawnTimer -= stepDt;
        const cadence = lerp(0.28, 0.15, currentIntensity);
        if (pulseSpawnTimer <= 0) {
          spawnPulse(edges);
          pulseSpawnTimer = cadence * (0.7 + Math.random() * 0.55);
        }

        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += p.speed * stepDt;
          if (p.t >= 1) {
            const targetNode = nodes[p.to];
            if (targetNode) {
              targetNode.activation = 1;
              targetNode.ripple = 0.01;
              if (p.hopsLeft > 0 && Math.random() < 0.65) {
                spawnPulse(edges, p.to, p.tint, p.hopsLeft - 1);
              }
            }
            pulses.splice(i, 1);
          }
        }
      }

      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b) continue;
        const ay = renderY[p.from];
        const by = renderY[p.to];
        const dx = b.x - a.x;
        const dy = by - ay;
        if (dx * dx + dy * dy > connectionDist * connectionDist * 1.65) continue;

        const [cx, cy] = getControlPoint(a.x, ay, b.x, by, p.curveOffset);
        const tailT = Math.max(0, p.t - 0.28);
        const steps = 9;
        const isGold = p.tint === "gold";
        const rgb = isGold ? "212, 163, 115" : "143, 168, 191";

        for (let s = 0; s < steps; s++) {
          const frac = (s + 1) / steps;
          const t0 = lerp(tailT, p.t, s / steps);
          const t1 = lerp(tailT, p.t, frac);
          const [x0, y0] = quadPoint(a.x, ay, cx, cy, b.x, by, t0);
          const [x1, y1] = quadPoint(a.x, ay, cx, cy, b.x, by, t1);
          const segAlpha = frac * frac * 0.82 * intensity;

          ctx!.beginPath();
          ctx!.moveTo(x0, y0);
          ctx!.lineTo(x1, y1);
          ctx!.lineWidth = 0.9 + frac * 1.75;
          ctx!.strokeStyle = `rgba(${rgb}, ${segAlpha})`;
          ctx!.stroke();
        }

        const [hx, hy] = quadPoint(a.x, ay, cx, cy, b.x, by, p.t);
        const halo = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 13.5);
        halo.addColorStop(0, `rgba(${rgb}, ${0.88 * intensity})`);
        halo.addColorStop(0.42, `rgba(${rgb}, ${0.34 * intensity})`);
        halo.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx!.fillStyle = halo;
        ctx!.beginPath();
        ctx!.arc(hx, hy, 13.5, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = isGold
          ? `rgba(250, 232, 206, ${0.98 * intensity})`
          : `rgba(228, 240, 252, ${0.96 * intensity})`;
        ctx!.beginPath();
        ctx!.arc(hx, hy, 2.55, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 6. Render luminous pulsing neural nodes & activation ripples
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const ny = renderY[i];
        const pulseWave = 0.5 + 0.5 * Math.sin(elapsed * n.pulseSpeed + n.phase);
        const alpha = clamp(
          (0.38 + n.z * 0.32 + pulseWave * 0.16 + n.activation * 0.34) *
            intensity,
          0,
          0.98
        );

        const rgb =
          n.tint === "gold"
            ? "212, 163, 115"
            : n.tint === "blue"
              ? "143, 168, 191"
              : "176, 190, 206";

        if (n.ripple > 0) {
          const rippleR = n.radius + n.ripple * 20;
          const rippleAlpha = (1 - n.ripple) * 0.56 * intensity;
          ctx!.beginPath();
          ctx!.arc(n.x, ny, rippleR, 0, Math.PI * 2);
          ctx!.lineWidth = 1.15;
          ctx!.strokeStyle = `rgba(${rgb}, ${rippleAlpha})`;
          ctx!.stroke();
        }

        if (n.role === "hub" || n.activation > 0.12) {
          const haloR =
            n.radius * (3.6 + pulseWave * 1.1 + n.activation * 2.4);
          const haloGrad = ctx!.createRadialGradient(
            n.x,
            ny,
            0,
            n.x,
            ny,
            haloR
          );
          haloGrad.addColorStop(
            0,
            `rgba(${rgb}, ${(0.28 + pulseWave * 0.1 + n.activation * 0.34) * intensity})`
          );
          haloGrad.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx!.fillStyle = haloGrad;
          ctx!.beginPath();
          ctx!.arc(n.x, ny, haloR, 0, Math.PI * 2);
          ctx!.fill();
        }

        const nodeRadius =
          n.radius * (0.92 + pulseWave * 0.24) + n.activation * 1.05;
        ctx!.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(n.x, ny, nodeRadius, 0, Math.PI * 2);
        ctx!.fill();

        if (n.role === "hub") {
          ctx!.beginPath();
          ctx!.arc(n.x, ny, n.radius + 3.6 + pulseWave * 1.6, 0, Math.PI * 2);
          ctx!.lineWidth = 0.95;
          ctx!.strokeStyle = `rgba(${rgb}, ${(0.22 + pulseWave * 0.14 + n.activation * 0.3) * intensity})`;
          ctx!.stroke();
        }
      }

      // 7. Gentle central readability veil preserving crisp text contrast
      const scrim = ctx!.createRadialGradient(
        width * 0.45,
        height * 0.48,
        width * 0.08,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.68
      );
      scrim.addColorStop(0, "rgba(15, 20, 25, 0.22)");
      scrim.addColorStop(0.62, "rgba(15, 20, 25, 0.08)");
      scrim.addColorStop(1, "rgba(15, 20, 25, 0)");
      ctx!.fillStyle = scrim;
      ctx!.fillRect(0, 0, width, height);
    }

    function resize(forceTopology = false) {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const widthChanged = Math.abs(nextWidth - width) > 20;
      const heightJumped = Math.abs(nextHeight - height) > 140;

      if (!forceTopology && width > 0 && !widthChanged && !heightJumped) {
        return;
      }

      const prevWidth = width;
      const prevHeight = height;
      const nextTier = getViewportTier(nextWidth);

      width = nextWidth;
      height = nextHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Preserve live node positions across same-tier resizes; rebuild only on init or breakpoint change
      if (forceTopology || nodes.length === 0 || currentTier !== nextTier) {
        createTopology();
        resolveActiveSectionIntensity();
        triggerBurst(width >= 768 ? 8 : 5, true);
      } else if (prevWidth > 0 && prevHeight > 0) {
        const sx = width / prevWidth;
        const sy = height / prevHeight;
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].x *= sx;
          nodes[i].y *= sy;
        }
        updateRenderPositions();
        resolveActiveSectionIntensity();
      }
    }

    function loop(now: number) {
      if (document.hidden) {
        rafId = null;
        return;
      }

      const dt =
        lastTime === 0 ? 1 / 60 : clamp((now - lastTime) / 1000, 0, 0.05);
      lastTime = now;
      elapsed += dt;

      if (bootAlpha < 1) {
        bootAlpha = Math.min(1, bootAlpha + dt * 1.6);
      }

      smoothScrollY = lerp(smoothScrollY, scrollY, Math.min(1, dt * 7));
      currentIntensity = lerp(
        currentIntensity,
        targetIntensity,
        Math.min(1, dt * 3.2)
      );

      drawFrame(dt);
      rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (document.hidden || rafId !== null) return;
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function onScroll() {
      scrollY = window.scrollY;
      resolveActiveSectionIntensity();
    }

    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    }

    let burstTimer: number | null = null;

    function onNavigate(event: Event) {
      const custom = event as CustomEvent<NavigateEventDetail>;
      const href = custom.detail?.href ?? "";
      const id = custom.detail?.id ?? (href === "#top" ? "top" : "");

      if (id && SECTION_INTENSITY[id] !== undefined) {
        targetIntensity = SECTION_INTENSITY[id];
      }

      if (burstTimer !== null) window.clearTimeout(burstTimer);

      if (href === "#top" || id === "top") {
        hasLeftHero = false;
        lastHomeBurstAt = performance.now();
        burstTimer = window.setTimeout(() => {
          triggerBurst(width >= 768 ? 7 : 4, true);
        }, 180);
      } else {
        burstTimer = window.setTimeout(() => {
          triggerBurst(
            width >= 768 ? 5 : 3,
            id === "projects" || id === "contact"
          );
        }, 180);
      }
    }

    function onMotionPreferenceChange(e: MediaQueryListEvent) {
      calmMode = e.matches;
      startLoop();
    }

    resize(true);
    drawFrame(1 / 60);
    startLoop();

    let resizeTimer: number | null = null;
    function onResize() {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => resize(false), 140);
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("portfolio:navigate", onNavigate);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionPreferenceChange);

    if (isFinePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      stopLoop();
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      if (burstTimer !== null) window.clearTimeout(burstTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("portfolio:navigate", onNavigate);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionPreferenceChange);
      if (isFinePointer) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ai-background="latent-attention-field"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none"
    />
  );
}
