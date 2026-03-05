'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ArticleCard({
  title,
  date,
  author,
  description,
  href,
  image,
  children,
}) {
  return (
    <div className="article-card">
      <div className="article-image-wrapper">
        <Image
          src={image}
          alt={title}
          fill
          className="article-image"
        />
        
      </div>
      
      <div className="article-content">
        <Link href={href} className="article-title">
          {title}
        </Link>

        {description && <p className="article-desc">{description}</p>}

        {author && <p className="article-author">By {author}</p>}
        {children && (
          <div className="article-media">
            {children}
          </div>
        )}
        <div className="article-bottom">
          <Link href={href} className="article-link">
            Read more →
          </Link>
          
          <span className="article-date">{date}</span>
        </div>
      </div>
    </div>
  )
}
