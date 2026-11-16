import { getWhoopSnapshot } from "@/lib/whoop";

const STRAIN_MAX = 21;

function MetricRing({ label, value, max, unit, tone }) {
  const available = typeof value === "number" && Number.isFinite(value);
  const progress = available ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const radius = 53;
  const circumference = 2 * Math.PI * radius;
  const formatted = available ? (unit === "%" ? String(Math.round(value)) : value.toFixed(1)) : "—";

  return (
    <div className={`whoop-ring-metric whoop-tone-${tone}`}>
      <div className="whoop-ring" role="img" aria-label={available ? `${label}: ${formatted}${unit} of ${max}${unit || " points"}` : `${label}: unavailable`}>
        <svg viewBox="0 0 128 128" aria-hidden="true" focusable="false">
          <circle className="whoop-ring-track" cx="64" cy="64" r={radius} />
          <circle className="whoop-ring-fill" cx="64" cy="64" r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            transform="rotate(-90 64 64)" />
        </svg>
        <div className="whoop-ring-center" aria-hidden="true">
          <span className="whoop-ring-value">{formatted}<small>{available ? unit : ""}</small></span>
        </div>
      </div>
      <span className="whoop-ring-label">{label}</span>
    </div>
  );
}

export default async function WhoopSnapshot() {
  const data = await getWhoopSnapshot();
  if (!data) return null;

  return (
    <section className="editorial-section whoop-section" aria-label="WHOOP metrics">
      <div className="whoop-heading">
        <div><p className="eyebrow">How I am feeling today according to WHOOP</p><h2>Physiological snapshot</h2></div>
        <span className="whoop-caption">Latest available</span>
      </div>
      <div className="whoop-rings">
        <MetricRing label="Recovery" value={data.recovery} max={100} unit="%" tone="recovery" />
        <MetricRing label="Sleep performance" value={data.sleep} max={100} unit="%" tone="sleep" />
        <MetricRing label="Daily strain" value={data.strain} max={STRAIN_MAX} unit="" tone="strain" />
      </div>
    </section>
  );
}
