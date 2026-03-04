import { useEffect, useRef, useState } from "react";

export default function AttendeesCarousel() {
  /* ================= FEATURED ATTENDEES ================= */
  const attendees = [
    { rank: 1, name: "Tobias Lütke", role: "CEO & Head of Production", company: "Shopify", img: "/attendees/person1.jpg" },
    { rank: 2, name: "Dave McKay", role: "President & CEO", company: "Royal Bank of Canada (RBC)", img: "/attendees/person2.jpg" },
    { rank: 3, name: "Victor Dodig", role: "President & CEO", company: "TELUS Corporation", img: "/attendees/person3.jpg" },
    { rank: 4, name: "Tracy Robinson", role: "President & CEO", company: "Canadian National Railway Co.", img: "/attendees/person4.jpg" },
    { rank: 5, name: "Darren Entwistle", role: "Retiring CEO", company: "TELUS Corporation", img: "/attendees/person5.jpg" },
    { rank: 6, name: "Jay S. Hennick", role: "Chairman & CEO", company: "Colliers International Group", img: "/attendees/person6.jpg" },
    { rank: 7, name: "Nicolas Marcoux", role: "CEO & Senior Partner", company: "PwC Canada", img: "/attendees/person7.jpg" },
    { rank: 8, name: "Gregory L. Ebel", role: "President & CEO", company: "Enbridge Inc.", img: "/attendees/person8.jpg" },
    { rank: 9, name: "Keith E. Creel", role: "President & CEO", company: "Canadian Pacific Kansas City Ltd", img: "/attendees/person9.jpg" },
    { rank: 10, name: "Mark J. Barrenechea", role: "Vice Chair, CEO", company: "OpenText Corp", img: "/attendees/person10.jpg" },
    { rank: 11, name: "Patrick Dovigi", role: "President & CEO", company: "GFL Environmental Inc.", img: "/attendees/person11.jpg" },
    { rank: 12, name: "Roy Gori", role: "President & CEO", company: "Manulife Financial Corporation", img: "/attendees/person12.jpg" },
    { rank: 13, name: "Kinsey Fabrizio", role: "President & CEO", company: "Consumer Technology Assoc. (CTA)", img: "/attendees/person13.jpg" },
    { rank: 14, name: "Joshua Kobza", role: "CEO", company: "Restaurant Brands International", img: "/attendees/person14.jpg" },
    { rank: 15, name: "Seetarama Kotagiri", role: "President & CEO", company: "Magna International Inc.", img: "/attendees/person15.jpg" },
    { rank: 16, name: "Harley Finkelstein", role: "President", company: "Shopify", img: "/attendees/person16.jpg" },
    { rank: 17, name: "Sarah Jenkins", role: "Chief Product Officer", company: "RBC Capital Markets", img: "/attendees/person17.jpg" },
    { rank: 18, name: "Jamie Torres", role: "Head of Engineering", company: "Google", img: "/attendees/person18.jpg" },
    { rank: 19, name: "David Chen", role: "VP of Global Infrastructure", company: "Shopify", img: "/attendees/person19.jpg" },
    { rank: 20, name: "Darcy Tuer", role: "CEO & Co-Founder", company: "ZayZoon", img: "/attendees/person20.jpg" },
  ];

  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf;

    const step = () => {
      if (!isPaused) {
        track.scrollLeft += 0.4;

        // seamless infinite loop
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  /* ================= ARROW CONTROL ================= */
  const scrollByAmount = (dir) => {
    const track = trackRef.current;
    if (!track) return;

    const amount = 260;

    track.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="attendees-section">
      <div className="container">
        <h2 className="attendees-title">
          Featured <span>Attendees</span>
        </h2>

        <div
          className="carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT ARROW */}
          <button
            className="carousel-arrow left"
            onClick={() => scrollByAmount("left")}
          >
            ‹
          </button>

          {/* TRACK */}
          <div className="attendees-carousel" ref={trackRef}>
            {[...attendees, ...attendees].map((person, index) => (
              <div key={index} className="attendee-card">
                <div className="rank-badge">#{person.rank}</div>

                <img src={person.img} alt={person.name} />

                <h4>{person.name}</h4>
                <p className="attendee-role">{person.role}</p>
                <p className="attendee-company">{person.company}</p>
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            className="carousel-arrow right"
            onClick={() => scrollByAmount("right")}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}