"use client";
import { useState, Children } from "react";

export default function ProductGallery({ images }) {
  const imageArray = Children.toArray(images);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="gallery-card">
      <h3>Product Visualization</h3>
      <div className="gallery">
        <div className="main-image">
          {imageArray[activeImage]}
        </div>
        <div className="thumbs">
          {imageArray.map((img, idx) => (
            <div
              key={idx}
              className={`thumb ${idx === activeImage ? "active" : ""}`}
              onClick={() => setActiveImage(idx)}
            >
              {img}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
