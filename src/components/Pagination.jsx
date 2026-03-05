'use client';

import React from 'react';
import Link from 'next/link';

export default function Pagination({ current, pages }) {
  const prev = pages.find((p) => p.page === current - 1);
  const next = pages.find((p) => p.page === current + 1);

  return (
    <nav aria-label="Pagination" className="pagination">
      {/* Prev */}
      {prev ? (
        <Link href={prev.href} className="pagination-prev">
          ← Prev
        </Link>
      ) : (
        <span className="pagination-prev is-disabled" aria-disabled="true">
          ← Prev
        </span>
      )}

      {/* Pages */}
      <ul className="pagination-list">
        {pages.map((p) => {
          const isActive = p.page === current;
          return (
            <li key={p.page} className="pagination-item">
              <Link
                href={p.href}
                aria-current={isActive ? 'page' : undefined}
                className={
                  'pagination-link' + (isActive ? ' is-active' : '')
                }
              >
                {p.page}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Next */}
      {next ? (
        <Link href={next.href} className="pagination-next">
          Next →
        </Link>
      ) : (
        <span className="pagination-next is-disabled" aria-disabled="true">
          Next →
        </span>
      )}
    </nav>
  );
}
