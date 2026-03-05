'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Card({ title, image, href, children }) {
  let media = null

  if (React.isValidElement(image)) {
    media = image
  } else if (image && typeof image === 'object') {
    media = (
      <Image
        src={image}
        alt={title || 'card image'}
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={false}
      />
    )
  } else if (typeof image === 'string') {
    media = <img src={image} alt={title || 'card image'} loading="lazy" />
  }

  const CardContent = () => (
    <div className="custom-card">
      {media && <div className="custom-card-image">{media}</div>}
      <div className="custom-card-content">
        {title && <h3 className="custom-card-title">{title}</h3>}
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="custom-card-link">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}
