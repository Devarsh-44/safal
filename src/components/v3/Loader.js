'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { Ink } from './Marks';

const MIN = 1300; // ms: long enough for the page to draw itself, even on a fast connection
const MAX = 4000; // ms: never hold anyone back longer than this, however slow the images are
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * First-load screen: a notebook page draws itself (ruled lines, the red margin, the logo) while the
 * site loads; a pen line underneath fills as the HTML, fonts and images arrive; a teacher's tick
 * marks it done and the page lifts away. It is in the server HTML, so it covers the very first paint.
 * In-app page changes don't remount the layout, so they keep the graph-paper transition instead.
 */
export default function Loader() {
  const { t } = useLang();
  const [state, setState] = useState('in'); // in | done | out | gone
  const [p, setP] = useState(0.12);

  useEffect(() => {
    let alive = true;
    // Times count from when the page started loading (performance.now() is 0 then), not from when this
    // script woke up, so a slow start never adds extra waiting on top.
    const bump = (v) => alive && setP((x) => Math.max(x, v));
    bump(0.4);
    document.fonts?.ready.then(() => bump(0.7));
    const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));
    Promise.race([loaded, wait(Math.max(0, MAX - performance.now()))]).then(async () => {
      bump(1);
      await wait(Math.max(0, MIN - performance.now()));
      if (!alive) return;
      setState('done');
      await wait(450);
      if (!alive) return;
      setState('out');
      await wait(900);
      if (alive) setState('gone');
    });
    return () => { alive = false; };
  }, []);

  if (state === 'gone') return null;
  return (
    <div className={'ldr ldr-' + state} role="status" aria-live="polite" aria-label="Loading Safal Vidyalaya">
      <div className="ldr-page">
        <span className="ldr-rules" aria-hidden="true" />
        <span className="ldr-margin" aria-hidden="true" />
        <div className="ldr-center">
          <img className="ldr-logo" src="/images/live/logo.webp" alt="Safal Vidyalaya" width="300" height="94" />
          <svg className="ldr-pen" viewBox="0 0 240 24" preserveAspectRatio="none" aria-hidden="true">
            <path className="ldr-track" pathLength="1" d="M4 14 C 40 4, 70 22, 110 12 S 180 4, 236 12" />
            <path className="ldr-fill" pathLength="1" d="M4 14 C 40 4, 70 22, 110 12 S 180 4, 236 12" style={{ strokeDashoffset: 1 - p }} />
          </svg>
          <p className="ldr-tag">{t.v3.footer.tag}</p>
          <span className="ldr-tick" aria-hidden="true"><Ink kind="tick" color="var(--leaf)" width={4} play={state !== 'in'} /></span>
        </div>
      </div>
    </div>
  );
}
