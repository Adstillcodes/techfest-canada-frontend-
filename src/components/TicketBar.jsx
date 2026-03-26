import { Link, useLocation } from "react-router-dom";

export default function TicketBar() {
  const location = useLocation();
  
  if (location.pathname === "/tickets") {
    return null;
  }

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
