// 成績などを端末（localStorage）に保存する。保存できない環境でもアプリは動く
const PREFIX = "cqz3_";

export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* 保存できなくても続行 */
    }
  },
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

// 今日または昨日に学習していれば連続日数を返す
export function streakNow() {
  const s = store.get("streak", { n: 0, last: null });
  if (!s.last) return 0;
  const gap = (new Date(today()) - new Date(s.last)) / 864e5;
  return gap <= 1 ? s.n : 0;
}

// 1回学習を終えたら連続日数を更新する
export function bumpStreak() {
  const s = store.get("streak", { n: 0, last: null });
  const t = today();
  if (s.last === t) return;
  const gap = s.last ? (new Date(t) - new Date(s.last)) / 864e5 : 99;
  store.set("streak", { n: gap <= 1 ? s.n + 1 : 1, last: t });
}

// 間違えた問題を「苦手」に入れ、正解したら外す
export function recordWeak(id, ok) {
  const weak = new Set(store.get("weak", []));
  ok ? weak.delete(id) : weak.add(id);
  store.set("weak", [...weak]);
}
