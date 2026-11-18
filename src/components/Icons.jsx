// アプリ内で使うアイコン
export const Flame = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="var(--sun)" d="M12 2c1 3.5 5 5.6 5 11a5 5 0 0 1-10 0c0-2.6 1.4-4.3 2.6-5.6.2 1.9 1 3 2.1 3.6C11 8.6 11.2 5 12 2z" />
    <path fill="var(--coral)" d="M12 12.5c1.3 1.2 2.4 2.3 2.4 4a2.4 2.4 0 0 1-4.8 0c0-1.5 1-2.6 2.4-4z" />
  </svg>
);

export const Gem = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="var(--sky)" d="M6 3h12l4 6-10 12L2 9z" />
    <path fill="var(--on)" opacity=".45" d="M6 3h6l-4 6H2z" />
  </svg>
);

export const Close = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export const Cross = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true">
    <path d="M7 7l10 10M17 7L7 17" />
  </svg>
);

export const Clock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2M9.5 2.5h5" />
  </svg>
);

// 分野バッジのまわりの進み具合リング
export function Ring({ pct }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, (pct || 0) / 100));
  return (
    <svg viewBox="0 0 58 58" aria-hidden="true">
      <circle cx="29" cy="29" r={r} fill="none" stroke="var(--line)" strokeWidth="5" />
      <circle cx="29" cy="29" r={r} fill="none" stroke="var(--c)" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${c * v} ${c}`} />
    </svg>
  );
}
