"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo, useMemo, useState, useRef, useEffect, type CSSProperties } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { useMounted } from "@/hooks/use-mounted"
import { useIdleActivation } from "@/hooks/use-idle-activation"
import { getLocalePrefix, resolveLocale } from "@/lib/i18n"

const orbitNodes = [
  { id: "intent", en: "Intent", th: "Intent", short: "I", positionClass: "left-1/2 top-[17%] sm:top-[16%]", accent: "#D4A853", target: "#overview" },
  { id: "verify", en: "Verify", th: "Verify", short: "V", positionClass: "left-[79%] top-1/2 sm:left-[84%]", accent: "#fd9b6b", target: "#fdia" },
  { id: "memory", en: "Memory", th: "Memory", short: "M", positionClass: "left-1/2 top-[78%] sm:top-[82%]", accent: "#89B4C8", target: "#core-pillars" },
  { id: "kernel", en: "Kernel", th: "Kernel", short: "K", positionClass: "left-[21%] top-1/2 sm:left-[16%]", accent: "#7B9E87", target: "#evidence" },
] as const

const microBadges = [
  { id: "algorithms", label: "41A", positionClass: "left-[11%] top-[24%] sm:left-[12%] sm:top-[20%]", accent: "#D4A853", lightAccent: "#7A5910", href: "/algorithms" },
  { id: "layers", label: "L10", positionClass: "right-[10%] top-[16%] sm:top-[14%]", accent: "#7B9E87", lightAccent: "#2E5E3A", href: "/architecture" },
  { id: "genomes", label: "G7", positionClass: "bottom-[24%] right-[10%] sm:bottom-[21%] sm:right-[12%]", accent: "#89B4C8", lightAccent: "#1E5572", href: "/genome" },
] as const

const metrics = [
  { en: "Algorithms", th: "Algorithms", value: "41", accent: "text-warm-amber" },
  { en: "Layers", th: "Layers", value: "10", accent: "text-warm-sage" },
  { en: "Genomes", th: "Genomes", value: "7", accent: "text-warm-sky" },
] as const

