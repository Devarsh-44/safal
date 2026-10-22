'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { listNews } from '@/lib/store';
import { useLang } from '@/lib/i18n';

const tints = ['#EEF0FA', '#FFF1E7', '#F1F7EC', '#F4EEFA'];
const filters = [['all', 'all'], ['photo', 'photos'], ['video', 'videos']];
const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export default function NewsGrid({ limit, heading }) {
  const { t } = useLang();
  const [items, setItems] = useState(null);
  const [f, setF] = useState('all');
  const [open, setOpen] = useState(null);

  useEffect(() => { listNews().then(setItems).catch(() => setItems([])); }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  const shown = (items ?? []).filter((n) => f === 'all' || n.type === f).slice(0, limit ?? 99);

  return (
    <>
      <div className="section-head">
        {heading}
        <div style={{ display: 'flex', gap: 8 }} role="group" aria-label="Filter news">
          {filters.map(([k, label]) => <button key={k} className="chip" aria-pressed={f === k} onClick={() => setF(k)}>{t.news[label]}</button>)}
        </div>
      </div>
      {items === null ? (
        <div className="news-grid">{[0, 1, 2, 3].slice(0, limit ?? 4).map((k) => <div key={k} className="news-card" style={{ height: 320, background: 'var(--mist)' }} />)}</div>
      ) : shown.length === 0 ? (
        <p className="muted">{t.news.none}</p>
      ) : (
        <motion.div className="news-grid" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((n, k) => (
              <motion.button
                key={n.id} layout
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: k * 0.04 }}
                className="news-card lift" style={{ textAlign: 'left', padding: 0, cursor: 'pointer', font: 'inherit' }}
                onClick={() => setOpen(n)}
              >
                <div className="news-thumb" style={{ background: tints[k % 4] }}>
                  {n.image_url ? <img src={n.image_url} alt="" /> : <span className="news-oval" aria-hidden="true">{n.tag}</span>}
                  {n.type === 'video' && <span className="play"><Icon name="play" size={20} style={{ color: 'var(--saffron)' }} /></span>}
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <span className="news-meta">{n.tag} · {fmt(n.date)}</span>
                  <b style={{ display: 'block', fontSize: 19, lineHeight: 1.3, marginTop: 6 }}>{n.title}</b>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-modal="true" aria-label={open.title}
            style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(14,18,48,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}
          >
            <motion.article
              className="card" onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 640, width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.96 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              <div className="news-thumb" style={{ background: 'var(--mist)', aspectRatio: '16/9' }}>
                {open.image_url ? <img src={open.image_url} alt="" /> : <span className="news-oval" aria-hidden="true">{open.tag}</span>}
              </div>
              <div style={{ padding: 28 }}>
                <h3 className="display h3" style={{ margin: '4px 0 12px' }}>{open.title}</h3>
                <p className="news-meta" style={{ margin: '0 0 12px' }}>{open.tag} · {fmt(open.date)}</p>
                <p className="muted" style={{ margin: 0, whiteSpace: 'pre-line' }}>{open.body}</p>
                {open.video_url && <a className="btn btn-primary" style={{ marginTop: 20 }} href={open.video_url} target="_blank" rel="noopener noreferrer">{t.news.watch}</a>}
                <div><button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => setOpen(null)}>{t.news.close}</button></div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
