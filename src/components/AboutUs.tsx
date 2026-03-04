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
  HelpCircle
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

/**
 * Note: These imports might require 'npm install @sanity/client @sanity/image-url' 
 * in your local environment. 
 */
import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

// Sanity Client Configuration
// Replacing 'your_project_id' with your actual Sanity Project ID
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

/**
 * Icon Map: Maps Sanity strings to Lucide components
 */
const iconMap: Record<string, React.ReactNode> = {
  pen: <Pen className="w-5 h-5" />,
  paint: <PaintBucket className="w-5 h-5" />,
  home: <HomeIcon className="w-5 h-5" />,
  ruler: <Ruler className="w-5 h-5" />,
  tool: <PenTool className="w-5 h-5" />,
  building: <Building2 className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  check: <CheckCircle className="w-5 h-5" />
}

export default function AboutUs() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  // 1. Fetch data from Sanity on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "aboutContent"][0]`)
        if (result) {
          setData(result)
        } else {
          // Fallback content for the initial preview or if no document is found
          setData({
            headline: "Beyond Theory",
            services: [
              { title: "Architecture", description: "Designing scalable foundations for the next generation of tech leaders.", iconName: "pen", position: "left" },
              { title: "Ecosystems", description: "Connecting builders, practitioners, and investors in a high-velocity environment.", iconName: "home", position: "left" },
              { title: "Mastery", description: "Curated tracks focused on applied engineering rather than abstract theory.", iconName: "tool", position: "left" },
              { title: "Optimization", description: "Fine-tuning performance metrics to ensure zero-latency user experiences.", iconName: "paint", position: "right" },
              { title: "Planning", description: "Strategic roadmapping from MVP to international tech dominance.", iconName: "ruler", position: "right" },
              { title: "Scaling", description: "Transforming projects into national infrastructure through elite builds.", iconName: "building", position: "right" }
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
        // Ensure UI doesn't crash on network error
        setData({ headline: "Beyond Theory", services: [], stats: [] })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 2. Parallax Effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 12])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -12])

  // 3. Animation Variants
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

  // Loading state
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
        {/* Header Section */}
        <div className="flex flex-col items-center mb-20">
          <motion.span 
            variants={itemVariants}
            className="text-[var(--brand-orange)] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-[var(--brand-orange)]" />
            Our Vision
          </motion.span>
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
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          
          {/* Left Column (Services) */}
          <div className="space-y-14">
            {data.services
              ?.filter((s: any) => s.position === 'left')
              .map((service: any, i: number) => (
                <ServiceCard key={i} {...service} align="left" />
              ))}
          </div>

          {/* Center Visual (Sanity Image) */}
          <motion.div 
            variants={itemVariants}
            className="relative flex justify-center items-center py-6"
          >
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-main)] group">
              {data.mainImage ? (
                <img 
                  src={(urlFor(data.mainImage) as any).width(800).url()}
                  alt="Tech Collaboration"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out transform group-hover:scale-105"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000&auto=format&fit=crop" 
                  alt="Default Builders"
                  className="w-full h-full object-cover grayscale"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
              <div className="absolute bottom-10 left-0 w-full px-6 text-center z-20">
                <button className="bg-[var(--brand-white)] text-[var(--brand-black)] font-bold py-4 px-10 rounded-full hover:bg-[var(--brand-orange)] hover:text-[var(--brand-white)] transition-all transform hover:translate-y-[-5px] shadow-2xl text-[11px] tracking-[0.2em] uppercase font-['Orbitron'] border border-[var(--border-main)]">
                  <a href="./on-demand" >Our Portfolio</a>
                </button>
              </div>
            </div>
            
            {/* Decorative Parallax Frames */}
            <motion.div 
              className="absolute -inset-4 border-2 border-[var(--brand-purple)]/10 rounded-3xl z-[-1]"
              style={{ rotate: rotate1 }}
            />
            <motion.div 
              className="absolute -inset-10 border-2 border-[var(--brand-orange)]/10 rounded-[40px] z-[-2]"
              style={{ rotate: rotate2 }}
            />
          </motion.div>

          {/* Right Column (Services) */}
          <div className="space-y-14">
            {data.services
              ?.filter((s: any) => s.position === 'right')
              .map((service: any, i: number) => (
                <ServiceCard key={i} {...service} align="right" />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.stats?.map((stat: any, index: number) => (
            <StatBox key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Bottom CTA Block */}
        <motion.div
          className="mt-28 bg-[var(--bg-card)] border border-[var(--border-main)] p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm"
          variants={itemVariants}
        >
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black mb-4 font-['Orbitron'] tracking-tight text-[var(--text-main)] uppercase">READY TO SCALE?</h3>
            <p className="text-[var(--text-muted)] text-lg max-w-md">Join Canada's top innovators in Toronto, Vancouver, and Montreal.</p>
          </div>
          <button className="bg-[var(--brand-purple)] hover:bg-[var(--brand-orange)] text-[var(--brand-white)] px-12 py-5 rounded-2xl flex items-center gap-3 font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
            <a href="/tickets" className="flex items-center gap-3">
              Get Your Passes
              <ArrowRight className="w-5 h-5" />
            </a>
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
      <p className={`text-[var(--text-muted)] text-sm leading-relaxed max-w-sm ${align === 'right' ? 'lg:text-right' : ''}`}>
        {description}
      </p>
    </motion.div>
  )
}

function StatBox({ iconName, value, suffix, label, delay }: any) {
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
      className="bg-[var(--bg-card)] border border-[var(--border-main)] p-10 rounded-3xl flex flex-col items-center group hover:bg-[var(--bg-card)] hover:shadow-2xl hover:border-[var(--brand-orange)]/20 transition-all duration-500"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--brand-orange)]/5 flex items-center justify-center text-[var(--brand-orange)] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
        {iconMap[iconName] || <TrendingUp className="w-6 h-6" />}
      </div>
      <div className="text-4xl font-black font-['Orbitron'] mb-2 text-[var(--text-main)] tracking-tighter">
        {displayValue}{suffix}
      </div>
      <div className="text-[var(--text-muted)] text-[10px] uppercase tracking-[0.2em] font-black">
        {label}
      </div>
    </motion.div>
  )
}