"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Pen,
  PaintBucket,
  Home as HomeIcon,
  Ruler,
  PenTool,
  Building2,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  HelpCircle,
  Mail,
  Heart,
  Shield,
  Cpu,
  Atom,
  Lock,
  Settings,
  Leaf,
  Clock,
  Trophy,
  Target
} from "lucide-react"
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  useSpring, 
  Variants,
  useMotionValueEvent
} from "framer-motion"
import { InteractiveGlobe } from "./ui/interactive-globe";
import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

const client = createClient({
  projectId: "021qtoci", 
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-03",
})

const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  if (!source) return { url: () => "" }
  return builder.image(source)
}

const iconMap: Record<string, React.ReactNode> = {
  pen: <Pen className="w-5 h-5" />,
  paint: <PaintBucket className="w-5 h-5" />,
  home: <HomeIcon className="w-5 h-5" />,
  ruler: <Ruler className="w-5 h-5" />,
  tool: <PenTool className="w-5 h-5" />,
  building: <Building2 className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  users: <Users className="w-6 h-6" />,
  calendar: <Calendar className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  check: <CheckCircle className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  zap: <Zap className="w-6 h-6" />,
  cpu: <Cpu className="w-5 h-5" />,
  atom: <Atom className="w-5 h-5" />,
  lock: <Lock className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
  leaf: <Leaf className="w-5 h-5" />,
  clock: <Clock className="w-6 h-6" />,
  trophy: <Trophy className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />
}

