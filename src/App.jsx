import { useState } from "react";
import { CATS } from "./data/categories";
import { Q } from "./data/questions";
import { LIMIT, EXAM } from "./config";
import { store, bumpStreak } from "./lib/storage";
import { shuffle } from "./lib/utils";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

// 選択肢の並びをシャッフルする（○×はそのまま）
const prep = (q) => ({ ...q, order: q.tf ? [0, 1] : shuffle(q.ch.map((_, i) => i)) });

// 画面の切り替え：home → quiz → result
export default function App() {
  const [screen, setScreen] = useState({ name: "home" });

  function start(cat) {
    const exam = cat === "exam";
    let qs;
    if (exam) {
      // 各分野から EXAM.per 問ずつ選んで混ぜる
      qs = shuffle(Object.keys(CATS).flatMap((k) => shuffle(Q.filter((q) => q.c === k)).slice(0, EXAM.per)));
    } else {
      let pool;
      if (cat === "all") pool = Q;
      else if (cat === "weak") {
        const weak = store.get("weak", []);
        pool = Q.filter((q) => weak.includes(q.id));
      } else if (cat === "retry") pool = screen.result.missed;
      else pool = Q.filter((q) => q.c === cat);
      qs = shuffle(pool).slice(0, LIMIT);
    }
    const prev = screen.result;
    const baseCat = cat === "retry" ? (prev.exam ? "all" : prev.cat) : cat;
    setScreen({
      name: "quiz",
      key: Date.now(),
      session: { cat: baseCat, exam, qs: qs.map(prep), startedAt: Date.now(), deadline: exam ? Date.now() + EXAM.minutes * 60000 : 0 },
    });
  }

  function finish(session, prog, timeUp) {
    const answers = [...prog.answers];
    // 時間切れのときは、未回答の問題を不正解として扱う
    if (timeUp) session.qs.slice(answers.length).forEach((q) => answers.push({ q, ok: false }));
    const n = session.qs.length;
    const pct = Math.round((prog.score / n) * 100);
    const r = {
      exam: session.exam, cat: session.cat, n, score: prog.score, pct, xp: prog.xp,
      maxCombo: prog.maxCombo, answers, missed: answers.filter((a) => !a.ok).map((a) => a.q), timeUp,
    };

    store.set("xp", store.get("xp", 0) + prog.xp);
    bumpStreak();
    if (session.exam) {
      r.need = Math.ceil((n * EXAM.pass) / 100);
      r.passed = (prog.score / n) * 100 >= EXAM.pass;
      r.used = Math.min(EXAM.minutes * 60, (Date.now() - session.startedAt) / 1000);
      const ex = store.get("exam", { best: 0, count: 0, passes: 0 });
      store.set("exam", { best: Math.max(ex.best, pct), count: ex.count + 1, passes: ex.passes + (r.passed ? 1 : 0) });
    } else if (session.cat in CATS) {
      const best = store.get("best", {});
      if (best[session.cat] == null || pct > best[session.cat]) store.set("best", { ...best, [session.cat]: pct });
    }
    setScreen({ name: "result", key: Date.now(), result: r });
  }

  const home = () => {
    setScreen({ name: "home" });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="wrap">
      <main>
        {screen.name === "home" && <Home onStart={start} />}
        {screen.name === "quiz" && (
          <Quiz
            key={screen.key}
            session={screen.session}
            onQuit={home}
            onFinish={(prog, timeUp) => finish(screen.session, prog, timeUp)}
          />
        )}
        {screen.name === "result" && (
          <Result key={screen.key} r={screen.result} onRetry={() => start("retry")} onHome={home} />
        )}
      </main>
    </div>
  );
}
