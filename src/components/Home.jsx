import { CATS } from "../data/categories";
import { Q } from "../data/questions";
import { LIMIT, EXAM, MASCOT } from "../config";
import { store, streakNow } from "../lib/storage";
import Mascot from "./Mascot";
import { Flame, Gem, Clock, Ring } from "./Icons";

// ホーム画面
export default function Home({ onStart }) {
  const best = store.get("best", {});
  const weak = store.get("weak", []);
  const xp = store.get("xp", 0);
  const exam = store.get("exam", null);
  const streak = streakNow();
  const examTotal = EXAM.per * Object.keys(CATS).length;

  return (
    <div className="stack">
      <header className="top">
        <h1 className="logo">著作権<span>ドリル</span></h1>
        <div className="stats">
          <span className="stat" title="連続学習日数"><Flame />{streak}</span>
          <span className="stat" title="合計XP"><Gem />{xp}</span>
        </div>
      </header>

      <div className="hello">
        <Mascot />
        <div className="bubble">
          {MASCOT.greeting}
          <small>{(streak > 0 ? MASCOT.streak(streak) : MASCOT.firstTime) + MASCOT.howTo}</small>
        </div>
      </div>

      <button className="exam-card" onClick={() => onStart("exam")}>
        <span className="exam-badge"><Clock /></span>
        <span className="t">
          <b>模擬試験（ビジネス著作権検定 初級）</b>
          <small>全{examTotal}問・{EXAM.minutes}分・正答率{EXAM.pass}%以上で合格。解説は最後にまとめて表示</small>
        </span>
        <span className="pct">{exam ? `${exam.best}%` : "未受験"}</span>
      </button>

      <div className="row">
        <button className="btn" onClick={() => onStart("all")}>全分野ミックス{LIMIT}問</button>
        {weak.length > 0 && (
          <button className="btn coral" onClick={() => onStart("weak")}>苦手をふくしゅう（{weak.length}問）</button>
        )}
      </div>

      <h3 className="sec">分野別レッスン<small>全{Q.length}問</small></h3>
      <div className="cats">
        {Object.entries(CATS).map(([key, cat]) => {
          const count = Q.filter((q) => q.c === key).length;
          const b = best[key];
          return (
            <button key={key} className={`cat c-${cat.col}`} onClick={() => onStart(key)}>
              <span className="badge"><Ring pct={b} /><b>{cat.k}</b></span>
              <span className="t"><b>{cat.name}</b><small>{cat.desc}・{count}問</small></span>
              <span className="pct">{b != null ? `${b}%` : "NEW"}</span>
            </button>
          );
        })}
      </div>

      <p className="note">
        出題範囲はサーティファイ「ビジネス著作権検定 初級」の公開されている出題範囲を参考にしたオリジナル問題で、公式の問題ではありません。
        内容は2026年10月時点の日本の著作権法にもとづく学習用の要約です。細かな要件や例外を省略している箇所があります。
        「ビジネス著作権検定」は株式会社サーティファイの登録商標で、本アプリは同社とは関係のない非公式の学習アプリです。
        <br />
        <a className="plink" href="privacy.html">プライバシーポリシー</a>
      </p>
    </div>
  );
}
