import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal — scroll-driven scale/rotate/parallax container.
 * Inspired by dev21 ContainerScroll and AnimatedVideoOnScroll.
 *
 * Props:
 *   perspective: CSS perspective value (default "1200px")
 *   rotateFrom / rotateTo: rotateX start/end in degrees (default 12 → 0)
 *   scaleFrom / scaleTo: scale start/end (default 0.88 → 1)
 *   translateFrom / translateTo: translateY start/end in px (default 60 → 0)
 *   className, style: container
 */

export default function ScrollReveal({
  children,
  perspective = "1200px",
  rotateFrom = 12,
  rotateTo = 0,
  scaleFrom = 0.88,
  scaleTo = 1,
  translateFrom = 60,
  translateTo = 0,
  className,
  style,
}) {
  var containerRef = useRef(null);
  var [progress, setProgress] = useState(0);

  useEffect(function () {
    function onScroll() {
      var el = containerRef.current;
      if (!el) return;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress 0 → 1 as element scrolls from bottom of viewport to top
      var raw = 1 - (rect.top - vh * 0.1) / (vh * 0.9);
      setProgress(Math.max(0, Math.min(1, raw)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return function () { window.removeEventListener("scroll", onScroll); };
  }, []);

  var ease = function (t) {
    // cubic ease-out
    return 1 - Math.pow(1 - t, 3);
  };

  var p = ease(progress);
  var rot = rotateFrom + (rotateTo - rotateFrom) * p;
  var sc = scaleFrom + (scaleTo - scaleFrom) * p;
  var ty = translateFrom + (translateTo - translateFrom) * p;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        perspective: perspective,
        ...style,
      }}
    >
      <div
        style={{
          transform:
            "rotateX(" + rot + "deg) scale(" + sc + ") translateY(" + ty + "px)",
          transformOrigin: "center bottom",
          transition: "transform 0.08s linear",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
