import { QRCodeSVG } from "qrcode.react";

export default function WalletTicket({ user, ticket }) {
  return (
    <div className="wallet-ticket">
      <div className="wallet-header">
        OFFICIAL DELEGATE PASS
      </div>

      <h2 className="wallet-name">{user.name}</h2>

      <div className="wallet-tier">
        {ticket.type.toUpperCase()} PASS
      </div>

      <div className="wallet-venue">The Carlu | Toronto</div>

      <div className="wallet-footer">
        <span className="wallet-id">
          {ticket.ticketId}
        </span>

        <span className="wallet-status">CONFIRMED</span>
      </div>

      <div className="wallet-qr">
       <QRCodeSVG
  value={`TECHFEST:${ticket.ticketId}`}
  size={110}
/>
      </div>
    </div>
  );
}