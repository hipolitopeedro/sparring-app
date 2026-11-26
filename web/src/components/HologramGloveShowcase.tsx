import React, { useEffect, useRef, useState } from 'react';
import { Activity, ArrowRight, Cpu, ShieldCheck, Swords } from 'lucide-react';
import { AuthMode, UserRole } from '../types/sparring';

interface HologramGloveShowcaseProps {
  onOpenAuth: (mode: AuthMode, role: UserRole) => void;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface MeshData {
  vertices: Vec3[];
  edges: [number, number][];
  quads: [number, number, number, number][];
  part: 'fist' | 'thumb' | 'cuff' | 'strap';
}

interface StageInfo {
  id: string;
  tag: string;
  title: string;
  accentWord: string;
  description: string;
  metrics: { label: string; value: string }[];
  hudBadge: string;
  accentHex: string;
  side: 'right' | 'left';
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageInfo[] = [
  {
    id: '01',
    tag: 'MODULO 01 | PAREAMENTO BIOMETRICO',
    title: 'Matchmaking preciso por ',
    accentWord: 'peso, guarda e impacto',
    description:
      'Antes mesmo de amarrar as luvas, o algoritmo SparRing cruza peso real, envergadura, graduacao e nivel de intensidade (30% tecnico ate 90% combate) em 11 modalidades para eliminar riscos no tatame.',
    metrics: [
      { label: 'Tolerancia Segura', value: '+/- 6 KG' },
      { label: 'Intensidade', value: '30% - 90%' },
      { label: 'Compatibilidade', value: '98% MATCH' },
    ],
    hudBadge: 'SCAN FRONTAL // ZONA DE IMPACTO',
    accentHex: '#FF5500',
    side: 'right',
    icon: Swords,
  },
  {
    id: '02',
    tag: 'MODULO 02 | TELEMETRIA E CARTEL',
    title: 'A luva gira: controle ',
    accentWord: 'rounds, fadiga e guarda',
    description:
      'Do lado da palma e polegar, cada sessao vira dado acionavel no Cartel Digital: volume contra canhotos, distribuicao de boxe, chutes e clinch, alem do alerta automatico contra overtraining.',
    metrics: [
      { label: 'Fadiga Monitorada', value: '0 - 10 RPE' },
      { label: 'Streak Ativo', value: '14 DIAS' },
      { label: 'Card Instagram', value: 'PNG 1080P' },
    ],
    hudBadge: 'ROTACAO 180 GRAUS // TELEMETRIA INTERNA',
    accentHex: '#FF3B1F',
    side: 'left',
    icon: Activity,
  },
  {
    id: '03',
    tag: 'MODULO 03 | SELO DO MESTRE (B2B)',
    title: 'Validacao real no ',
    accentWord: 'punho e no tatame',
    description:
      'Academias e treinadores validam presencialmente peso e graduacao (CBMT, IBJJF, CABMMA, FIAS) no painel B2B, ativando o selo verde de confianca e liberando reservas em tatames ociosos.',
    metrics: [
      { label: 'Padroes Oficiais', value: '11 LUTAS' },
      { label: 'Split Academia', value: '88% REPASSE' },
      { label: 'Selo Tecnico', value: 'VALIDADO' },
    ],
    hudBadge: 'VERIFICACAO B2B // PROTOCOLO DE SEGURANCA',
    accentHex: '#22C55E',
    side: 'right',
    icon: ShieldCheck,
  },
  {
    id: '04',
    tag: 'MODULO 04 | FUTURO SMART',
    title: 'Pronto para ',
    accentWord: 'wearables e sensores',
    description:
      'Arquitetura pensada para integrar relogios inteligentes, aneis biometricos e sensores de punho, transformando cada round de treino em evolucao mensuravel para atletas e equipes.',
    metrics: [
      { label: 'Biometria Live', value: 'BPM + HRV' },
      { label: 'Ecossistema', value: 'WEB + APK' },
      { label: 'Mercado Brasil', value: '5M ATLETAS' },
    ],
    hudBadge: 'ROTACAO 360 GRAUS // CONECTIVIDADE SMART',
    accentHex: '#FF6B1A',
    side: 'left',
    icon: Cpu,
  },
];

/**
 * Generates a procedural 3D anatomical Boxing / Muay Thai Glove
 * with 4 distinct sub-meshes: padded fist dome, curved thumb,
 * tapered wrist cuff, and raised velcro strap.
 */
function buildBoxingGloveMeshes(): MeshData[] {
  const meshes: MeshData[] = [];

  // 1. MAIN PADDED FIST CHAMBER (sculpted anatomical boxing glove head)
  {
    const rings = 18;
    const segs = 22;
    const vertices: Vec3[] = [];
    const edges: [number, number][] = [];
    const quads: [number, number, number, number][] = [];

    for (let i = 0; i <= rings; i++) {
      const v = i / rings; // 0 = wrist base of fist, 1 = top knuckle crown
      const phi = v * Math.PI; // 0 -> PI

      // Height from y = -0.32 (wrist junction) to y = +1.18 (top crown)
      const y = -0.32 + Math.sin((v - 0.5) * Math.PI) * 0.75 + 0.75;
      // Sculpted radius profile: narrower at wrist, wide & plump at knuckles, rounded top
      const baseR = Math.pow(Math.sin(phi), 0.62);
      const knuckleBulge = 1 + 0.24 * Math.exp(-Math.pow((v - 0.62) / 0.28, 2));
      const rx = 0.76 * baseR * knuckleBulge;
      const rzFront = 0.72 * baseR * knuckleBulge;
      const rzBack = 0.52 * baseR * knuckleBulge;

      // Forward curve of the fist towards the striking knuckles (+Z)
      const zShift = 0.16 * Math.sin(v * Math.PI * 1.15);

      for (let j = 0; j < segs; j++) {
        const theta = (j / segs) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        // Make back of hand rounder (+Z) and inner palm slightly recessed (-Z)
        const isPalm = sinT < 0;
        const zDepth = isPalm ? rzBack : rzFront;
        const palmIndent = isPalm ? 0.12 * Math.sin(phi) * Math.abs(sinT) : 0;

        // Slight curl inward at the very fingertips (upper palm)
        const x = cosT * rx;
        const z = sinT * zDepth + zShift + palmIndent;
        vertices.push({ x, y: y - 0.15, z });
      }
    }

    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segs; j++) {
        const nextJ = (j + 1) % segs;
        const a = i * segs + j;
        const b = i * segs + nextJ;
        const c = (i + 1) * segs + nextJ;
        const d = (i + 1) * segs + j;
        edges.push([a, b], [a, d]);
        quads.push([a, b, c, d]);
      }
    }

