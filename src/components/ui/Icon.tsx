const paths = {
  arrow: <path d="M5 12h13.5M13 6.5 18.5 12 13 17.5" />,
  phone: (
    <path d="M7.4 3.6c.6-.2 1.3 0 1.6.6l1.5 3c.3.6.1 1.3-.4 1.7l-1.4 1c.9 2 2.4 3.6 4.4 4.5l1.1-1.4c.4-.5 1.1-.7 1.7-.4l3 1.5c.6.3.9 1 .7 1.6l-.6 2c-.3 1-1.2 1.6-2.2 1.5C9.4 19.9 4.1 14.6 3.6 7.2c-.1-1 .5-1.9 1.5-2.2l2.3-.7Z" />
  ),
  whatsapp: (
    <>
      <path d="M4.2 19.8 5.3 16A8.2 8.2 0 1 1 8 18.7l-3.8 1.1Z" />
      <path d="M9.3 8.6c.2-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .5-.2 1.2-.7 1.5-.6.4-1.4.6-2.6.2-1.9-.7-3.4-2-4.4-3.8-.6-1.1-.8-2-.6-2.8l.1-.2Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.6V12l3 2" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.2" r="7.6" />
      <path d="M12 9.6v3.8l2.4 1.4M9.6 2.8h4.8" />
    </>
  ),
  wave: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.7 7.7a6 6 0 0 0 0 8.6M16.3 7.7a6 6 0 0 1 0 8.6M5 5a9.8 9.8 0 0 0 0 14M19 5a9.8 9.8 0 0 1 0 14" />
    </>
  ),
  list: (
    <>
      <circle cx="5.5" cy="7" r="1.4" />
      <circle cx="5.5" cy="12" r="1.4" />
      <circle cx="5.5" cy="17" r="1.4" />
      <path d="M9.6 7h9M9.6 12h9M9.6 17h6" />
    </>
  ),
  check: <path d="m5.5 12.5 4 4 9-9.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  up: <path d="M12 19V5.5M6.5 11 12 5.5l5.5 5.5" />,
  spark: <path d="M12 3.5c.6 4.4 2.5 6.9 8 8.5-5.5 1.6-7.4 4.1-8 8.5-.6-4.4-2.5-6.9-8-8.5 5.5-1.6 7.4-4.1 8-8.5Z" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="3.5" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="3.5" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2.2a1.8 1.8 0 0 0 0 3.6V16a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2.2a1.8 1.8 0 0 0 0-3.6Z" />
      <path d="M14 6.5v11" strokeDasharray="1.6 2.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="4" />
      <path d="M8 3.5v4M16 3.5v4M4 10.5h16" />
      <circle cx="12" cy="15" r="1.4" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 8.5V7a2.5 2.5 0 0 0-2.5-2.5h-9A3.5 3.5 0 0 0 4 8v8.5A3.5 3.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V16" />
      <path d="M20 8.5h-4.5a3.75 3.75 0 0 0 0 7.5H20Z" />
      <circle cx="15.7" cy="12.25" r=".9" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.4" />
      <path d="M3.5 19.5c.6-3.1 2.8-5 5.5-5s4.9 1.9 5.5 5" />
      <circle cx="17" cy="9.5" r="2.6" />
      <path d="M15.8 14.6c2.3.1 4 1.7 4.6 4.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6.3v5.4c0 4.2 2.9 7.6 7 8.8 4.1-1.2 7-4.6 7-8.8V6.3Z" />
      <path d="m9.2 12 2 2 3.8-4" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5Z" />
      <path d="M10 20a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  menu: <path d="M5 8h14M5 12h9M5 16h14" />,
  hourglass: <path d="M7 4h10M7 20h10M8 4c0 4 8 4.5 8 8s-8 4-8 8M16 4c0 4-8 4.5-8 8s8 4 8 8" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
    </>
  ),
  door: (
    <>
      <path d="M14 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" />
      <path d="M11 12h9M16.5 8.5 20 12l-3.5 3.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5s1.1-6.1 3.5-8.5Z" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
