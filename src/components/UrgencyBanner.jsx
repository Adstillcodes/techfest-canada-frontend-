import { useEffect, useState } from "react";

export default function UrgencyBanner() {
  // 🔥 Set your real deadline here
  const DEADLINE = new Date("2026-10-01T00:00:00");

  const calculateTimeLeft = () => {
    const now = new Date();
    const diff = DEADLINE - now;

    if (diff <= 0) {
      return "Expired";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (diff / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
      (diff / 1000) % 60
    );

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // 🔥 Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="urgency-banner">
      Save CAD 200 - Early Bird ends in{" "}
      <span id="countdown-timer">{timeLeft}</span>
    </div>
  );
}
