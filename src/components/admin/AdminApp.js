'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../Icons';
import { isLive, DEMO_ADMIN, signIn, signOut, getUser, listTable, updateRow, listNews, createNews, updateNews, deleteNews } from '@/lib/store';

const STATUSES = ['New', 'Called', 'Visit booked', 'Admitted', 'Closed'];
const statusClass = (s) => 's-' + (s || 'New').split(' ')[0];
const ago = (iso) => {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return 'just now'; if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60); if (h < 24) return h + ' h ago';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
const stdLabel = (e) => (e.standard ? (typeof e.standard === 'number' ? 'Std ' + e.standard : e.standard) + (e.stream ? ' · ' + e.stream : '') : '—');

function toCSV(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object' || rows[0][k] === null);
  const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined);
  useEffect(() => { getUser().then((u) => setUser(u ?? null)); }, []);
  if (user === undefined) return <div className="admin" />;
  if (!user) return <Login onIn={setUser} />;
  return <Dashboard user={user} onOut={async () => { await signOut(); setUser(null); }} />;
}

function Login({ onIn }) {
  const [email, setEmail] = useState(isLive ? '' : DEMO_ADMIN.email);
  const [password, setPassword] = useState(isLive ? '' : DEMO_ADMIN.password);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { onIn(await signIn(email, password)); } catch (e2) { setErr(e2.message || 'Could not sign in.'); } finally { setBusy(false); }
  }
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--ink)', padding: 16 }}>
      <motion.form onSubmit={submit} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420, padding: 32, display: 'grid', gap: 16 }}>
        <img src="/images/logo.png" alt="Safal Vidyalaya" style={{ height: 56, width: 'auto', justifySelf: 'start' }} />
        <h1 className="display h3" style={{ margin: 0 }}>Staff sign in</h1>
        {!isLive && <p className="demo-banner" style={{ margin: 0, borderRadius: 10, textAlign: 'left' }}>Demo mode — sign in with <b>{DEMO_ADMIN.email}</b> / <b>{DEMO_ADMIN.password}</b>. Data is saved in this browser only.</p>}
        <label className="field">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
        <label className="field">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {err && <p className="form-error" role="alert">{err}</p>}
        <button className="btn btn-dark btn-lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link href="/" style={{ fontSize: 15 }}>← Back to website</Link>
      </motion.form>
    </div>
  );
}

