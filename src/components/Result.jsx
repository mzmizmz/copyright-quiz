import { useEffect } from "react";
import { CATS } from "../data/categories";
import { EXAM, RESULT } from "../config";
import { mmss } from "../lib/utils";
import { confetti } from "../lib/confetti";
import Mascot from "./Mascot";

function MissedList({ list }) {
  return (
    <ul className="missed">
      {list.map((q) => (
        <li key={q.id}>
          <span className="ref">{q.ref}</span>
          <span className="mq">{q.q}</span>
          <span className="ma">正解：<b>{q.ch[q.a]}</b></span>
          <p className="me">{q.e}</p>
        </li>
      ))}
    </ul>
  );
}

// 結果画面
export default function Result({ r, onRetry, onHome }) {
  const celebrate = r.exam ? r.passed : r.pct >= 70;
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (celebrate) confetti();
  }, []);

  if (r.exam) {
    return (
      <div className="stack done">
        <Mascot mood={r.passed ? "wow" : "sad"} />
        <span className={`verdict ${r.passed ? "pass" : "fail"}`}>{r.passed ? "合格ライン突破" : "あと一歩"}</span>
        <h2>{r.score} / {r.n} 問正解</h2>
        <p>
          {r.timeUp ? RESULT.timeUp : ""}
          合格ラインは{r.n}問中{r.need}問（正答率{EXAM.pass}%）。
          {r.passed ? RESULT.examPass : RESULT.examFail(r.need - r.score)}
        </p>
        <div className="tiles">
          <div className={`tile ${r.passed ? "mint" : "coral"}`}><span>正答率</span><b>{r.pct}%</b></div>
          <div className="tile sun"><span>かかった時間</span><b>{mmss(r.used)}</b></div>
          <div className="tile sky"><span>獲得XP</span><b>{r.xp}</b></div>
        </div>

        <h3>分野別の結果</h3>
        <div className="tbl">
          <table className="break">
            <tbody>
              {Object.entries(CATS).map(([key, cat]) => {
                const a = r.answers.filter((x) => x.q.c === key);
                const good = a.filter((x) => x.ok).length;
                return (
                  <tr key={key}>
                    <td>{cat.name}</td>
                    <td className="num">{good} / {a.length}</td>
                    <td>
                      <span className={`meter c-${cat.col}`}><i style={{ width: `${a.length ? (good / a.length) * 100 : 0}%` }} /></span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="row" style={{ width: "100%" }}>
          {r.missed.length > 0 && <button className="btn coral" onClick={onRetry}>間違えた問題を解き直す</button>}
          <button className="btn plain" onClick={onHome}>ホームにもどる</button>
        </div>
        {r.missed.length > 0 && (
          <>
            <h3>間違えた問題（{r.missed.length}問）</h3>
            <MissedList list={r.missed} />
          </>
        )}
      </div>
    );
  }

  const text = r.pct === 100 ? RESULT.perfect : r.pct >= 70 ? RESULT.good : RESULT.low;
  return (
    <div className="stack done">
      <Mascot mood={r.pct >= 70 ? "wow" : "happy"} />
      <h2>{text.head}</h2>
      <p>{text.msg}</p>
      <div className="tiles">
        <div className="tile sun"><span>獲得XP</span><b>{r.xp}</b></div>
        <div className="tile mint"><span>正答率</span><b>{r.pct}%</b></div>
        <div className="tile coral"><span>最大コンボ</span><b>{r.maxCombo}</b></div>
      </div>
      <div className="row" style={{ width: "100%" }}>
        {r.missed.length > 0 && <button className="btn coral" onClick={onRetry}>間違えた{r.missed.length}問にリベンジ</button>}
        <button className={`btn${r.missed.length ? " plain" : ""}`} onClick={onHome}>ホームにもどる</button>
      </div>
      {r.missed.length > 0 && (
        <>
          <h3>間違えた問題</h3>
          <MissedList list={r.missed} />
        </>
      )}
    </div>
  );
}