function HeroArchitectureVisual() {
  const { language } = useLanguage()
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"
  const enhancedVisualReady = useIdleActivation({ timeoutMs: 1500 })
  const isTH = language === "th"
  const locale = resolveLocale(pathname, language)
  const localePrefix = getLocalePrefix(locale)
  const defaultPointer = { x: 72, y: 24, rx: 0, ry: 0, sx: 0, sy: 0 }
  const [pointer, setPointer] = useState(defaultPointer)
  // rAF throttle refs: cap setPointer (re-render + useMemo + CSS custom props) to
  // one update per animation frame regardless of pointermove fire rate (60-120/s).
  const rafRef = useRef<number | null>(null)
  const pendingPointer = useRef<typeof defaultPointer | null>(null)
  const [activeTab, setActiveTab] = useState<"map" | "terminal">("map")
  const [bootState, setBootState] = useState<"off" | "booting" | "ready">("off")
  const [bootLines, setBootLines] = useState<string[]>([])
  const [D, setD] = useState<number>(75)
  const [I, setI] = useState<number>(3)
  const [A, setA] = useState<number>(90)

  const bootTimersRef = useRef<NodeJS.Timeout[]>([])

  const clearBootTimers = () => {
    bootTimersRef.current.forEach(clearTimeout)
    bootTimersRef.current = []
  }

  const startBooting = () => {
    clearBootTimers()
    setBootState("booting")
    setBootLines([])

    const lines = [
      isTH ? "> กำลังเตรียมจำลองระบบ RCT OS CLI... (v1.0.4b2)" : "> Initializing RCT OS CLI Simulator... (v1.0.4b2)",
      isTH ? "> ตรวจสอบความถูกต้องของระบบ: ผ่านการทดสอบ 1,297/1,297 รายการ [100% GREEN]" : "> Integrity check: 1,297/1,297 tests passed [100% GREEN]",
      isTH ? "> เชื่อมโยงโมดูลควบคุมหลัก: Intent, Verify, Memory, Kernel" : "> Binding core components: Intent, Verify, Memory, Kernel",
      isTH ? "> ประมวลผลและเปิดใช้งานชุดคำสั่งสมการ FDIA..." : "> Instantiating Constitutional FDIA Engine v2.0...",
      isTH ? "> สำเร็จ: สมการวิเคราะห์ระบบพร้อมรับข้อมูลแล้ว" : "> Success: Interactive CLI Console ready."
    ]

    lines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setBootLines((prev) => [...prev, line])
        if (index === lines.length - 1) {
          setBootState("ready")
        }
      }, (index + 1) * 300)
      bootTimersRef.current.push(timer)
    })
  }



  useEffect(() => {
    return () => {
      clearBootTimers()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const panelStyle = useMemo(
    () =>
      ({
        ["--hero-pointer-x" as string]: `${pointer.x}%`,
        ["--hero-pointer-y" as string]: `${pointer.y}%`,
        ["--hero-rotate-x" as string]: `${pointer.rx}deg`,
        ["--hero-rotate-y" as string]: `${pointer.ry}deg`,
        ["--hero-shift-x" as string]: `${pointer.sx}px`,
        ["--hero-shift-y" as string]: `${pointer.sy}px`,
      }) as CSSProperties,
    [pointer],
  )

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enhancedVisualReady || event.pointerType === "touch") return

    const bounds = event.currentTarget.getBoundingClientRect()
    const ratioX = (event.clientX - bounds.left) / bounds.width
    const ratioY = (event.clientY - bounds.top) / bounds.height
    const offsetX = ratioX - 0.5
    const offsetY = ratioY - 0.5

    // Store latest computed values; rAF will flush to React state at most once per frame
    pendingPointer.current = {
      x: ratioX * 100,
      y: ratioY * 100,
      rx: Number((-offsetY * 4.5).toFixed(2)),
      ry: Number((offsetX * 5.5).toFixed(2)),
      sx: Number((offsetX * 8).toFixed(2)),
      sy: Number((offsetY * 6).toFixed(2)),
    }

    if (rafRef.current !== null) return // already have a frame queued

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (pendingPointer.current !== null) {
        setPointer(pendingPointer.current)
        pendingPointer.current = null
      }
    })
  }

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    pendingPointer.current = null
    setPointer(defaultPointer)
  }

  return (
    <div className="mx-auto w-full max-w-105 sm:max-w-115 lg:ml-auto lg:max-w-121">
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={panelStyle}
        className="relative aspect-[1/1.04] overflow-hidden rounded-4xl border border-[#eadfce] bg-white/48 shadow-[0_20px_48px_rgba(84,61,31,0.12)] dark:border-border dark:bg-card/78 sm:aspect-5/4 sm:rounded-4xl sm:shadow-[0_24px_60px_rgba(84,61,31,0.12)] hero-architecture-panel cursor-default backdrop-blur-md"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-architecture-glow absolute inset-0" />
          <div className="absolute inset-0 hero-arch-gradient-overlay" />
          <div className="absolute inset-[7%] rounded-[26px] border border-white/70 dark:border-white/8 sm:inset-[8%] sm:rounded-[30px]" />
          <div className="absolute inset-x-[12%] top-[22%] h-px bg-[#eadfce] dark:bg-white/10 sm:inset-x-[14%] sm:top-[23%]" />
          {enhancedVisualReady ? <div className="absolute inset-x-[14%] bottom-[26%] h-px bg-[#eadfce] dark:bg-white/10 sm:inset-x-[16%] sm:bottom-[24%]" /> : null}
        </div>

        <div className="relative z-10 flex h-full flex-col p-3.5 sm:p-5">
          <div className="flex items-center justify-between gap-2.5 sm:gap-3 select-none">
            <div className="text-[9px] font-medium text-warm-gray dark:text-warm-subtle sm:text-[10px] uppercase tracking-wider">
              {activeTab === "map" ? (isTH ? "สัญญาณโครงสร้างระบบ" : "Architecture Signal") : (isTH ? "คอนโซลจำลองระบบ" : "System Console")}
            </div>
            <div className="flex items-center p-0.5 rounded-full border border-warm-amber/15 bg-warm-amber/4 dark:bg-black/25">
              <button
                type="button"
                onClick={() => setActiveTab("map")}
                className={`px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "map"
                    ? "bg-warm-amber text-white shadow-sm"
                    : "text-warm-gray hover:text-warm-amber dark:text-warm-subtle"
                }`}
              >
                {isTH ? "แผนที่" : "Map"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("terminal")
                  if (bootState === "off") {
                    startBooting()
                  }
                }}
                className={`px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "terminal"
                    ? "bg-warm-amber text-white shadow-sm"
                    : "text-warm-gray hover:text-warm-amber dark:text-warm-subtle"
                }`}
              >
                {isTH ? "เทอร์มินัล" : "Terminal"}
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            {activeTab === "map" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="hero-architecture-cluster relative h-[74%] w-[74%] max-h-72 max-w-72 sm:h-[78%] sm:w-[78%] sm:max-h-88 sm:max-w-88">
                  <div className="absolute inset-[11%] rounded-full border border-[#eadfce] dark:border-white/8 sm:inset-[12%]" />
                  {enhancedVisualReady ? <div className="absolute inset-[24%] rounded-full border border-[#eadfce] dark:border-white/8" /> : null}
                  {enhancedVisualReady ? <div className="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-[#eadfce] dark:bg-white/8 sm:top-[10%] sm:h-[80%]" /> : null}
                  <div className="absolute left-[12%] top-1/2 h-px w-[76%] -translate-y-1/2 bg-[#eadfce] dark:bg-white/8 sm:left-[10%] sm:w-[80%]" />

                  <div
                    className="hero-architecture-aura absolute inset-[31%] rounded-full"
                    style={{
                      background: isDark
                        ? "radial-gradient(circle, rgba(212,168,83,0.18), rgba(212,168,83,0.02) 62%, transparent 78%)"
                        : "radial-gradient(circle, rgba(212,168,83,0.24), rgba(212,168,83,0.04) 62%, transparent 78%)",
                    }}
                  />

                  <Link
                    href={`${localePrefix}/fdia`}
                    className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/80 bg-white/78 dark:border-warm-amber/25 dark:bg-[#161616]/88 sm:h-32 sm:w-32 hero-architecture-core z-20 overflow-hidden shadow-[0_0_34px_rgba(212,168,83,0.18)] backdrop-blur-md outline-none transition-colors hover:border-warm-amber/45"
                  >
                    <div className="hero-architecture-core__body flex h-full w-full flex-col items-center justify-center">
                      <div className="text-[9px] font-medium text-warm-gray dark:text-warm-subtle sm:text-[10px]">FDIA</div>
                      <div className="mt-1 font-mono text-[11px] font-bold leading-none sm:text-[13px]">
                        <span className="text-warm-amber">F</span>
                        <span className="text-warm-charcoal dark:text-warm-light-gray"> = </span>
                        <span className="text-warm-terracotta">D</span>
                        <sup className="text-[8px] text-warm-terracotta sm:text-[9px]">I</sup>
                        <span className="text-warm-charcoal dark:text-warm-light-gray"> × </span>
                        <span className="text-warm-sage">A</span>
                      </div>
                      <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-warm-amber sm:mt-2 sm:text-[9px] sm:tracking-[0.14em]">
                        {isTH ? "เปิดสมการ" : "Open Formula"}
                      </div>
                    </div>
                  </Link>

                  {(enhancedVisualReady ? orbitNodes : orbitNodes.slice(0, 2)).map((node, index) => (
                    <div
                      key={node.id}
                      className={`hero-architecture-node hero-architecture-node--${(index % 3) + 1} absolute -translate-x-1/2 -translate-y-1/2 ${node.positionClass}`}
                    >
                      <Link
                        href={`${localePrefix}#${node.target.replace(/^#/, "")}`}
                        className="hero-architecture-node__body flex flex-col items-center gap-1 outline-none sm:gap-1.5"
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold font-mono shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:scale-105 sm:h-11 sm:w-11 sm:text-[11px]"
                          style={{
                            color: node.accent,
                            borderColor: `${node.accent}33`,
                            backgroundColor: isDark ? `${node.accent}1A` : `${node.accent}16`,
                          }}
                        >
                          {node.short}
                        </div>
                        <span className="text-[9px] font-medium text-warm-charcoal dark:text-warm-pale/85 sm:text-[10px]">
                          {isTH ? node.th : node.en}
                        </span>
                      </Link>
                    </div>
                  ))}

                  {(enhancedVisualReady ? microBadges : microBadges.slice(0, 1)).map((badge, index) => (
                    <div
                      key={badge.id}
                      className={`hero-architecture-badge hero-architecture-badge--${(index % 3) + 1} absolute ${badge.positionClass}`}
                    >
                      <Link
                        href={`${localePrefix}${badge.href}`}
                        className="hero-architecture-badge__body block outline-none"
                      >
                        <div
                          className="rounded-full border px-2 py-1 min-h-6 flex items-center font-mono text-[9px] font-semibold shadow-[0_8px_18px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-2.5 sm:text-[10px]"
                          style={{
                            color: isDark ? badge.accent : badge.lightAccent,
                            borderColor: `${badge.accent}2F`,
                            backgroundColor: isDark ? "rgba(22,22,22,0.78)" : "rgba(255,255,255,0.76)",
                          }}
                        >
                          {badge.label}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col rounded-2xl border border-[#eadfce]/70 bg-zinc-950/92 dark:border-white/5 dark:bg-black/92 shadow-inner overflow-hidden font-mono text-left select-none text-[#33ff33] text-[9px] sm:text-[11px]">
                {/* macOS top control bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-3 py-1.5 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[8px] text-zinc-400 font-semibold sm:text-[9px]">
                    rct-cli-v1.0.4b2.sh
                  </div>
                  <button
                    type="button"
                    onClick={startBooting}
                    className="text-[8px] text-zinc-500 hover:text-zinc-300 font-bold transition-colors uppercase sm:text-[9px] cursor-pointer"
                  >
                    {isTH ? "รีบูต" : "Reboot"}
                  </button>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 flex flex-col p-3.5 overflow-y-auto space-y-2.5">
                  {bootState !== "ready" ? (
                    <div className="space-y-1">
                      {bootLines.map((line, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {line}
                        </div>
                      ))}
                      {bootState === "booting" && (
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#33ff33] animate-pulse" />
                          <span className="animate-blink">_</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between space-y-2 sm:space-y-3">
                      {/* Active Formula Card */}
                      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-2 sm:p-2.5 text-zinc-200">
                        <div className="text-warm-amber font-bold text-[9px] sm:text-[11px] uppercase tracking-wide">
                          {isTH ? "สมการวิเคราะห์ความลวงเชิงรัฐธรรมนูญ" : "Constitutional FDIA Equation"}
                        </div>
                        <div className="mt-1 flex items-center justify-between font-mono text-[9px] sm:text-[11px]">
                          <span className="text-zinc-400">F = D^I * A</span>
                          <span className="font-bold text-[#33ff33]">
                            F = {((D / 100) ** I * (A / 100)).toFixed(4)}
                          </span>
                        </div>
                        {/* Threat Gauge */}
                        <div className="mt-2 flex items-center gap-1.5 text-[8px] sm:text-[9px]">
                          <span className="text-zinc-500">{isTH ? "ระดับภัย:" : "Threat:"}</span>
                          <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden flex">
                            {Array.from({ length: 10 }).map((_, idx) => {
                              const threatScore = ((D / 100) ** I * (A / 100));
                              const fillCount = Math.ceil(threatScore * 10);
                              const isVetoed = A === 0;
                              let color = "bg-[#27c93f]"; // green
                              if (threatScore > 0.4) color = "bg-[#ffbd2e]"; // yellow
                              if (threatScore > 0.7) color = "bg-[#ff5f56]"; // red
                              if (isVetoed) color = "bg-[#ff5f56] animate-pulse";
                              const isFilled = idx < fillCount && !isVetoed;
                              return (
                                <div
                                  key={idx}
                                  className={`flex-1 border-r border-zinc-950/20 transition-all duration-300 ${
                                    isFilled ? color : "bg-transparent"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className={`font-bold ${
                            A === 0 ? "text-[#ff5f56] animate-pulse" :
                            ((D / 100) ** I * (A / 100)) > 0.7 ? "text-[#ff5f56]" :
                            ((D / 100) ** I * (A / 100)) > 0.4 ? "text-[#ffbd2e]" : "text-[#27c93f]"
                          }`}>
                            {A === 0 ? "VETOED" : `${Math.round(((D / 100) ** I * (A / 100)) * 100)}%`}
                          </span>
                        </div>
                      </div>

                      {/* Sliders Container */}
                      <div className="space-y-2 select-none text-zinc-300">
                        {/* Slider D */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                            <span>D: {isTH ? "ค่าความลวง (Deception)" : "Deception Index"}</span>
                            <span className="font-mono font-bold text-[#33ff33]">{(D / 100).toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={D}
                            onChange={(e) => setD(Number(e.target.value))}
                            className="w-full accent-warm-amber h-1 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Slider I */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                            <span>I: {isTH ? "ขอบเขตผลกระทบ (Impact)" : "Impact Scope"}</span>
                            <span className="font-mono font-bold text-[#33ff33]">{I}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={I}
                            onChange={(e) => setI(Number(e.target.value))}
                            className="w-full accent-warm-amber h-1 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Slider A */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                            <span>A: {isTH ? "ความสอดคล้อง (Alignment)" : "Alignment Index"}</span>
                            <span className="font-mono font-bold text-[#33ff33]">{(A / 100).toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={A}
                            onChange={(e) => setA(Number(e.target.value))}
                            className="w-full accent-warm-amber h-1 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Warning Indicator */}
                      <div className="h-6 flex items-center justify-center font-mono font-bold text-[8px] sm:text-[10px] bg-zinc-900/30 rounded border border-zinc-800/40">
                        {A === 0 ? (
                          <span className="text-[#ff5f56] animate-pulse flex items-center gap-1">
                            ⚠ {isTH ? "ตรวจพบการยับยั้งสถาปนิก! (Architect Veto)" : "Architect Veto Triggered! F = 0.00"}
                          </span>
                        ) : ((D / 100) ** I * (A / 100)) > 0.7 ? (
                          <span className="text-[#ff5f56] flex items-center gap-1 animate-pulse">
                            ⚡ {isTH ? "คำเตือน: ความขัดแย้งระบบสูงมาก!" : "CRITICAL: Friction is high!"}
                          </span>
                        ) : (
                          <span className="text-[#27c93f] flex items-center gap-1">
                            ✓ {isTH ? "ระบบทำงานอย่างปลอดภัย" : "System operates in stable state"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hero-architecture-metrics grid grid-cols-3 gap-1.5 rounded-[1.15rem] border border-white/70 bg-white/52 px-2.5 py-2 dark:border-white/8 dark:bg-black/16 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2.5">
            {metrics.map((metric, index) => (
              <div
                key={metric.en}
                className={`hero-architecture-metric hero-architecture-metric--${(index % 3) + 1} text-center`}
              >
                <div className={`text-[15px] font-bold font-mono sm:text-base ${metric.accent}`}>{metric.value}</div>
                <div className="text-[9px] text-warm-gray dark:text-warm-subtle sm:text-[10px]">{isTH ? metric.th : metric.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(HeroArchitectureVisual)