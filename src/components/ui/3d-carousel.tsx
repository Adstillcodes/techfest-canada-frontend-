"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

// Define the shape of our Speaker Data
export type SpeakerData = {
  id: string;
  name: string;
  role: string;
  company: string;
  imgUrl: string;
}

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(
  ({
    controls,
    cards,
  }: {
    controls: any
    cards: SpeakerData[]
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800
    const faceCount = cards.length
    const faceWidth = faceCount > 0 ? cylinderWidth / faceCount : cylinderWidth
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="flex h-full items-center justify-center bg-transparent"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag="x" // Drag is now always enabled since we removed the zoom overlay
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {cards.map((speaker, i) => (
            <motion.div
              key={`key-${speaker.id}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl bg-transparent p-2"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${
                  i * (360 / faceCount)
                }deg) translateZ(${radius}px)`,
              }}
            >
              {/* Card Container */}
              <div className="relative w-[200px] sm:w-[220px] md:w-[250px] aspect-square rounded-xl overflow-hidden shadow-lg group pointer-events-none">
                <motion.img
                  src={speaker.imgUrl}
                  alt={speaker.name}
                  className="w-full h-full object-cover object-top"
                  initial={{ filter: "blur(4px)" }}
                  animate={{ filter: "blur(0px)" }}
                  transition={transition}
                />
                
                {/* Overlay Tag */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-4 px-4 text-center">
                  <h4 className="text-white font-bold text-sm md:text-base leading-tight font-['Orbitron'] tracking-wide">
                    {speaker.name}
                  </h4>
                  {(speaker.role || speaker.company) && (
                    <p className="text-[var(--brand-orange)] text-xs md:text-sm font-semibold mt-1">
                      {speaker.role}{speaker.role && speaker.company ? ', ' : ''}{speaker.company}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)

export function ThreeDPhotoCarousel({ speakers }: { speakers: SpeakerData[] }) {
  const controls = useAnimation()
  const cards = useMemo(() => speakers || [], [speakers])

  if (!cards || cards.length === 0) {
    return (
      <div className="h-[350px] md:h-[400px] w-full flex items-center justify-center text-[var(--text-muted)] font-semibold border border-[var(--border-main)] rounded-2xl bg-[var(--bg-card)]">
        Loading speakers...
      </div>
    )
  }

  return (
    <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden">
      <Carousel
        controls={controls}
        cards={cards}
      />
    </div>
  )
}