// Accept onWriteToUs prop to open the inquiry modal from Home
export default function AboutUs({ onWriteToUs }: { onWriteToUs?: () => void }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "aboutContent"][0]`)
        const FIXED_SERVICES = [
          { title: "Healthcare & Lifesciences", description: "Connecting health innovators with buyers, policymakers, and capital to deploy at scale.", iconName: "heart", position: "left" },
          { title: "Banking, Financial Services & Insurance", description: "Where fintech meets enterprise — driving real procurement and partnerships.", iconName: "building", position: "left" },
          { title: "Supply Chain, Manufacturing & Infrastructure", description: "Bringing tech solutions to the backbone of Canada's industrial economy.", iconName: "tool", position: "left" },
          { title: "Defence & Public Safety", description: "Bridging the gap between cutting-edge tech and national security priorities.", iconName: "shield", position: "left" },
          { title: "Energy & Utilities", description: "Accelerating Canada's clean energy transition through applied innovation.", iconName: "zap", position: "left" },
          { title: "Artificial Intelligence", description: "Unlocking the Future of Innovation — from models to real-world deployment.", iconName: "cpu", position: "right" },
          { title: "Quantum Computing", description: "Unleashing Infinite Possibilities — Canada's quantum advantage on the world stage.", iconName: "atom", position: "right" },
          { title: "Cybersecurity", description: "Building resilient digital infrastructure for enterprise and government.", iconName: "lock", position: "right" },
          { title: "Robotics & Automation", description: "From factory floors to smart cities — automation that drives real ROI.", iconName: "settings", position: "right" },
          { title: "Sustainability & CleanTech", description: "Pioneering a Greener, Smarter Future through technology-led climate action.", iconName: "leaf", position: "right" },
        ]
        if (result) {
          setData({ ...result, services: FIXED_SERVICES })
        } else {
          setData({
            headline: "Beyond Theory",
            services: [
              { title: "Healthcare & Lifesciences", description: "Connecting health innovators with buyers, policymakers, and capital to deploy at scale.", iconName: "heart", position: "left" },
              { title: "Banking, Financial Services & Insurance", description: "Where fintech meets enterprise — driving real procurement and partnerships.", iconName: "building", position: "left" },
              { title: "Supply Chain, Manufacturing & Infrastructure", description: "Bringing tech solutions to the backbone of Canada's industrial economy.", iconName: "tool", position: "left" },
              { title: "Defence & Public Safety", description: "Bridging the gap between cutting-edge tech and national security priorities.", iconName: "shield", position: "left" },
              { title: "Energy & Utilities", description: "Accelerating Canada's clean energy transition through applied innovation.", iconName: "zap", position: "left" },
              { title: "Artificial Intelligence", description: "Unlocking the Future of Innovation — from models to real-world deployment.", iconName: "cpu", position: "right" },
              { title: "Quantum Computing", description: "Unleashing Infinite Possibilities — Canada's quantum advantage on the world stage.", iconName: "atom", position: "right" },
              { title: "Cybersecurity", description: "Building resilient digital infrastructure for enterprise and government.", iconName: "lock", position: "right" },
              { title: "Robotics & Automation", description: "From factory floors to smart cities — automation that drives real ROI.", iconName: "settings", position: "right" },
              { title: "Sustainability & CleanTech", description: "Pioneering a Greener, Smarter Future through technology-led climate action.", iconName: "leaf", position: "right" }
            ],
            stats: [
              { value: 150, suffix: "+", label: "Builds Completed", iconName: "award" },
              { value: 1200, suffix: "+", label: "Elite Delegates", iconName: "users" },
              { value: 12, suffix: "", label: "Event Years", iconName: "calendar" },
              { value: 98, suffix: "%", label: "Success Rate", iconName: "trending" }
            ]
          })
        }
      } catch (error) {
        console.error("Sanity About Content Fetch Error:", error)
        setData({ headline: "Beyond Theory", services: [], stats: [] })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 12])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -12])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  }

  if (loading) return (
    <div className="py-24 text-center bg-[var(--bg-main)] text-[var(--text-muted)] font-['Orbitron'] tracking-widest animate-pulse">
      INITIALIZING ECOSYSTEM...
    </div>
  )
  if (!data) return null

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full py-28 px-6 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500 overflow-hidden relative"
    >
      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-20">
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-7xl font-black text-center mb-8 font-['Orbitron'] tracking-tighter text-[var(--text-main)] leading-tight uppercase"
          >
            {data.headline}
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="w-24 h-2 bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-orange)] rounded-full shadow-sm"
          />
          <motion.p
            variants={itemVariants}
            className="text-center max-w-3xl mt-8 text-[var(--text-muted)] text-base leading-relaxed"
            style={{ textAlign: "justify", hyphens: "auto" as const }}
          >
            The Tech Festival Canada's <strong style={{ color: "var(--brand-orange)" }}>5 tech pillars</strong> aren't discussed in isolation. They're showcased through <strong style={{ color: "var(--brand-purple)" }}>5 applied sectors</strong> where the demand is urgent and budgets are real. Every session, showcase, and networking moment is designed to answer one question: <em style={{ color: "var(--text-main)", fontWeight: 600 }}>How does this technology get deployed, scaled, and procured in Canada, NOW?</em>
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          
          {/* Left Column — Tech Pillars */}
          <div className="space-y-4">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"12px" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"rgba(245,166,35,0.9)", boxShadow:"0 0 6px rgba(245,166,35,0.6)", display:"inline-block", flexShrink:0 }} />
              <span style={{ fontSize:"0.7rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(245,166,35,0.85)" }}>5 TECH PILLARS</span>
            </div>
            {data.services
              ?.filter((s: any) => s.position === 'right')
              .map((service: any, i: number) => (
                <ServiceCard key={i} {...service} align="left" />
              ))}
          </div>

          {/* Center Visual */}
          <motion.div 
            variants={itemVariants}
            className="relative flex justify-center items-center py-6"
          >
            <div className="relative w-full max-w-[340px] flex flex-col items-center gap-4">
              {/* Globe */}
              <div style={{ position: "relative", width: 320, height: 320 }}>
                {/* Spinning conic border */}
                <div style={{
                  position: "absolute", inset: -2, borderRadius: "50%",
                  background: "conic-gradient(from 0deg, rgba(122,63,209,0.5), rgba(245,166,35,0.4), rgba(122,63,209,0.5), rgba(245,166,35,0.4), rgba(122,63,209,0.5))",
                  animation: "aboutGlobeSpin 12s linear infinite",
                  opacity: 0.4,
                }} />
                <InteractiveGlobe size={320} isDarkMode={true} autoRotateSpeed={0.0012} />
                <style>{`@keyframes aboutGlobeSpin { to { transform: rotate(360deg); } }`}</style>
              </div>
            </div>
            <motion.div 
              className="absolute -inset-4 border-2 border-[var(--brand-purple)]/10 rounded-3xl z-[-1]"
              style={{ rotate: rotate1 }}
            />
            <motion.div 
              className="absolute -inset-10 border-2 border-[var(--brand-orange)]/10 rounded-[40px] z-[-2]"
              style={{ rotate: rotate2 }}
            />
          </motion.div>

          {/* Right Column — Applied Sectors */}
          <div className="space-y-4">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, marginBottom:"12px" }}>
              <span style={{ fontSize:"0.7rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(160,100,255,0.85)" }}>5 APPLIED SECTORS</span>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"rgba(160,100,255,0.9)", boxShadow:"0 0 6px rgba(160,100,255,0.6)", display:"inline-block", flexShrink:0 }} />
            </div>
            {data.services
              ?.filter((s: any) => s.position === 'left')
              .map((service: any, i: number) => (
                <ServiceCard key={i} {...service} align="right" />
              ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.stats?.map((stat: any, index: number) => (
            <StatBox key={index} {...stat} index={index} delay={index * 0.1} />
          ))}
        </div>

        {/* ── BOTTOM CTA — GET INVOLVED ── */}
        <motion.div
          className="mt-28 relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm"
          variants={itemVariants}
        >
          {/* Ambient glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(122,63,209,0.10), transparent)",
          }} />

          <div className="flex-1 text-center md:text-left relative z-10">
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(122,63,209,0.12)", border: "1px solid rgba(122,63,209,0.28)",
              borderRadius: 999, padding: "4px 14px", marginBottom: 14,
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.2px",
              textTransform: "uppercase", color: "#b99eff",
            }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"#f5a623", boxShadow:"0 0 5px #f5a623", display:"inline-block" }} />
              TFC 2026
            </div>

            <h3 className="text-3xl font-black mb-3 font-['Orbitron'] tracking-tight text-[var(--text-main)] uppercase">
              GET <span style={{ color: "#f5a623" }}>INVOLVED</span>
            </h3>

            {/* Three sub-tags */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "inherit" }}>
              {["Volunteer", "Collaborate", "Become a Community Partner"].map((tag) => (
                <span key={tag} style={{
                  background: "rgba(122,63,209,0.10)",
                  border: "1px solid rgba(122,63,209,0.22)",
                  borderRadius: 999, padding: "4px 14px",
                  fontSize: "0.78rem", fontWeight: 600,
                  color: "var(--text-muted)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Write to Us button — opens inquiry modal */}
          <button
            onClick={onWriteToUs}
            className="relative z-10 flex items-center gap-3 font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              color: "white",
              padding: "18px 40px",
              borderRadius: 18,
              border: "none",
              cursor: "pointer",
              fontSize: "0.92rem",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 800,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            <Mail size={18} />
            Write to Us
          </button>
        </motion.div>

      </motion.div>
    </section>
  )
}

function ServiceCard({ iconName, title, description, align }: any) {
  return (
    <motion.div 
      whileHover={{ x: align === 'left' ? 10 : -10 }}
      className={`flex flex-col ${align === 'right' ? 'lg:items-end lg:text-right' : ''} group`}
    >
      <div className={`flex items-center gap-5 mb-5 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl text-[var(--brand-orange)] group-hover:bg-[var(--brand-orange)] group-hover:text-[var(--brand-white)] transition-all duration-500 relative shadow-sm">
          {iconMap[iconName] || <HelpCircle className="w-5 h-5" />}
        </div>
        <h3 className="text-xl font-bold font-['Orbitron'] group-hover:text-[var(--brand-orange)] transition-colors text-[var(--text-main)]">
          {title}
        </h3>
      </div>

    </motion.div>
  )
}

