// 結果画面の紙吹雪
export function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.id = "confetti";
  document.body.appendChild(cv);
  const dpr = window.devicePixelRatio || 1;
  const W = (cv.width = window.innerWidth * dpr);
  const H = (cv.height = window.innerHeight * dpr);
  const ctx = cv.getContext("2d");
  const cols = ["#1CA7EC", "#FFC23D", "#22C39A", "#FF5C64", "#8D6BF0"];
  const ps = Array.from({ length: 140 }, () => ({
    x: Math.random() * W, y: -Math.random() * H * 0.5,
    vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
    s: (6 + Math.random() * 7) * dpr, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
    c: cols[Math.floor(Math.random() * cols.length)],
  }));
  const t0 = performance.now();
  const frame = (t) => {
    ctx.clearRect(0, 0, W, H);
    ps.forEach((p) => {
      p.x += p.vx; p.y += p.vy * dpr; p.vy += 0.04; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    });
    if (t - t0 < 3200) requestAnimationFrame(frame);
    else cv.remove();
  };
  requestAnimationFrame(frame);
}
