import { Link } from "react-router-dom";

export default function TicketBar() {
  return (
    <div className="ticket-bar">
      <div className="ticket-bar-inner">
        
        <div className="ticket-bar-text">
          🎟️ Early Bird Tickets Available
        </div>

        <Link to="/tickets" className="ticket-bar-btn">
          Get Your Pass →
        </Link>

      </div>
    </div>
  );
}
