import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";

export default function Resources() {
  return (
    <>
      {/* Urgency Banner (keep if used globally) */}
      <div className="urgency-banner">
        Save CAD 200 - Early Bird ends in{" "}
        <span id="countdown-timer">Loading...</span>
      </div>

      <Navbar />

      {/* ================= HEADER ================= */}
      <div className="why-header">
  <div className="container">
    <h1>
      Catalyzing Canada's
      <span>Tech Future</span>
    </h1>

    <p>
      The country’s deal-making platform where innovators,
      buyers, investors, and policymakers meet to turn
      emerging tech into real partnerships, pilots, and
      contracts.
    </p>
  </div>
</div>

      {/* ================= CONTENT ================= */}
      <div className="container" style={{ paddingTop: "6rem" }}>
        {/* ===== ROW 1 ===== */}
        <div className="feature-row">
          <div className="feature-text">
            <h2>
              Meet the <span>Decision Makers</span>
            </h2>

            <p>
              Connect with enterprise decision-makers,
              high-growth startups, policymakers, and
              researchers. Get in the right room for
              announcements and procurement conversations.
            </p>

            <ul className="feature-list">
              <li>
                CIOs, CTOs, CDOs, and CISOs from enterprise
                and public sectors.
              </li>
              <li>
                VPs of Digital Transformation, Data &
                Analytics, and Cloud.
              </li>
              <li>
                Heads of Strategic Sourcing and Vendor
                Management.
              </li>
            </ul>

            <a href="/speakers" className="btn-primary">
              VIEW ATTENDEES
            </a>
          </div>

          <div className="feature-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
              alt="Networking Executives"
            />
          </div>
        </div>

        {/* ===== ROW 2 ===== */}
        <div className="feature-row reverse">
          <div className="feature-text">
            <h2>
              Learn From <span>The Best</span>
            </h2>

            <p>
              Master the future-critical focus areas driving
              Canada's economy. Every conversation maps to a
              real industry problem and a path to scale.
            </p>

            <ul className="feature-list">
              <li>
                Deep dives into Artificial Intelligence (AI)
                and Machine Learning.
              </li>
              <li>
                Readiness strategies for Quantum Computing &
                Security.
              </li>
              <li>
                Implementing Sustainability & Climate Tech.
              </li>
            </ul>

            <a href="/programme" className="btn-outline">
              EXPLORE PROGRAMME
            </a>
          </div>

          <div className="feature-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
              alt="Keynote Speaker"
            />
          </div>
        </div>

        {/* ===== ROW 3 ===== */}
        <div className="feature-row">
          <div className="feature-text">
            <h2>
              Discuss Topics & <span>Network</span>
            </h2>

            <p>
              Designed for outcomes. Experience high-signal
              networking across complementary stakeholders—
              industry, government, and academia.
            </p>

            <ul className="feature-list">
              <li>Dedicated Business Matching sessions.</li>
              <li>
                Exclusive CxO Breakfasts and VIP Policy
                Roundtables.
              </li>
              <li>
                Official closing Gala Dinner at The Carlu.
              </li>
            </ul>

            
          </div>

          <div className="feature-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&q=80"
              alt="Roundtable Networking"
            />
          </div>
          <a href="/tickets" className="btn-primary">
              SECURE YOUR PASS
            </a>
        </div>
      </div>

      <Footer />
    </>
  );
}