/* ── Unique icons per stat index ── */
const statIcons = [
  <Users className="w-7 h-7" />,
  <Sparkles className="w-7 h-7" />,
  <Clock className="w-7 h-7" />,
  <Trophy className="w-7 h-7" />,
]

function StatBox({ iconName, value, suffix, label, delay, index }: any) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isVisible = useInView(ref, { once: true })
  const springValue = useSpring(0, { stiffness: 35, damping: 15 })

  useMotionValueEvent(springValue, "change", (latest) => {
    setDisplayValue(Math.floor(latest))
  })

  useEffect(() => {
    if (isVisible) springValue.set(value)
  }, [isVisible, value, springValue])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[var(--bg-card)] border border-[var(--border-main)] p-10 rounded-3xl flex flex-col items-center group hover:shadow-2xl hover:border-[var(--brand-orange)]/20 transition-all duration-500"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--brand-orange)]/5 flex items-center justify-center text-[var(--brand-orange)] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
        {statIcons[index] || iconMap[iconName] || <TrendingUp className="w-7 h-7" />}
      </div>
      <div className="text-4xl font-black font-['Orbitron'] mb-3 text-[var(--text-main)]" style={{ letterSpacing: "0.05em" }}>
        {displayValue}{suffix}
      </div>
      <div className="text-[var(--text-muted)] text-sm uppercase tracking-[0.15em] font-bold text-center leading-snug" style={{ maxWidth: 140 }}>
        {label?.replace(/-/g, " ")}
      </div>
    </motion.div>
  )
}
