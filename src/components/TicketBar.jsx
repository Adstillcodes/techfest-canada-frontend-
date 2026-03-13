import { Link } from "react-router-dom";

export default function TicketBar() {
  return (
    <Link to="/tickets" className="ticket-bar">
      <div className="ticket-bar-inner">

        <span className="ticket-bar-text">
          🎟️ Early Bird Tickets Available
        </span>

        <span className="ticket-btn">
          Get Your Pass →
        </span>

      </div>
    </Link>
  );
}
