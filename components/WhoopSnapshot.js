import { getWhoopSnapshot } from "@/lib/whoop";

export default async function WhoopSnapshot() {
  const data = await getWhoopSnapshot();
  if (!data) return null;
  const metrics = [
    { label: "Recovery", value: data.recovery == null ? "—" : Math.round(data.recovery) + "%" },
    { label: "Sleep performance", value: data.sleep == null ? "—" : Math.round(data.sleep) + "%" },
    { label: "Daily strain", value: data.strain == null ? "—" : Number(data.strain).toFixed(1) },
  ];
  return <section className="editorial-section whoop-section" aria-label="WHOOP metrics">
    <div className="whoop-heading"><div><p className="eyebrow">Personal metrics / WHOOP</p><h2>Physiological snapshot</h2></div><span className="whoop-caption">Latest available</span></div>
    <div className="whoop-metrics">{metrics.map(metric => <div key={metric.label} className="whoop-metric">
      <span>{metric.label}</span><strong>{metric.value}</strong>
    </div>)}</div>
  </section>;
}
