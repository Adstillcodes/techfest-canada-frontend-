// src/pages/Speakers.jsx
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AttendeesCarousel from "../components/AttendeesCarousel";
import { ThreeDPhotoCarousel } from "../components/ui/3d-carousel";

// Import your Sanity utilities
import { client, urlFor } from "../utils/sanity";

export default function Speakers() {
  const [carouselImages, setCarouselImages] = useState([]); // This stores formatted objects

  useEffect(() => {
    // GROQ query: Get speakers where isFeatured is true
    const query = '*[_type == "speaker" && isFeatured == true]';
    
    client.fetch(query)
      .then((data) => {
        // Build an object for each speaker matching the SpeakerData type
        const formattedSpeakers = data
          .filter(speaker => speaker.image) // Ensure they uploaded an image
          .map(speaker => ({
            id: speaker._id,
            name: speaker.name || "Unknown Speaker", // Fallback text formatting
            role: speaker.role || "",
            company: speaker.company || "",
            // Provide exact URL parameters matching 3d component sizing parameters
            imgUrl: urlFor(speaker.image).width(250).height(250).quality(90).fit('crop').url()
          }));
        
        console.log("Formatted Data for Carousel:", formattedSpeakers);
        
        // Save the array of objects to state variable `carouselImages`
        setCarouselImages(formattedSpeakers);
      })
      .catch((error) => console.error("Error fetching carousel speakers:", error));
  }, []);

  return (
    <>
      <UrgencyBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* FEATURED SPEAKERS 3D CAROUSEL */}
        <div className="mb-20 overflow-hidden">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Speakers</h2>
          {/* Note: Prop is explicitly named "speakers" to match your TSX */}
          <ThreeDPhotoCarousel speakers={carouselImages} />
        </div>
        
        
      </div>

      <Footer />
    </>
  );
}