function Dashboard({ user, onOut }) {
  const [tab, setTab] = useState('enquiries');
  const [data, setData] = useState({ enquiries: [], messages: [], applications: [] });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [enquiries, messages, applications] = await Promise.all(['enquiries', 'messages', 'applications'].map((t) => listTable(t).catch(() => [])));
    setData({ enquiries, messages, applications });
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const newCount = data.enquiries.filter((e) => e.status === 'New').length;
  const tabs = [
    ['enquiries', 'Enquiries', newCount],
    ['messages', 'Messages', data.messages.filter((m) => !m.handled).length],
    ['applications', 'Job applications', data.applications.filter((a) => a.status === 'New').length],
    ['news', 'News & events', 0],
  ];

  return (
    <>
      {!isLive && <div className="demo-banner">Demo mode: data lives in this browser. Add Supabase keys to go live.</div>}
      <div className="admin">
        <aside className="admin-side">
          <b className="display" style={{ color: '#fff', fontSize: 20, padding: '4px 10px 20px', width: '100%' }}>Safal Admin</b>
          {tabs.map(([k, label, n]) => (
            <button key={k} aria-current={tab === k} onClick={() => setTab(k)}>
              {label}{n > 0 && <span style={{ background: 'var(--saffron)', color: '#fff', borderRadius: 999, padding: '0 8px', fontSize: 13 }}>{n}</span>}
            </button>
          ))}
          <div style={{ marginTop: 'auto', padding: 10, fontSize: 13, display: 'grid', gap: 8 }}>
            <span style={{ overflowWrap: 'anywhere' }}>{user.email}</span>
            <Link href="/" style={{ color: '#C9CEE6' }}>View website ↗</Link>
            <button onClick={onOut} style={{ padding: 0, display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-start' }}><Icon name="logout" size={16} />Sign out</button>
          </div>
        </aside>
        <div className="admin-main">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {tab === 'enquiries' && <Enquiries rows={data.enquiries} loading={loading} reload={load} />}
              {tab === 'messages' && <Messages rows={data.messages} reload={load} />}
              {tab === 'applications' && <Applications rows={data.applications} reload={load} />}
              {tab === 'news' && <NewsAdmin />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function Head({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div><h1 className="display" style={{ fontSize: 30 }}>{title}</h1>{sub && <span className="muted">{sub}</span>}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function download(name, rows) {
  const blob = new Blob([toCSV(rows)], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  URL.revokeObjectURL(a.href);
}

function Enquiries({ rows, loading, reload }) {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [selId, setSelId] = useState(null);
  const sel = rows.find((r) => r.id === selId);
  const shown = useMemo(() => rows.filter((r) => (filter === 'All' || r.status === filter) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))), [rows, filter, q]);
  const count = (s) => rows.filter((r) => r.status === s).length;

  async function move(status) { await updateRow('enquiries', sel.id, { status }); reload(); }

  return (
    <>
      <Head title="Admission enquiries" sub="Session 2026–27 · newest first">
        <button className="btn btn-ghost" onClick={() => download('enquiries.csv', rows)} disabled={!rows.length}>Export CSV</button>
        <button className="btn btn-ghost" onClick={reload}>Refresh</button>
      </Head>
      <div className="kpis">
        {[['New', count('New')], ['Called', count('Called')], ['Visits booked', count('Visit booked')], ['Admitted', count('Admitted')]].map(([l, v]) => (
          <div key={l} className="kpi"><span className="muted" style={{ fontSize: 14 }}>{l}</span><b>{v}</b></div>
        ))}
      </div>
      <div className="card" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
          {['All', ...STATUSES].map((s) => <button key={s} className="chip" style={{ minHeight: 36, padding: '4px 14px' }} aria-pressed={filter === s} onClick={() => setFilter(s)}>{s}</button>)}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" aria-label="Search enquiries" style={{ marginLeft: 'auto', padding: '8px 12px', border: '1.5px solid var(--line-2)', borderRadius: 10, minWidth: 200 }} />
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Student</th><th>Standard</th><th>Medium</th><th>Campus</th><th>Source</th><th>Received</th><th>Status</th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => setSelId(r.id)}>
                  <td><b>{r.student_name || r.parent_name}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{r.student_name ? r.parent_name + ' · ' : ''}{r.phone}</span></td>
                  <td>{stdLabel(r)}</td><td>{r.medium}</td><td>{r.campus}</td>
                  <td className="muted">{r.source === 'callback' ? 'Callback' : 'Online form'}</td>
                  <td className="muted">{ago(r.created_at)}</td>
                  <td><span className={'status ' + statusClass(r.status)}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !shown.length && <p className="muted" style={{ padding: 24, margin: 0 }}>{rows.length ? 'No enquiries match.' : 'No enquiries yet. Submit one from the website’s Admissions page or callback form — it appears here.'}</p>}
        </div>
      </div>

      <AnimatePresence>
        {sel && (
          <>
            <motion.div className="drawer-backdrop" style={{ zIndex: 69 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelId(null)} />
            <motion.aside className="panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }} aria-label="Enquiry details">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <span className="muted" style={{ fontSize: 13 }}>{sel.ref}</span>
                  <h2 className="display" style={{ fontSize: 24 }}>{sel.student_name || sel.parent_name}</h2>
                  <span className="muted">{stdLabel(sel)} · {sel.medium} · {sel.campus}</span>
                </div>
                <button className="burger" style={{ display: 'inline-flex' }} onClick={() => setSelId(null)} aria-label="Close"><Icon name="close" size={18} /></button>
              </div>
              <dl style={{ margin: '20px 0', display: 'grid', gap: 12 }}>
                {[['Parent', sel.parent_name + (sel.relation ? ` (${sel.relation})` : '')], ['Mobile', sel.phone], ['Email', sel.email], ['Date of birth', sel.dob], ['Received', new Date(sel.created_at).toLocaleString('en-IN')],
                  ['Documents', sel.docs && Object.keys(sel.docs).length ? Object.values(sel.docs).join(', ') : 'None yet']]
                  .filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="muted" style={{ fontSize: 13 }}>{k}</dt><dd style={{ margin: 0, fontWeight: 600, overflowWrap: 'anywhere' }}>{v}</dd></div>)}
              </dl>
              <p style={{ fontWeight: 700, margin: '0 0 8px' }}>Move to</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8 }}>
                {STATUSES.map((s) => <button key={s} className="choice" aria-pressed={sel.status === s} onClick={() => move(s)}>{s}</button>)}
              </div>
              <div style={{ display: 'grid', gap: 8, marginTop: 20 }}>
                <a className="btn btn-dark" href={`tel:${sel.phone}`}><Icon name="phone" />Call parent</a>
                <a className="btn btn-primary" style={{ background: 'var(--green)' }} target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/${String(sel.phone).replace(/\D/g, '').replace(/^(?!91)(\d{10})$/, '91$1')}?text=${encodeURIComponent(`Namaste ${sel.parent_name}, this is Safal Vidyalaya admissions regarding your enquiry${sel.ref ? ' ' + sel.ref : ''}.`)}`}>
                  <Icon name="whatsapp" />WhatsApp parent
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Messages({ rows, reload }) {
  return (
    <>
      <Head title="Contact messages"><button className="btn btn-ghost" onClick={() => download('messages.csv', rows)} disabled={!rows.length}>Export CSV</button></Head>
      <div style={{ display: 'grid', gap: 12 }}>
        {rows.map((m) => (
          <div key={m.id} className="card" style={{ padding: 20, borderRadius: 16, opacity: m.handled ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div><b>{m.name}</b> <span className="muted">· {m.phone}{m.email ? ' · ' + m.email : ''} · {ago(m.created_at)}</span></div>
              <button className="btn btn-ghost" style={{ minHeight: 36, padding: '4px 14px' }} onClick={async () => { await updateRow('messages', m.id, { handled: !m.handled }); reload(); }}>{m.handled ? 'Mark unread' : 'Mark handled'}</button>
            </div>
            <p style={{ margin: '10px 0 0', whiteSpace: 'pre-line' }}>{m.message}</p>
          </div>
        ))}
        {!rows.length && <p className="muted">No messages yet.</p>}
      </div>
    </>
  );
}

function Applications({ rows, reload }) {
  return (
    <>
      <Head title="Job applications"><button className="btn btn-ghost" onClick={() => download('applications.csv', rows)} disabled={!rows.length}>Export CSV</button></Head>
      <div className="card" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Name</th><th>Subject / role</th><th>Experience</th><th>Qualification</th><th>CV</th><th>Received</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td><b>{a.name}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{a.phone} · {a.email}</span></td>
                  <td>{a.subject}</td><td>{a.experience}</td><td>{a.qualification}</td>
                  <td className="muted" style={{ maxWidth: 160, overflowWrap: 'anywhere' }}>{a.resume_path}</td>
                  <td className="muted">{ago(a.created_at)}</td>
                  <td>
                    <select value={a.status} aria-label="Status" onChange={async (e) => { await updateRow('applications', a.id, { status: e.target.value }); reload(); }} style={{ padding: '6px 8px', borderRadius: 8, border: '1.5px solid var(--line-2)' }}>
                      {['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="muted" style={{ padding: 24, margin: 0 }}>No applications yet.</p>}
        </div>
      </div>
    </>
  );
}

const emptyNews = { title: '', tag: 'Announcement', type: 'photo', date: new Date().toISOString().slice(0, 10), image_url: '', video_url: '', body: '', published: true };

function NewsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => listNews({ includeDrafts: true }).then(setItems).catch(() => setItems([])), []);
  useEffect(() => { load(); }, [load]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function save(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    const { id, created_at, ...row } = form;
    try { if (id) await updateNews(id, row); else await createNews(row); setForm(null); await load(); } finally { setBusy(false); }
  }

  return (
    <>
      <Head title="News & events" sub="Posts appear on the homepage and the News page">
        <button className="btn btn-dark" onClick={() => setForm({ ...emptyNews })}><Icon name="plus" size={18} />New post</button>
      </Head>
      <AnimatePresence>
        {form && (
          <motion.form onSubmit={save} className="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', borderRadius: 16, marginBottom: 16 }}>
            <div style={{ padding: 20, display: 'grid', gap: 14 }}>
              <label className="field">Title<input value={form.title} onChange={set('title')} required /></label>
              <div className="grid-2">
                <label className="field">Tag<input value={form.tag} onChange={set('tag')} /></label>
                <label className="field">Type<select value={form.type} onChange={set('type')}><option value="photo">Photo / post</option><option value="video">Video</option></select></label>
                <label className="field">Date<input type="date" value={form.date} onChange={set('date')} /></label>
                <label className="field">Image URL<input value={form.image_url} onChange={set('image_url')} placeholder="https://…" /></label>
              </div>
              {form.type === 'video' && <label className="field">YouTube link<input value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/…" /></label>}
              <label className="field">Text<textarea value={form.body} onChange={set('body')} /></label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 600 }}><input type="checkbox" checked={form.published} onChange={set('published')} style={{ width: 18, height: 18 }} />Published</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" disabled={busy}>{form.id ? 'Save changes' : 'Publish post'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <div style={{ display: 'grid', gap: 10 }}>
        <AnimatePresence>
          {items.map((n) => (
            <motion.div key={n.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 40 }} className="card" style={{ padding: 16, borderRadius: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={'status ' + (n.published ? 's-Admitted' : 's-Closed')}>{n.published ? 'Live' : 'Draft'}</span>
              <span style={{ flex: '1 1 260px', minWidth: 0 }}><b>{n.title}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{n.tag} · {n.type} · {n.date}</span></span>
              <button className="btn btn-ghost" style={{ minHeight: 36, padding: '4px 12px' }} onClick={async () => { await updateNews(n.id, { published: !n.published }); load(); }}>{n.published ? 'Unpublish' : 'Publish'}</button>
              <button className="btn btn-ghost" style={{ minHeight: 36, padding: '4px 12px' }} onClick={() => setForm({ ...emptyNews, ...n })}>Edit</button>
              <button className="btn btn-ghost" style={{ minHeight: 36, padding: '4px 12px', color: '#B42318' }} aria-label={'Delete ' + n.title} onClick={async () => { await deleteNews(n.id); load(); }}><Icon name="trash" size={18} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
