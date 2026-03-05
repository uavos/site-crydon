'use client'

import ToggleBlock from "./ToggleBlock";
import DownloadLinks from "./DownloadLinks";

export default function ProductSpecs({ title, table, price, downloadLinks }) {
  return (
    <div className="specs-card">
      <h3>{title}</h3>
      <div className="table-block" dangerouslySetInnerHTML={{ __html: table }} />

      <div className="price">
        <strong>Price, USD:</strong>{" "}
        <span className="price-value">{price}</span> EXW
      </div>

      <ToggleBlock title="Download Manual & Docs">
        <DownloadLinks
          files={downloadLinks}
        />
      </ToggleBlock>
    </div>
  );
}
