import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import { useEffect } from "react";
import AboutUs from "../components/AboutUs";

export default function Home() {
  // 🔥 Hero slideshow logic (React-safe)
  useEffect(() => {
    const slides = document.querySelectorAll("#hero-slideshow .slideshow-image");
    let index = 0;

    if (!slides.length) return;

    const interval = setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <UrgencyBanner />
      <Navbar />

      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-text">
          <h1>
            MEET.<br />
            <span>BUILD.</span> <br />
            SCALE. <br />
          </h1>

          <p>
            3 days of intensive masterclasses, live A320 simulations, and elite
            networking in Toronto, Vancouver, and Montreal.
          </p>

          <div className="hero-buttons">
            <a href="/tickets" className="btn-primary">
              Get Your Tickets ➡️
            </a>

            <a href="/on-demand" className="btn-outline">
              View Exhibitors
            </a>
          </div>
        </div>

        <div className="hero-visual" id="hero-slideshow">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80"
            className="slideshow-image active"
            alt="Event visual 1"
          />
          <img
            src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1000&q=80"
            className="slideshow-image"
            alt="Event visual 2"
          />
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80"
            className="slideshow-image"
            alt="Event visual 3"
          />
        </div>
      </div>

      {/* ABOUT SECTION */}
      <AboutUs />

        {/* TESTIMONIALS */}
        <h2 className="section-title">What Attendees Say</h2>

        <div className="grid-3">
          <div className="card">
            <p style={{ fontStyle: "italic", marginBottom: "1.5rem" }}>
              "The only conference where I've come back to the office and
              immediately changed how we work."
            </p>
            <h4 style={{ color: "var(--brand-orange)" }}>
              Jamie Torres, Google
            </h4>
          </div>

          <div
            className="card"
            style={{ borderColor: "var(--brand-purple)" }}
          >
            <p style={{ fontStyle: "italic", marginBottom: "1.5rem" }}>
              "The cloud architecture masterclass paid for the entire trip
              within a month. Unmatched ROI."
            </p>
            <h4 style={{ color: "var(--brand-orange)" }}>
              Alex Kim, Shopify
            </h4>
          </div>

          <div className="card">
            <p style={{ fontStyle: "italic", marginBottom: "1.5rem" }}>
              "We closed CAD 20,000 of new business networking here in the
              founder lounge. Essential event."
            </p>
            <h4 style={{ color: "var(--brand-orange)" }}>
              Priya Sharma, RBC
            </h4>
          </div>
        </div>
     

      <Footer />
    </>
  );
}