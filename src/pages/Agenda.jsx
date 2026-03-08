import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";

export default function Agenda() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col">

      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" }}
        >

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-['Orbitron']"
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 900,
              letterSpacing: "6px",
              background:
                "linear-gradient(90deg, var(--brand-purple), var(--brand-orange))",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "20px",
            }}
          >
            COMING SOON
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            The full TechFest 2026 agenda is currently being finalized.  
            Expect world-class keynotes, infrastructure deep dives, and 
            cutting-edge discussions on the future of technology in Canada.
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: "40px" }}
          >
            <a href="/tickets" className="btn-primary">
              Get Your Pass
            </a>
          </motion.div>

        </motion.div>

      </div>

      <Footer />

    </div>
  );
}
