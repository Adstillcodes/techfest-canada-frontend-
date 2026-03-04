import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <>
      <Navbar />

      <div
        className="container"
        style={{ maxWidth: "800px", padding: "5rem 5%" }}
      >
        <h1 className="section-title" style={{ textAlign: "left" }}>
          Privacy Policy
        </h1>

        {/* SECTION 1 */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--brand-orange)" }}>
            1. Information We Collect
          </h3>
          <p>
            When you register for The Tech Festival Canada, we collect personal
            information including your name, email address, job title, and
            company. If you opt-in to our marketing communications, this data is
            used to provide you with relevant event updates and sponsor offers.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--brand-orange)" }}>
            2. How We Use Cookies
          </h3>
          <p>
            Our website uses functional and analytical cookies to remember your
            theme preferences (Light/Dark mode) and track website analytics.
            When you accept cookies via our banner, a secure token is stored to
            remember your choice for 30 days.
          </p>
        </div>

        {/* SECTION 3 */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--brand-orange)" }}>
            3. Data Protection
          </h3>
          <p>
            We do not sell your personal data to third parties. If you have
            selected "Yes" to receive special offers, your contact information
            is shared securely only with our verified Platinum and Gold tier
            partners in accordance with our terms of service.
          </p>

          <br />

          <p>
            <strong>Contact Us:</strong> If you wish to have your data removed or
            modify your cookie preferences, please contact our support team at{" "}
            <a
              href="mailto:bspahwa@hotmail.co.uk"
              style={{
                color: "var(--brand-orange)",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              bspahwa@hotmail.co.uk
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}