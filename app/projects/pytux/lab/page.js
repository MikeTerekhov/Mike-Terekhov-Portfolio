import Link from "next/link";
import KartLab from "@/components/KartLab";

export const metadata = {
  title: "Kart Q-learning lab",
  description: "A Double Q-learning kart agent training live in the browser, with its Q-table and controls for exploration, learning rate and discount.",
};

export default function KartLabPage() {
  return (
    <main className="site-shell editorial kart-lab-page">
      <Link href="/projects/pytux" className="back-link">← Self-driving kart</Link>
      <p className="eyebrow">Reinforcement learning · Interactive</p>
      <h1>Kart Q-learning lab</h1>
      <p className="intro">A browser port of my SuperTuxKart Double Q-learning controller, training live. It uses the same 18 aim-point states, the same 10 throttle and steering actions, and the same two-table update.</p>

      <KartLab />

      <section className="editorial-section">
        <div className="kl-notes">
          <div>
            <h3>Same agent, made learnable</h3>
            <p>States, actions, ε-greedy exploration and the two-table update mirror <code>controller_doubleQ_working.py</code>. The reward is metres of track progress, −0.6 per frame off the asphalt, −15 per rescue and +30 for finishing a lap.</p>
          </div>
          <div>
            <h3>The Double Q update</h3>
            <p>Each step one table is picked at random. It chooses the best next action, and the other table scores it: <code>Q_A(s,a) += α[r + γ·Q_B(s′, argmax Q_A(s′,·)) − Q_A(s,a)]</code>. Separating choice from evaluation removes Q-learning&apos;s overestimation bias.</p>
          </div>
          <div>
            <h3>Things to try</h3>
            <p>Reset the tables and watch Turbo learn from scratch. Set γ to 0 and it only looks one step ahead. Train on Oval, then switch to Hairpins: the table carries over, so you can see how well a policy transfers.</p>
          </div>
        </div>
        <p className="tagline" style={{ marginTop: 28 }}>
          Source: <a href="https://github.com/MikeTerekhov/reinforcement-learning" target="_blank" rel="noopener noreferrer">reinforcement-learning on GitHub</a>
        </p>
      </section>
    </main>
  );
}
