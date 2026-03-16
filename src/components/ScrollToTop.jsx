import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  var location = useLocation();
  useEffect(function () {
    // Scroll both window and any overflow containers
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);
  return null;
}
