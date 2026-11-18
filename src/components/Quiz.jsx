import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CATS } from "../data/categories";
import { XP_PER, MASCOT } from "../config";
import { recordWeak } from "../lib/storage";
import { mmss, pickOne } from "../lib/utils";
import { Close, Flame, Clock, Check, Cross } from "./Icons";

// 問題を解く画面（分野別レッスンと模擬試験の両方）
export default function Quiz({ session, onQuit, onFinish }) {
  const { qs, exam, deadline } = session;
  const n = qs.length;

  const [i, setI] = useState(0); // 何問目か
  const [sel, setSel] = useState(null); // 選んだ選択肢
  const [checked, setChecked] = useState(false); // チェック済みか
  const [prog, setProg] = useState({ score: 0, combo: 0, maxCombo: 0, xp: 0, answers: [] });
  const [title, setTitle] = useState("");
  const [now, setNow] = useState(Date.now());
  const [pad, setPad] = useState(0);
  const dockRef = useRef(null);
  const nextRef = useRef(null);
  const finished = useRef(false);

  const q = qs[i];
  const col = CATS[q.c].col;
  const last = i === n - 1;
  const ok = checked && prog.answers[prog.answers.length - 1]?.ok;
  const left = exam ? (deadline - now) / 1000 : 0;

  const finish = (p, timeUp = false) => {
    if (finished.current) return;
    finished.current = true;
    onFinish(p, timeUp);
  };

  // 模擬試験のタイマー
  useEffect(() => {
    if (!exam) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [exam]);
  useEffect(() => {
    if (exam && left <= 0) finish(prog, true);
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [i]);
  // 下のバー（チェックボタン・解説）に隠れないよう、高さぶんの余白をとる
  useLayoutEffect(() => {
    if (dockRef.current) setPad(dockRef.current.offsetHeight + 16);
  }, [i, checked]);
  useEffect(() => {
    if (checked) nextRef.current?.focus({ preventScroll: true });
  }, [checked]);

  function check() {
    if (checked || sel == null) return;
    const good = sel === q.a;
    const combo = good ? prog.combo + 1 : 0;
    const p = {
      score: prog.score + (good ? 1 : 0),
      combo,
      maxCombo: Math.max(prog.maxCombo, combo),
      xp: prog.xp + (good ? XP_PER : 0),
      answers: [...prog.answers, { q, ok: good }],
    };
    recordWeak(q.id, good);
    setProg(p);
    if (exam) return advance(p); // 模擬試験は解説を出さずに次へ
    setTitle(good ? (combo >= 3 ? MASCOT.combo(combo) : pickOne(MASCOT.praise)) : MASCOT.wrong);
    setChecked(true);
  }

  function advance(p = prog) {
    if (i < n - 1) {
      setI(i + 1);
      setSel(null);
      setChecked(false);
    } else {
      finish(p, false);
    }
  }

  // キーボード操作：1〜4で選択、Enterでチェック／つづける
  const keys = useRef();
  keys.current = { check, advance, setSel, checked, sel, count: q.order.length };
  useEffect(() => {
    const onKey = (e) => {
      const k = keys.current;
      if (!k.checked) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= k.count) k.setSel(qs[i]?.order[num - 1]);
        else if (e.key === "Enter" && k.sel != null) { e.preventDefault(); k.check(); }
      } else if (e.key === "Enter" && document.activeElement !== nextRef.current) {
        e.preventDefault();
        k.advance();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [i, qs]);

  const choiceClass = (ci) => {
    const c = ["choice"];
    if (!checked) {
      if (ci === sel) c.push("sel");
    } else if (ci === q.a) {
      c.push("correct");
      if (ok) c.push("bounce");
    } else if (ci === sel) {
      c.push("wrong", "shake");
    }
    return c.join(" ");
  };

  return (
    <>
      <div className="stack" style={{ paddingBottom: pad }}>
        <div className="qtop">
          <button className="x" onClick={onQuit} aria-label="やめてホームに戻る"><Close /></button>
          <div className="prog"><i style={{ width: `${((checked ? i + 1 : i) / n) * 100}%` }} /></div>
          {exam ? (
            <span className={`clock${left < 300 ? " warn" : ""}`} title="残り時間"><Clock /><span>{mmss(left)}</span></span>
          ) : (
            <span className={`combo${prog.combo < 2 ? " off" : ""}`} title="連続正解"><Flame />{prog.combo}</span>
          )}
        </div>

        <span className={`kind c-${col}`}>
          {exam ? `模擬試験 第${i + 1}問／${n}` : CATS[q.c].name}
          {q.tf ? "・○×" : ""}
        </span>
        <p className="q">{q.q}</p>

        <div className={`choices${q.tf ? " tf" : ""}`}>
          {q.order.map((ci, k) => (
            <button key={`${i}-${ci}`} className={choiceClass(ci)} disabled={checked} onClick={() => setSel(ci)}>
              {q.tf ? (
                <>
                  <span className="mk">{ci === 0 ? "○" : "×"}</span>
                  <span className="lb">{ci === 0 ? "正しい" : "誤り"}</span>
                </>
              ) : (
                <>
                  <span className="k">{k + 1}</span>
                  <span>{q.ch[ci]}</span>
                </>
              )}
            </button>
          ))}
        </div>
        <p className="hint">
          キーボード：<b>1</b>〜<b>{q.order.length}</b> で選択、<b>Enter</b> で{exam ? "回答" : "チェック／つづける"}
        </p>
      </div>

      <div ref={dockRef} className={`dock${checked ? (ok ? " ok" : " ng") : ""}`}>
        <div className="in">
          {!checked ? (
            <button className="btn mint" disabled={sel == null} onClick={check}>
              {exam ? (last ? "回答して採点する" : "回答して次へ") : "チェック"}
            </button>
          ) : (
            <>
              <div className="fb-head">
                <span className="fb-icon">{ok ? <Check /> : <Cross />}</span>
                <span className="fb-title">{title}</span>
                {ok && <span className="xp-pop">+{XP_PER} XP</span>}
              </div>
              {!ok && <div className="fb-ans">正解：{q.ch[q.a]}</div>}
              <span className="ref">{q.ref}</span>
              <p className="fb-exp">{q.e}</p>
              <button ref={nextRef} className={`btn ${ok ? "mint" : "coral"}`} onClick={() => advance()}>
                {last ? "結果を見る" : "つづける"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
