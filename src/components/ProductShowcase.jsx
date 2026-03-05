"use client";
import { useState, Children } from "react";
import ProductSpecs from "./ProductSpecs";
import ProductGallery from "./ProductGallery";

export default function ProductShowcase({ data }) {
  const modelKeys = Object.keys(data);
  const [selected, setSelected] = useState(modelKeys[0]);
  const current = data[selected];

  return (
    <div className="product-showcase">
      <div className="select-wrapper">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="select"
        >
          {modelKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="content-grid">
        <ProductSpecs
          title="Technical Specifications"
          table={current.table}
          price={current.price}
          downloadLinks={current.downloads}
        />
        <ProductGallery images={current.images} />
      </div>
    </div>
  );
}
