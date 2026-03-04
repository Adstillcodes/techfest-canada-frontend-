import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";

export default function Details() {
  return (
    <>
      <UrgencyBanner />
      <Navbar />

      <div className="container">
        {/* HERO BANNER */}
        <img
          src="https://images.unsplash.com/photo-1492551557933-34265f7af79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Event Details Header"
          className="hero-banner"
          style={{ height: "35vh" }}
        />

        <h2>Multi-City Tour Schedule</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
          porttitor sem. Aliquam erat volutpat.
        </p>

        {/* CITY GRID */}
        <div className="grid">
          {/* TORONTO */}
          <div className="card glass">
            <img
              src="https://images.unsplash.com/photo-1513628253939-010e64ac66cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Toronto"
              className="card-img"
            />
            <div className="card-content">
              <h3>📍 Toronto, ON</h3>
              <p>
                <b>Date:</b> August 12 - 14
              </p>
              <p>
                Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas.
              </p>
            </div>
          </div>

          {/* VANCOUVER */}
          <div className="card glass">
            <img
              src="https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Vancouver"
              className="card-img"
            />
            <div className="card-content">
              <h3>📍 Vancouver, BC</h3>
              <p>
                <b>Date:</b> September 05 - 07
              </p>
              <p>
                Mauris placerat eleifend leo. Quisque sit amet est et sapien
                ullamcorper pharetra.
              </p>
            </div>
          </div>

          {/* MONTREAL */}
          <div className="card glass">
            <img
              src="https://images.unsplash.com/photo-1519114056088-b877fe073a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Montreal"
              className="card-img"
            />
            <div className="card-content">
              <h3>📍 Montreal, QC</h3>
              <p>
                <b>Date:</b> October 20 - 22
              </p>
              <p>
                Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent
                dapibus.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}