import React, { useState, useEffect } from "react";
import { useMotionValue, animate, motion } from "framer-motion";
import useMeasure from "react-use-measure";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import ProtectedRoute from "../components/ProtectedRoute";
/**
 * Note: If you have these components in your local project, 
 * you can keep the imports. For the preview to function correctly here, 
 * we are using placeholders for Navbar, Footer, and UrgencyBanner.
 */
<Navbar />;
<Footer />;
<UrgencyBanner />;


/**
 * Consolidated InfiniteSlider Component
 * This ensures the carousel works without external file dependencies.
 */
function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls;
    const size = direction === "horizontal" ? width : height;
    if (size === 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return controls?.stop;
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

const topSponsors = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "AWS", src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Shopify", src: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
  { name: "Stripe", src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Meta", src: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Nvidia", src: "https://svgl.app/library/nvidia-wordmark-light.svg" }
];

const gatedPartners = [
  "HubSpot", "Canva", "Apple", "Spotify", "Netflix", 
  "Airbnb", "Atlassian", "Figma", "Slack", "Discord", 
  "Notion", "Zoom", "Uber", "Lyft", "Pinterest"
];

export default function Sponsors() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <UrgencyBanner />
      <Navbar />

      <div className="container mx-auto px-6" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title text-4xl md:text-6xl font-['Orbitron'] font-black tracking-tighter mb-8"
        >
          2026 EXHIBITORS & SPONSORS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: "3rem",
            color: "var(--text-muted)",
            fontSize: "1.2rem",
            fontWeight: 500,
            maxWidth: "700px",
            margin: "0 auto 5rem"
          }}
        >
          Meet the global companies defining the future of digital infrastructure and applied engineering in Canada.
        </motion.p>

        {/* TOP SPONSORS CAROUSEL */}
        <div style={{ marginBottom: "8rem" }}>
          <InfiniteSlider gap={100} duration={30} reverse={false} durationOnHover={60}>
            {topSponsors.map((sponsor, idx) => (
              <div 
                key={idx} 
                className="sponsor-logo group" 
                style={{ 
                  flexShrink: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '0 30px',
                  transition: 'all 0.3s ease'
                }}
              >
                {sponsor.src ? (
                  <img
                    src={sponsor.src}
                    alt={sponsor.name}
                    className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ maxHeight: "45px", width: "auto" }}
                  />
                ) : (
                  <span className="font-['Orbitron'] font-bold text-xl uppercase tracking-widest">{sponsor.name}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
        </div>

        <h3
          className="font-['Orbitron'] font-bold uppercase tracking-widest"
          style={{
            color: "var(--brand-purple)",
            fontSize: "1.6rem",
            marginBottom: "3rem",
          }}
        >
          Over 90+ More Partners Inside
        </h3>

        {/* 🔒 GATED SECTION CAROUSEL */}
        <div className="gated-wrapper relative" style={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border-main)', background: 'var(--bg-card)' }}>
          {!unlocked && (
            <div 
              className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40 p-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[var(--bg-main)] p-8 rounded-2xl shadow-2xl border border-[var(--border-main)] max-w-md"
              >
                <h4 className="font-['Orbitron'] font-bold text-xl mb-4">ACCESS PARTNER DIRECTORY</h4>
                <p className="text-[var(--text-muted)] text-sm mb-6">Join our ecosystem to view the full list of attending practitioners and exhibitors.</p>
                
                <button
                  className="btn-primary w-full"
                  style={{ padding: "18px 32px", fontSize: "1rem" }}
                  onClick={() => {
                    if(!isLoggedIn()){
                      setAuthOpen(true);
                      return;
                    }
                    setUnlocked(true);
                  }}
                >
                  Unlock full list after signing up
                </button>
                
              </motion.div>
              <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            </div>
          )}

          <div
            className="gated-content"
            style={{
              filter: unlocked ? "none" : "blur(12px)",
              pointerEvents: unlocked ? "auto" : "none",
              padding: "5rem 0",
              transition: "filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {/* Secondary Row sliding in opposite direction */}
            <InfiniteSlider gap={60} duration={40} reverse={true}>
              {gatedPartners.map((partner, idx) => (
                <div 
                  key={idx} 
                  className="sponsor-logo"
                  style={{ 
                    padding: "20px 50px", 
                    fontSize: "1.3rem", 
                    fontWeight: 800,
                    color: "var(--text-main)",
                    backgroundColor: "var(--bg-main)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-main)",
                    fontFamily: "Orbitron",
                    letterSpacing: "2px"
                  }}
                >
                  {partner}
                </div>
              ))}
            </InfiniteSlider>
            
            <div className="mt-8">
              <InfiniteSlider gap={60} duration={50} reverse={false}>
                {["Slack", "Discord", "Notion", "Zoom", "Uber", "Lyft", "Pinterest", "HubSpot", "Canva", "Apple"].map((partner, idx) => (
                  <div 
                    key={idx} 
                    className="sponsor-logo"
                    style={{ 
                      padding: "20px 50px", 
                      fontSize: "1.3rem", 
                      fontWeight: 800,
                      color: "var(--text-main)",
                      backgroundColor: "var(--bg-main)",
                      borderRadius: "16px",
                      border: "1px solid var(--border-main)",
                      fontFamily: "Orbitron",
                      letterSpacing: "2px",
                      opacity: 0.6
                    }}
                  >
                    {partner}
                  </div>
                ))}
              </InfiniteSlider>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-[var(--text-muted)] mb-8">Interested in showcasing your infrastructure at Tech Fest 2026?</p>
          <button className="btn-outline">Download Sponsorship Prospectus</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
