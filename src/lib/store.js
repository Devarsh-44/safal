'use client';
/**
 * Data layer. Every function works in two modes:
 *  - LIVE: Supabase (when NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are set)
 *  - DEMO: browser localStorage, so the site is fully clickable with no backend.
 * Pages only import from here, so swapping modes never touches UI code.
 */
import { supabase, isLive } from './supabase';
import { seedNews } from './content';

export { isLive };

export const DEMO_ADMIN = { email: 'admin@safal.demo', password: 'safal2026' };

const LS = {
  get(k, fallback) {
    try { const v = localStorage.getItem('sv_' + k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(k, v) { try { localStorage.setItem('sv_' + k, JSON.stringify(v)); } catch {} },
};

const uid = () => (globalThis.crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2));
const now = () => new Date().toISOString();
export const makeRef = () => 'SV-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));

function demoList(table) { return LS.get(table, []); }
function demoInsert(table, row) {
  const rows = demoList(table);
  const full = { id: uid(), created_at: now(), ...row };
  LS.set(table, [full, ...rows]);
  return full;
}
function demoUpdate(table, id, patch) {
  const rows = demoList(table).map((r) => (r.id === id ? { ...r, ...patch } : r));
  LS.set(table, rows);
}
function demoDelete(table, id) { LS.set(table, demoList(table).filter((r) => r.id !== id)); }

async function insert(table, row) {
  if (!isLive) return demoInsert(table, row);
  // No .select(): anonymous visitors may insert but not read rows back (RLS).
  const { error } = await supabase.from(table).insert(row);
  if (error) throw error;
  return row;
}

/* ---------- Public forms ---------- */

export async function createEnquiry(enquiry) {
  const ref = makeRef();
  await insert('enquiries', { ref, status: 'New', ...enquiry });
  return { ref };
}

export async function createApplication(app) { return insert('applications', { status: 'New', ...app }); }

export async function createMessage(msg) { return insert('messages', { handled: false, ...msg }); }

/** Uploads a file to Supabase Storage (bucket must exist). In demo mode only the file name is kept. */
export async function uploadFile(bucket, file) {
  if (!file) return null;
  if (!isLive) return file.name;
  const path = `${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  return path;
}

/* ---------- News ---------- */

export async function listNews({ includeDrafts = false } = {}) {
  if (!isLive) {
    let rows = LS.get('news', null);
    if (!rows) { rows = seedNews.map((n) => ({ ...n, id: uid(), created_at: now() })); LS.set('news', rows); }
    return includeDrafts ? rows : rows.filter((r) => r.published);
  }
  let q = supabase.from('news').select('*').order('date', { ascending: false });
  if (!includeDrafts) q = q.eq('published', true);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function createNews(item) { return insert('news', item); }
export async function updateNews(id, patch) {
  if (!isLive) return demoUpdate('news', id, patch);
  const { error } = await supabase.from('news').update(patch).eq('id', id);
  if (error) throw error;
}
export async function deleteNews(id) {
  if (!isLive) return demoDelete('news', id);
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
}

/* ---------- Admin (staff only) ---------- */

export async function listTable(table) {
  if (!isLive) return demoList(table);
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateRow(table, id, patch) {
  if (!isLive) return demoUpdate(table, id, patch);
  const { error } = await supabase.from(table).update(patch).eq('id', id);
  if (error) throw error;
}

export async function signIn(email, password) {
  if (!isLive) {
    if (email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      LS.set('session', { email: DEMO_ADMIN.email });
      return { email: DEMO_ADMIN.email };
    }
    throw new Error('Wrong email or password.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  if (!isLive) return LS.set('session', null);
  await supabase.auth.signOut();
}

export async function getUser() {
  if (!isLive) return LS.get('session', null);
  const { data } = await supabase.auth.getUser();
  return data.user;
}
