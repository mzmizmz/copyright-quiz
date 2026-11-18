// オリジナルのマスコット（本の形のキャラクター）
// mood: "happy"（にっこり） / "wow"（びっくり） / "sad"（しょんぼり）
export default function Mascot({ mood = "happy" }) {
  return (
    <svg className="mascot" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="50" cy="94" rx="28" ry="4" fill="var(--line)" />
      <rect x="18" y="14" width="64" height="74" rx="14" fill="#1CA7EC" />
      <rect x="18" y="80" width="64" height="8" rx="4" fill="#0E86C2" />
      <rect x="26" y="14" width="6" height="74" fill="#0E86C2" opacity=".55" />
      <path d="M64 14h10v20l-5-4-5 4z" fill="#FFC23D" />
      <circle cx="41" cy="46" r="8" fill="#fff" />
      <circle cx="61" cy="46" r="8" fill="#fff" />
      <circle cx="42.5" cy="47" r="4.2" fill="#24313F" />
      <circle cx="62.5" cy="47" r="4.2" fill="#24313F" />
      <circle cx="44" cy="45.3" r="1.4" fill="#fff" />
      <circle cx="64" cy="45.3" r="1.4" fill="#fff" />
      <ellipse cx="33" cy="58" rx="4.5" ry="2.6" fill="#FF8FA0" opacity=".7" />
      <ellipse cx="69" cy="58" rx="4.5" ry="2.6" fill="#FF8FA0" opacity=".7" />
      {mood === "sad" && <path d="M41 66q9-6 18 0" stroke="#24313F" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      {mood === "wow" && (
        <>
          <ellipse cx="50" cy="66" rx="6" ry="7" fill="#24313F" />
          <ellipse cx="50" cy="69" rx="3.5" ry="3" fill="#FF5C64" />
        </>
      )}
      {mood === "happy" && (
        <>
          <path d="M39 61q11 12 22 0" fill="#24313F" />
          <path d="M44 66q6 4 12 0" fill="#FF5C64" />
        </>
      )}
    </svg>
  );
}
