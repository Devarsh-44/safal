const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

const paths = {
  book: <path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM8 7h7M8 11h5" />,
  flask: <path d="M10 3h4M11 3v6l-5 9a2 2 0 0 0 2 3h8a2 2 0 0 0 2-3l-5-9V3M8 15h8" />,
  board: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></>,
  bed: <><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10" r="1.6" /></>,
  bus: <><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M4 11h16M8 21v-4M16 21v-4" /></>,
  pulse: <path d="M3 12h4l2-4 4 8 2-4h6" />,
  food: <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10" />,
  people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 20a6 6 0 0 1 12 0M15 20a4 4 0 0 1 6 0" /></>,
  map: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  whatsapp: <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3zM9 9.5c.3 1.6 1.9 3.6 4 4.5l1.2-1.2 2 .8-.4 1.6c-3.3.5-7.6-3.6-7.4-7l1.6-.4.8 2z" />,
  check: <path d="M5 12l5 5L20 7" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  play: <path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export default function Icon({ name, size = 22, strokeWidth, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={strokeWidth ?? base.strokeWidth} {...rest}>
      {paths[name]}
    </svg>
  );
}
