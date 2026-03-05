import React from 'react'

export default function TextWrapper({
  as = 'h1',
  color = 'inherit',
  fontSize = 'inherit',
  fontFamily = 'inherit',
  className = '',
  children
}) {
  const Tag = as

  return (
    <Tag
      className={`text-wrapper ${className}`}
      style={{
        color,
        fontSize,
        fontFamily
      }}
    >
      {children}
    </Tag>
  )
}
