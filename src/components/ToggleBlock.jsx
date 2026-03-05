"use client";
import { useState } from "react";

export default function ToggleBlock({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="toggle-block">
      <button className="toggle-header" onClick={() => setOpen(!open)}>
        <span className="toggle-title">{title}</span>
        <span className={`toggle-arrow ${open ? "open" : ""}`}>▼</span>
      </button>

      <div
        className={`toggle-content-wrapper ${open ? "open" : "closed"}`}
        aria-hidden={!open}
      >
        <div className="toggle-content">{children}</div>
      </div>
    </div>
  );
}