    meshes.push({ vertices, edges, quads, part: 'fist' });
  }

  // 2. ANATOMICAL CURVED THUMB (wrapped along +X / inner-palm side for instant silhouette)
  {
    const steps = 12;
    const segs = 12;
    const vertices: Vec3[] = [];
    const edges: [number, number][] = [];
    const quads: [number, number, number, number][] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // 0 = base near wrist, 1 = thumb tip tucked near knuckles
      // Curved centerline in 3D space
      const cx = 0.62 + Math.sin(t * Math.PI * 0.85) * 0.28 - t * 0.18;
      const cy = -0.26 + t * 0.92;
      const cz = -0.18 - Math.sin(t * Math.PI) * 0.34 + t * 0.08;

      // Radius tapers at base and rounds off at tip
      const r = 0.25 * Math.pow(Math.sin(Math.min(1, t * 0.92 + 0.08) * Math.PI), 0.45);
      const rx = r * 0.92;
      const rz = r * 1.08;

      for (let j = 0; j < segs; j++) {
        const theta = (j / segs) * Math.PI * 2;
        const x = cx + Math.cos(theta) * rx;
        const z = cz + Math.sin(theta) * rz;
        const y = cy + Math.sin(theta) * r * 0.18;
        vertices.push({ x, y, z });
      }
    }

    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < segs; j++) {
        const nextJ = (j + 1) % segs;
        const a = i * segs + j;
        const b = i * segs + nextJ;
        const c = (i + 1) * segs + nextJ;
        const d = (i + 1) * segs + j;
        edges.push([a, b], [a, d]);
        quads.push([a, b, c, d]);
      }
    }

    meshes.push({ vertices, edges, quads, part: 'thumb' });
  }

  // 3. TAPERED WRIST CUFF / GAUNTLET
  {
    const rings = 9;
    const segs = 20;
    const vertices: Vec3[] = [];
    const edges: [number, number][] = [];
    const quads: [number, number, number, number][] = [];

    for (let i = 0; i <= rings; i++) {
      const t = i / rings; // 0 = bottom cuff opening, 1 = joins wrist
      const y = -1.28 + t * 0.96;
      const flare = 1 + (1 - t) * 0.14;
      const rx = 0.50 * flare;
      const rz = 0.44 * flare;

      for (let j = 0; j < segs; j++) {
        const theta = (j / segs) * Math.PI * 2;
        vertices.push({
          x: Math.cos(theta) * rx,
          y,
          z: Math.sin(theta) * rz - 0.04,
        });
      }
    }

    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segs; j++) {
        const nextJ = (j + 1) % segs;
        const a = i * segs + j;
        const b = i * segs + nextJ;
        const c = (i + 1) * segs + nextJ;
        const d = (i + 1) * segs + j;
        edges.push([a, b], [a, d]);
        quads.push([a, b, c, d]);
      }
    }

    meshes.push({ vertices, edges, quads, part: 'cuff' });
  }

  // 4. RAISED VELCRO WRIST STRAP BAND
  {
    const rings = 4;
    const segs = 20;
    const vertices: Vec3[] = [];
    const edges: [number, number][] = [];
    const quads: [number, number, number, number][] = [];

    for (let i = 0; i <= rings; i++) {
      const t = i / rings;
      const y = -1.04 + t * 0.36;
      const rx = 0.59;
      const rz = 0.52;
      for (let j = 0; j < segs; j++) {
        const theta = (j / segs) * Math.PI * 2;
        vertices.push({
          x: Math.cos(theta) * rx,
          y,
          z: Math.sin(theta) * rz - 0.04,
        });
      }
    }

    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segs; j++) {
        const nextJ = (j + 1) % segs;
        const a = i * segs + j;
        const b = i * segs + nextJ;
        const c = (i + 1) * segs + nextJ;
        const d = (i + 1) * segs + j;
        edges.push([a, b], [a, d]);
        quads.push([a, b, c, d]);
      }
    }

    meshes.push({ vertices, edges, quads, part: 'strap' });
  }

  return meshes;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Computes normalized X offset of the hologram (-1 = left column, +1 = right column)
 * as scroll progress moves 0 -> 1:
 *  Stage 1 (0.00-0.25): Right (+1)
 *  Stage 2 (0.25-0.55): Left  (-1)
 *  Stage 3 (0.55-0.80): Right (+1)
 *  Stage 4 (0.80-1.00): Left  (-1)
 */
