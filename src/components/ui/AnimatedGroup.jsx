import { useEffect, useRef, useState, Children } from "react";

/**
 * AnimatedGroup — reveals children with staggered entrance animations.
 * Uses IntersectionObserver for scroll-triggered reveals.
 *
 * Props:
 *   preset: "fade" | "slide" | "blur" | "scale" | "blur-slide" (default "blur-slide")
 *   stagger: ms between each child (default 120)
 *   delay: initial delay in ms (default 0)
 *   threshold: IntersectionObserver threshold (default 0.15)
 *   once: only animate once (default true)
 *   className, style: container
 */
export default function AnimatedGroup({
  children,
  preset = "blur-slide",
  stagger = 120,
  delay = 0,
  threshold = 0.15,
  once = true,
  className,
  style,
}) {
  var ref = useRef(null);
  var [visible, setVisible] = useState(false);

  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: threshold }
    );
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, [threshold, once]);

  var presets = {
    fade:       { from: { opacity: 0 },                                           to: { opacity: 1 } },
    slide:      { from: { opacity: 0, transform: "translateY(24px)" },             to: { opacity: 1, transform: "translateY(0)" } },
    scale:      { from: { opacity: 0, transform: "scale(0.85)" },                  to: { opacity: 1, transform: "scale(1)" } },
    blur:       { from: { opacity: 0, filter: "blur(12px)" },                      to: { opacity: 1, filter: "blur(0)" } },
    "blur-slide": { from: { opacity: 0, filter: "blur(10px)", transform: "translateY(22px)" }, to: { opacity: 1, filter: "blur(0)", transform: "translateY(0)" } },
  };

  var p = presets[preset] || presets["blur-slide"];

  return (
    <div ref={ref} className={className} style={style}>
      {Children.map(children, function (child, i) {
        var base = visible ? p.to : p.from;
        return (
          <div
            key={i}
            style={{
              ...base,
              transition:
                "opacity 0.7s cubic-bezier(.16,1,.3,1) " + (delay + i * stagger) + "ms, " +
                "transform 0.7s cubic-bezier(.16,1,.3,1) " + (delay + i * stagger) + "ms, " +
                "filter 0.7s cubic-bezier(.16,1,.3,1) " + (delay + i * stagger) + "ms",
              willChange: "opacity, transform, filter",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
