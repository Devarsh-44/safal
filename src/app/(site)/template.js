'use client';
import { useLayoutEffect, useState } from 'react';

/**
 * Page change: a black curtain carrying the school's name lifts away with a curved edge.
 * Client-side navigations only (the first load has the preloader); pure CSS, so nothing stays hidden
 * if script stops.
 */
export default function Template({ children }) {
  const [curtain, setCurtain] = useState(false);
  useLayoutEffect(() => {
    if (window.__svNavigated) setCurtain(true);
    window.__svNavigated = true;
  }, []);
  return (
    <>
      {curtain && <div className="curtain2" aria-hidden="true" onAnimationEnd={(e) => e.target === e.currentTarget && setCurtain(false)}><b>Safal</b></div>}
      {children}
    </>
  );
}
