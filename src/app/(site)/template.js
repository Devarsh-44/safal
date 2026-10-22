'use client';
import { useLayoutEffect, useState } from 'react';

/**
 * Page transition, after the Bloom reference: on a client-side page change a navy curtain with the
 * page's saffron oval covers the screen and lifts away (CSS animation in porthole.css). The very first
 * page load shows no curtain, and nothing is hidden if script never runs.
 */
export default function Template({ children }) {
  const [curtain, setCurtain] = useState(false);
  useLayoutEffect(() => {
    if (window.__svNavigated) setCurtain(true);
    window.__svNavigated = true;
  }, []);
  return (
    <>
      {curtain && <div className="curtain" aria-hidden="true" onAnimationEnd={(e) => e.target === e.currentTarget && setCurtain(false)}><i /></div>}
      {children}
    </>
  );
}
