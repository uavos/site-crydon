'use client'

import RequestModal from './RequestModal'
import { useState } from 'react'

export default function RequestButtonWrapper({
  label = 'Make a Request',
  className = ''
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className={`request-btn ${className}`} onClick={() => setOpen(true)}>
        {label}
      </button>

      <RequestModal open={open} setOpen={setOpen} />
    </>
  )
}
