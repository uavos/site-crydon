"use client";
import React from "react";

export default function DownloadLinks({ files }) {
  const basePath = "/site-uavos-publish";

  const isPreviewable = (name) => /\.(pdf)$/i.test(name);

  const getIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "zip":
      case "rar":
        return "🗜️";
      case "doc":
      case "docx":
        return "📘";
      default:
        return "📁";
    }
  };

  return (
    <div className="download-links">
      {files.map(({ name, path }) => {
        const fileUrl = `${basePath}${path.startsWith("/") ? path : "/" + path}`;
        const icon = getIcon(name);

        return (
          <p key={name}>
            <a
              href={fileUrl}
              target={isPreviewable(name) ? "_blank" : "_self"}
              rel="noopener noreferrer"
              download={!isPreviewable(name)}
            >
              {icon} {name}
            </a>
          </p>
        );
      })}
    </div>
  );
}
