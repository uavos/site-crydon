"use client";
import { useState } from "react";
import Modal from "./Modal";

function parseYouTube(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/watch")) id = u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/").pop();
    }
    const t = u.searchParams.get("t") || u.hash.replace("#t=", "");
    const toSec = (t) => {
      if (!t) return 0;
      if (/^\d+$/.test(t)) return parseInt(t, 10);
      const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i.exec(t);
      if (!m) return 0;
      const h = parseInt(m[1] || "0", 10);
      const mnt = parseInt(m[2] || "0", 10);
      const s = parseInt(m[3] || "0", 10);
      return h * 3600 + mnt * 60 + s;
    };
    return { id, start: toSec(t) };
  } catch {
    return { id: null, start: 0 };
  }
}

const renderers = {
  video: ({ href }) => {
    const { id, start } = parseYouTube(href);
    const src = id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&start=${start}`
      : href;
    return (
      <iframe
        title="YouTube video"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="modal-iframe"
      />
    );
  },

  iframe: ({ href }) => (
    <iframe
      title="Embedded content"
      src={href}
      allow="autoplay; fullscreen"
      className="modal-iframe"
    />
  ),

  image: ({ href, alt }) => (
    <img src={href} alt={alt || ""} className="modal-image" />
  ),

  gallery: ({ children }) => <div className="modal-gallery">{children}</div>,

  mdx: ({ children }) => (
    <div className="modal-mdx">
      {children}
    </div>
  ),
};

export default function ModalLink({
  href,
  type = "video",
  title,
  label,
  children,
  alt,
  ariaLabel,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const Renderer = renderers[type];

  if (!Renderer) {
    return (
      <a className="gallery-link" href={href} target="_blank" rel="noreferrer" {...rest}>
        {label || children || title || "Open"}
      </a>
    );
  }

  const triggerContent =
    label ||
    (type === "gallery"
      ? title || "Open gallery"
      : type === "mdx"
      ? title || "Open content"
      : children || title || "Open");

  return (
    <>
      <a className="gallery-link"
        href={href || "#"}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        {...rest}
      >
        {triggerContent}
      </a>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel={ariaLabel || title || "Dialog"}
        title={title}
        fit={type === "gallery" || type === "mdx" ? "content" : "media"}
      >
        <Renderer href={href} alt={alt}>{children}</Renderer>
      </Modal>
    </>
  );
}
