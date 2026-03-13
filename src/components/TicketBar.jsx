import { Link } from "react-router-dom";

export default function TicketBar() {
  return (
    <div className="ticket-bar">
      <div className="ticket-bar-inner" style={{ width: "100%", display: "flex" }}>
        <Link 
          to="/tickets" 
          className="ticket-btn" 
          style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Get Your Pass →
        </Link>
      </div>
    </div>
  );
}
