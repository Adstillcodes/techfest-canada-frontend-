import { useState } from "react";

export default function AdminTabs({ tabs }) {
  const [active, setActive] = useState(0);
  const ActiveComponent = tabs[active].component;

  return (
    <div className="admin-tabs-wrapper">
      <div className="admin-tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={active === i ? "active" : ""}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-tab-content">
        <ActiveComponent />
      </div>
    </div>
  );
}