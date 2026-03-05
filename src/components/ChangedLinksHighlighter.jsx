'use client'

import { useEffect, useRef, useState } from 'react'

function detectBasePath() {
  try {
    const d = globalThis.__NEXT_DATA__ || {}
    let p = d.assetPrefix || d.basePath || ''
    if (!p) {
      const s = Array.from(document.scripts).find(sc => sc.src && sc.src.includes('/_next/static/'))
      if (s) {
        const url = new URL(s.src, location.href)
        const pathname = url.pathname
        p = pathname.split('/_next/')[0] || ''
      }
    }
    if (p && !p.startsWith('/')) p = '/' + p
    if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1)
    return p || ''
  } catch {
    return ''
  }
}

function normalizePathname(pathname, { basePath = '' } = {}) {
  try {
    if (basePath && pathname.startsWith(basePath)) {
      pathname = pathname.slice(basePath.length) || '/'
    }
    pathname = pathname.replace(/\/index$/, '')
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1)
    return pathname || '/'
  } catch {
    return pathname || '/'
  }
}

/**
 * Props:
 * - routes: string[]                 (legacy; treated as modified)
 * - modifiedRoutes?: string[]        (yellow)
 * - addedRoutes?: string[]           (green)
 * - basePath?: string
 */
export default function ChangedLinksHighlighter({
  routes = [],
  modifiedRoutes = [],
  addedRoutes = [],
  basePath = ''
}) {
  const observerRef = useRef(null)

  useEffect(() => {
    const haveAny =
      (routes && routes.length) ||
      (modifiedRoutes && modifiedRoutes.length) ||
      (addedRoutes && addedRoutes.length)
    if (!haveAny) return

    const effectiveBase = basePath || detectBasePath()

    // legacy "routes" -> treat as modified
    const mod = new Set(
      (modifiedRoutes.length ? modifiedRoutes : routes).map(r => {
        const abs = r.startsWith('/') ? r : '/' + r
        return normalizePathname(abs, { basePath: effectiveBase })
      })
    )

    const add = new Set(
      addedRoutes.map(r => {
        const abs = r.startsWith('/') ? r : '/' + r
        return normalizePathname(abs, { basePath: effectiveBase })
      })
    )

    const markAll = (root) => {
      const anchors = root.querySelectorAll('a[href]')
      anchors.forEach(a => {
        let pathname = a.getAttribute('href') || ''
        try {
          const url = new URL(a.href)
          pathname = url.pathname
        } catch {
          pathname = pathname.startsWith('/') ? pathname : '/' + pathname
        }
        pathname = normalizePathname(pathname, { basePath: effectiveBase })

        // priority: added (green) over modified (yellow)
        if (add.has(pathname)) {
          a.setAttribute('data-changed', 'added')
          a.classList.add('nextra-changed-link')
        } else if (mod.has(pathname)) {
          a.setAttribute('data-changed', 'modified')
          a.classList.add('nextra-changed-link')
        }
      })
    }

    const run = () => markAll(document)
    run()
    const raf1 = requestAnimationFrame(run)
    const raf2 = requestAnimationFrame(run)
    const t = setTimeout(run, 300)

    observerRef.current = new MutationObserver(() => run())
    observerRef.current.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); clearTimeout(t)
      observerRef.current && observerRef.current.disconnect()
    }
  }, [routes, modifiedRoutes, addedRoutes, basePath])

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        /* modified -> yellow */
        a[data-changed="modified"], .nextra-changed-link[data-changed="modified"] {
          background: #fff59d;
        }
        a[data-changed="modified"]:hover, .nextra-changed-link[data-changed="modified"]:hover {
          background: #fff176;
        }

        /* added -> green */
        a[data-changed="added"], .nextra-changed-link[data-changed="added"] {
          background: #bbf7d0; /* green-200 */
        }
        a[data-changed="added"]:hover, .nextra-changed-link[data-changed="added"]:hover {
          background: #86efac; /* green-300 */
        }
      `,
      }}
    />
  )
}

/** ========= InlineAddedHighlighter ========= */
function escapeRegExp(s = '') {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
function goodChunk(s = '') {
  return s && s.trim().length >= 6
}

function replaceInTextNode(node, phrases, wrapperOpen, wrapperClose) {
  let text = node.nodeValue
  let changed = false

  for (const p of phrases) {
    if (!goodChunk(p)) continue
    const re = new RegExp(`(${escapeRegExp(p)})`, 'gi')
    if (re.test(text)) {
      text = text.replace(re, `${wrapperOpen}$1${wrapperClose}`)
      changed = true
    }
  }

  if (!changed) return false
  const span = document.createElement('span')
  span.innerHTML = text
  node.parentNode.replaceChild(span, node)
  return true
}

function walkAndDecorate(root, phrases, tag) {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'KBD', 'SAMP'])
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let n, count = 0
  while ((n = walker.nextNode())) {
    const el = n.parentElement
    if (!el) continue
    if (SKIP.has(el.tagName)) continue
    if (el.closest(`${tag}[data-inline-added], ${tag}[data-inline-removed]`)) continue
    if ((n.nodeValue || '').trim().length < 6) continue
    const ok = replaceInTextNode(
      n,
      phrases,
      tag === 'mark' ? '<mark data-inline-added>' : '<del data-inline-removed>',
      tag === 'mark' ? '</mark>' : '</del>'
    )
    if (ok) count++
  }
  return count
}

export function InlineAddedHighlighter({ snippets = [] }) {
  useEffect(() => {
    if (!snippets?.length) return

    const root = document.querySelector('main') || document.body
    const run = () => walkAndDecorate(root, snippets, 'mark')

    run()
    const t1 = setTimeout(run, 50)
    const t2 = setTimeout(run, 250)

    const mo = new MutationObserver(() => run())
    mo.observe(root, { childList: true, subtree: true })

    return () => { clearTimeout(t1); clearTimeout(t2); mo.disconnect() }
  }, [snippets])

  return null
}

/** ========= InlineRemovedHighlighter =========
 * Tries to strike-through any still-present occurrences of removed phrases.
 * Also renders a compact summary box with removed phrases at the end.
 */
export function InlineRemovedHighlighter({ snippets = [] }) {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!snippets?.length) return

    const root = document.querySelector('main') || document.body
    const run = () => {
      const hits = walkAndDecorate(root, snippets, 'del')
      // Even if no inline hits, we still show summary below
      if (!rendered) setRendered(true)
      return hits
    }

    run()
    const t1 = setTimeout(run, 60)
    const t2 = setTimeout(run, 280)

    const mo = new MutationObserver(() => run())
    mo.observe(root, { childList: true, subtree: true })

    return () => { clearTimeout(t1); clearTimeout(t2); mo.disconnect() }
  }, [snippets, rendered])

  if (!snippets?.length) return null

  // Summary box at the end of the article
  return (
    <div className="removed-summary">
      <b>Removed content</b>
      <ul>
        {snippets.map((s, i) => <li key={i}>— {s}</li>)}
      </ul>
    </div>
  )
}