function getGloveHorizontalOffset(p: number): number {
  const s1to2 = smoothstep(0.19, 0.34, p);
  const s2to3 = smoothstep(0.49, 0.64, p);
  const s3to4 = smoothstep(0.76, 0.90, p);
  return 1 - 2 * s1to2 + 2 * s2to3 - 2 * s3to4;
}

export const HologramGloveShowcase: React.FC<HologramGloveShowcaseProps> = ({ onOpenAuth }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [displayAngle, setDisplayAngle] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );

  // Refs for smooth 60fps animation without React re-render overhead
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const pointerTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragOffsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastDragXRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  const jumpToStage = (idx: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    const stageCenters = [0.06, 0.41, 0.70, 0.96];
    const targetTop = window.scrollY + rect.top + stageCenters[idx] * scrollable;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const raw = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(1, raw));
      targetProgressRef.current = clamped;

      const stageIdx = clamped < 0.26 ? 0 : clamped < 0.56 ? 1 : clamped < 0.82 ? 2 : 3;
      setActiveStageIdx(stageIdx);
      setScrollPct(Math.round(clamped * 100));
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const meshes = buildBoxingGloveMeshes();

    // Floating holographic particles
    const particles = Array.from({ length: 42 }, (_, idx) => ({
      angle: (idx / 42) * Math.PI * 2,
      radius: 0.75 + (idx % 7) * 0.16,
      y: -1.4 + ((idx * 0.37) % 2.8),
      speed: 0.25 + (idx % 5) * 0.12,
      size: 1.2 + (idx % 3) * 0.9,
    }));

    let rafId = 0;
    let time = 0;
    let frameCount = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      rafId = window.requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      time += 0.016;
      frameCount++;

      // Smooth damped progress so scroll up & down feel ultra-fluid
      smoothProgressRef.current += (targetProgressRef.current - smoothProgressRef.current) * 0.1;
      const p = smoothProgressRef.current;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width <= 0 || height <= 0) return;

      ctx.clearRect(0, 0, width, height);

      // Determine current accent color with smooth RGB interpolation across stages
      const c0 = hexToRgb('#FF5500');
      const c1 = hexToRgb('#FF3B1F');
      const c2 = hexToRgb('#22C55E');
      const c3 = hexToRgb('#FF6B1A');

      let r = c0[0];
      let g = c0[1];
      let b = c0[2];
      if (p < 0.38) {
        const t = smoothstep(0.18, 0.38, p);
        r = lerp(c0[0], c1[0], t);
        g = lerp(c0[1], c1[1], t);
        b = lerp(c0[2], c1[2], t);
      } else if (p < 0.72) {
        const t = smoothstep(0.50, 0.68, p);
        r = lerp(c1[0], c2[0], t);
        g = lerp(c1[1], c2[1], t);
        b = lerp(c1[2], c2[2], t);
      } else {
        const t = smoothstep(0.76, 0.92, p);
        r = lerp(c2[0], c3[0], t);
        g = lerp(c2[1], c3[1], t);
        b = lerp(c2[2], c3[2], t);
      }

      const rgb = `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;

      // Center of the 3D hologram projection
      const cx = width * 0.5;
      const cy = height * 0.48;
      const scale = Math.min(width, height) * 0.30;

      // Full 540-degree dramatic scroll rotation (reverses seamlessly on scroll up!) + idle float + user drag
      const rotY = -0.45 + p * Math.PI * 3.0 + dragOffsetRef.current + pointerTiltRef.current.x * 0.35 + Math.sin(time * 0.7) * 0.08;
      const rotX = 0.22 + Math.sin(p * Math.PI * 2) * 0.22 + pointerTiltRef.current.y * 0.22;
      const rotZ = Math.sin(p * Math.PI * 3) * 0.14 - 0.12;
      const bobY = Math.sin(time * 1.9) * 0.055;

      if (frameCount % 6 === 0) {
        const deg = (((rotY * 180) / Math.PI) % 360 + 360) % 360;
        setDisplayAngle(Math.round(deg));
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const project = (v: Vec3) => {
        // Rotate Z
        const xz = v.x * cosZ - v.y * sinZ;
        const yz = v.x * sinZ + v.y * cosZ;
        const zz = v.z;
        // Rotate Y
        const xy = xz * cosY + zz * sinY;
        const zy = -xz * sinY + zz * cosY;
        const yy = yz;
        // Rotate X
        const yx = yy * cosX - zy * sinX;
        const zx = yy * sinX + zy * cosX;
        const xx = xy;

        const cameraDist = 4.2;
        const persp = cameraDist / (cameraDist - zx);
        return {
          sx: cx + xx * scale * persp,
          sy: cy - (yx + bobY) * scale * persp,
          z: zx,
          rawY: v.y,
        };
      };

      // 1. Volumetric Hologram Projector Light Cone from base
      const baseY = cy + scale * 1.38;
      const coneGrad = ctx.createLinearGradient(cx, baseY, cx, cy - scale * 1.25);
      coneGrad.addColorStop(0, `rgba(${rgb}, 0.22)`);
      coneGrad.addColorStop(0.55, `rgba(${rgb}, 0.06)`);
      coneGrad.addColorStop(1, `rgba(${rgb}, 0.0)`);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - scale * 0.58, baseY);
      ctx.lineTo(cx + scale * 0.58, baseY);
      ctx.lineTo(cx + scale * 1.25, cy - scale * 1.15);
      ctx.lineTo(cx - scale * 1.25, cy - scale * 1.15);
      ctx.closePath();
      ctx.fillStyle = coneGrad;
      ctx.fill();
      ctx.restore();

      // 2. Holographic Emitter Base Disc + Rotating HUD Rings
      ctx.save();
      for (let ringIdx = 0; ringIdx < 3; ringIdx++) {
        const rx = scale * (0.52 + ringIdx * 0.25);
        const ry = rx * 0.24;
        ctx.beginPath();
        ctx.ellipse(cx, baseY, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${0.55 - ringIdx * 0.16})`;
        ctx.lineWidth = ringIdx === 0 ? 1.8 : 1;
        if (ringIdx === 1) ctx.setLineDash([8, 6]);
        else ctx.setLineDash([]);
        ctx.stroke();
      }
      // Orbiting tick marks on emitter disc
      ctx.setLineDash([]);
      for (let t = 0; t < 12; t++) {
        const ang = (t / 12) * Math.PI * 2 + time * 0.6 + p * 4;
        const x1 = cx + Math.cos(ang) * scale * 0.72;
        const y1 = baseY + Math.sin(ang) * scale * 0.72 * 0.24;
        const x2 = cx + Math.cos(ang) * scale * 0.84;
        const y2 = baseY + Math.sin(ang) * scale * 0.84 * 0.24;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${rgb}, 0.65)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Orbiting 3D Telemetry Ring around the glove
      ctx.save();
      ctx.beginPath();
      const orbitSegs = 64;
      for (let k = 0; k <= orbitSegs; k++) {
        const a = (k / orbitSegs) * Math.PI * 2;
        const orbitR = 1.18;
        const ov: Vec3 = {
          x: Math.cos(a) * orbitR,
          y: -0.35 + Math.sin(a * 2 + time) * 0.06,
          z: Math.sin(a) * orbitR,
        };
        const pt = project(ov);
        if (k === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      }
      ctx.strokeStyle = `rgba(${rgb}, 0.28)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      // Laser scanner Y position sweeping from bottom to top
      const scanY = -1.3 + ((time * 0.65) % 2.6);

      // 4. Render 3D Glove Meshes (Translucent Holographic Facets + Crisp Depth-Cued Wireframe)
      for (const mesh of meshes) {
        const projected = mesh.vertices.map(project);

        // Sort quads back-to-front for volumetric hologram feel
        const sortedQuads = mesh.quads
          .map((q) => {
            const avgZ = (projected[q[0]].z + projected[q[1]].z + projected[q[2]].z + projected[q[3]].z) * 0.25;
            const avgRawY = (projected[q[0]].rawY + projected[q[1]].rawY + projected[q[2]].rawY + projected[q[3]].rawY) * 0.25;
            return { q, avgZ, avgRawY };
          })
          .sort((a, b) => a.avgZ - b.avgZ);

        for (const { q, avgZ, avgRawY } of sortedQuads) {
          const p0 = projected[q[0]];
          const p1 = projected[q[1]];
          const p2 = projected[q[2]];
          const p3 = projected[q[3]];

          const depthNorm = Math.max(0, Math.min(1, (avgZ + 1.1) / 2.2));
          const scanProximity = Math.exp(-Math.pow((avgRawY - scanY) / 0.16, 2));
          const isStrap = mesh.part === 'strap';
          const fillAlpha = (isStrap ? 0.13 : 0.06) + depthNorm * 0.08 + scanProximity * 0.18;

          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.closePath();
          ctx.fillStyle = `rgba(${rgb}, ${fillAlpha.toFixed(3)})`;
          ctx.fill();
        }

        // Wireframe contour edges
        for (const [iA, iB] of mesh.edges) {
          const a = projected[iA];
          const b = projected[iB];
          const avgZ = (a.z + b.z) * 0.5;
          const avgRawY = (a.rawY + b.rawY) * 0.5;
          const depthNorm = Math.max(0, Math.min(1, (avgZ + 1.1) / 2.2));
          const scanProximity = Math.exp(-Math.pow((avgRawY - scanY) / 0.14, 2));

          const baseAlpha = mesh.part === 'strap' ? 0.34 : 0.14;
          const alpha = Math.min(0.96, baseAlpha + depthNorm * 0.62 + scanProximity * 0.45);

          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle =
            scanProximity > 0.55
              ? `rgba(255, 255, 255, ${(0.55 + scanProximity * 0.4).toFixed(2)})`
              : `rgba(${rgb}, ${alpha.toFixed(2)})`;
          ctx.lineWidth = mesh.part === 'strap' ? 1.35 : 0.75 + depthNorm * 0.85;
          ctx.stroke();
        }

        // Highlight glowing vertices hit by the laser scan plane
        for (const pt of projected) {
          const dist = Math.abs(pt.rawY - scanY);
          if (dist < 0.075 && pt.z > -0.25) {
            ctx.beginPath();
            ctx.arc(pt.sx, pt.sy, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();
          }
        }
      }

      // 5. Rising Holographic Micro-Particles
      for (const pt of particles) {
        const py = -1.35 + ((pt.y + time * pt.speed + 1.35) % 2.75);
        const ang = pt.angle + time * 0.4 + p * 2.5;
        const proj = project({
          x: Math.cos(ang) * pt.radius,
          y: py,
          z: Math.sin(ang) * pt.radius,
        });
        const fade = Math.sin(((py + 1.35) / 2.75) * Math.PI);
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${(fade * 0.75).toFixed(2)})`;
        ctx.fill();
      }

      // 6. Subtle Hologram CRT Scanlines overlay inside canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      for (let sy = 0; sy < height; sy += 4) {
        ctx.fillRect(0, sy, width, 1);
      }
    };

    rafId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerTiltRef.current = { x: nx, y: ny };

    if (isDraggingRef.current) {
      const dx = e.clientX - lastDragXRef.current;
      dragOffsetRef.current += dx * 0.012;
      lastDragXRef.current = e.clientX;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastDragXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    pointerTiltRef.current = { x: 0, y: 0 };
  };

  const activeStage = STAGES[activeStageIdx];
  const ActiveIcon = activeStage.icon;
  // Horizontal offset (-1 = left, +1 = right) driven smoothly by scrollPct
  const horiz = getGloveHorizontalOffset(scrollPct / 100);
  // On lg+ desktop, glove shifts smoothly across left/right halves (-25% to +25% of container)
  const gloveTranslatePct = isDesktop ? horiz * 25 : 0;
  const isGloveRight = horiz >= 0;

  return (
    <section
      id="holograma"
      ref={sectionRef}
      className="relative border-b border-gridline lg:min-h-[340vh]"
    >
      {/* Sticky Viewport Stage */}
      <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col justify-between py-10 lg:py-8 overflow-hidden">
        {/* Top Scrollytelling Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 lg:mb-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sparring">
              Experiencia Interativa 3D | Role para girar a luva
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-0.5">
              Anatomia do Ecossistema SparRing
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {STAGES.map((st, idx) => {
              const active = idx === activeStageIdx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => jumpToStage(idx)}
                  className={`font-mono text-xs font-extrabold px-2.5 py-1.5 border transition ${
                    active
                      ? 'border-sparring bg-sparring text-white'
                      : 'border-neutral-700 bg-surface text-neutral-400 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {st.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Choreographed Stage */}
        <div className="relative flex-1 min-h-[540px] lg:min-h-0 flex flex-col lg:block border border-gridline bg-[#0d0d0d]/90 overflow-hidden">
          {/* Background Architectural Crosshair Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(255,85,0,0.16) 0%, transparent 62%)',
            }}
          />

          {/* 3D HOLOGRAPHIC GLOVE LAYER (Slides Right <-> Left smoothly on desktop!) */}
          <div
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            style={{
              transform: `translate3d(${gloveTranslatePct}%, 0, 0)`,
            }}
            className="relative lg:absolute lg:inset-0 z-10 h-[340px] sm:h-[400px] lg:h-full w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-transform duration-150 ease-out"
          >
            <div className="relative w-full lg:w-1/2 h-full flex items-center justify-center">
              <canvas ref={canvasRef} className="w-full h-full block" />

              {/* Floating Hologram HUD Telemetry Overlay */}
              <div className="pointer-events-none absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                <span className="border border-neutral-800 bg-carbon/85 px-2 py-1 text-sparring">
                  {activeStage.hudBadge}
                </span>
                <span className="border border-neutral-800 bg-carbon/85 px-2 py-1">
                  ROT-Y {String(displayAngle).padStart(3, '0')} DEG | {isGloveRight ? 'DIR' : 'ESQ'}
                </span>
              </div>

              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 border border-neutral-800 bg-carbon/90 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                Arraste para girar manualmente ou role a pagina
              </div>
            </div>
          </div>

          {/* EDITORIAL REVEAL PANEL (Automatically flips to the OPPOSITE side of the glove!) */}
          <div
            className={`relative lg:absolute lg:top-0 lg:bottom-0 lg:w-1/2 z-20 flex items-center p-6 sm:p-8 lg:p-10 transition-all duration-500 ease-out ${
              isGloveRight
                ? 'lg:left-0 lg:right-auto'
                : 'lg:left-1/2 lg:right-0'
            }`}
          >
            <div
              key={activeStage.id}
              className="w-full border border-gridline bg-surface/95 backdrop-blur-md p-6 sm:p-7 space-y-5 shadow-2xl animate-[fadeIn_0.35s_ease-out]"
              style={{ borderLeftWidth: '3px', borderLeftColor: activeStage.accentHex }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest"
                  style={{ color: activeStage.accentHex }}
                >
                  <ActiveIcon className="w-4 h-4" />
                  {activeStage.tag}
                </span>
                <span className="font-mono text-xs text-neutral-500">{activeStage.id} / 04</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {activeStage.title}
                <span style={{ color: activeStage.accentHex }}>{activeStage.accentWord}</span>.
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">{activeStage.description}</p>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {activeStage.metrics.map((m) => (
                  <div key={m.label} className="border border-gridline bg-carbon p-3">
                    <div
                      className="font-mono text-xs sm:text-sm font-black"
                      style={{ color: activeStage.accentHex }}
                    >
                      {m.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {activeStageIdx === 3 && (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('register', 'fighter')}
                    className="inline-flex items-center gap-2 bg-sparring hover:bg-[#ff6a1f] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition"
                  >
                    Comecar Agora <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('register', 'academy')}
                    className="border border-sparring text-sparring hover:bg-sparring/10 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition"
                  >
                    Portal Academia
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Scroll Progress Track */}
        <div className="mt-4 flex items-center gap-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 whitespace-nowrap">
            Progresso da Rotacao
          </div>
          <div className="flex-1 h-1.5 bg-surface border border-gridline overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{
                width: `${Math.max(4, scrollPct)}%`,
                backgroundColor: activeStage.accentHex,
              }}
            />
          </div>
          <div className="font-mono text-xs font-bold text-sparring w-10 text-right">{scrollPct}%</div>
        </div>
      </div>
    </section>
  );
};
