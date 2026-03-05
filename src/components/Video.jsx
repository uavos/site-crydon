import React from 'react'

export default function Video({ className = '', src, ...props }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={`video-bg ${className}`}
      src={src}
      {...props}
    />
  )
}
