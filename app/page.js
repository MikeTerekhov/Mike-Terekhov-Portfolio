import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaGithub, FaLinkedinIn, FaStrava } from "react-icons/fa";
import { FiArrowUpRight, FiCode, FiCpu, FiLayers } from "react-icons/fi";
import med from "@/public/images/med.jpg";
import brain from "@/public/images/brain_ai.png";
import db from "@/public/images/db.png";
import styles from "./home.module.css";

const featured = [
  {
    number: "01",
    category: "AGENTIC AI / HEALTHCARE",
    title: "AI Regimen",
    description: "A research-driven, multi-agent RAG system exploring how specialist perspectives and structured reasoning can support HIV treatment recommendations.",
    image: med,
    alt: "Medical research illustration",
    tags: ["RAG", "LLM agents", "Python"],
    href: "/projects",
  },
  {
    number: "02",
    category: "MACHINE LEARNING / BIOMECHANICS",
    title: "ACL Biomechanics",
    description: "Sequence-based machine learning on clinical sensor data to investigate movement patterns across injured, non-injured, and control groups.",
    image: brain,
    alt: "Illustration of an artificial intelligence brain",
    tags: ["PyTorch", "LSTM", "Clinical data"],
    href: "/projects",
  },
  {
    number: "03",
    category: "NLP / DATA SYSTEMS",
    title: "Text to SQL",
    description: "Fine-tuned DeepSeek-Coder with LoRA and retrieval augmentation, improving SQL validity by 22% and result accuracy by 23% over baseline.",
    image: db,
    alt: "Database illustration",
    tags: ["LoRA", "RAG", "DeepSeek"],
    href: "/projects",
  },
];

export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.statusDot} /> SOFTWARE ENGINEER · AI / ML</p>
            <h1 id="hero-title">Building at the intersection of <span>software</span> and intelligence.</h1>
            <p className={styles.lede}>I'm Mike Terekhov, a systems software engineer with a background in computer science, machine learning, and mechanical engineering. I build thoughtful software, from low-level systems to intelligent applications.</p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/projects">Explore my work <FaArrowRight aria-hidden="true" /></Link>
              <a className={styles.secondaryButton} href="https://drive.google.com/file/d/1PPI6Rgj5Xje7oTGvK7KsKx4EiGUkkxlI/view?usp=sharing" target="_blank" rel="noopener noreferrer">View résumé <FiArrowUpRight aria-hidden="true" /></a>
            </div>
            <div className={styles.socials} aria-label="Social profiles">
              <a href="https://github.com/MikeTerekhov" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/miketerekhov/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="https://www.strava.com/athletes/27456281" target="_blank" rel="noopener noreferrer" aria-label="Strava"><FaStrava /></a>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.orbitOne} />
            <div className={styles.orbitTwo} />
            <div className={styles.visualCore}><span>MT</span><small>ENGINEER / BUILDER</small></div>
            <div className={styles.floatTop}>SYSTEMS <span>↗</span></div>
            <div className={styles.floatBottom}>AI / ML <span>✳</span></div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="work-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>01 / SELECTED WORK</p><h2 id="work-title">Things I've been building<span className={styles.period}>.</span></h2></div>
            <Link className={styles.textLink} href="/projects">All projects <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.projectGrid}>
            {featured.map((project) => (
              <article className={styles.projectCard} key={project.number}>
                <div className={styles.projectImage}>
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" className={styles.image} />
                  <span className={styles.projectNumber}>{project.number}</span>
                </div>
                <div className={styles.projectBody}>
                  <p className={styles.projectCategory}>{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <div className={styles.tags}>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <Link href={project.href} className={styles.projectLink}>Explore projects <FiArrowUpRight aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.aboutSection} aria-labelledby="about-title">
          <div className={styles.aboutIntro}>
            <p className={styles.kicker}>02 / ABOUT ME</p>
            <h2 id="about-title">Curious by nature.<br /><span>Engineer by training.</span></h2>
            <p>I enjoy solving problems across disciplines, connecting rigorous engineering with practical, human-centered technology.</p>
            <Link href="/work" className={styles.textLink}>More about my experience <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}><span className={styles.timelineIcon}><FiCpu /></span><div><small>2025 — PRESENT</small><h3>Systems Software Engineer</h3><p>Raytheon · Systems, software, and hardware integration</p></div></div>
            <div className={styles.timelineItem}><span className={styles.timelineIcon}><FiLayers /></span><div><small>2023 — 2025</small><h3>M.S. Computer Science</h3><p>University of Southern California</p></div></div>
            <div className={styles.timelineItem}><span className={styles.timelineIcon}><FiCode /></span><div><small>2019 — 2023</small><h3>B.S. Mechanical Engineering</h3><p>Boston University · Machine Learning concentration</p></div></div>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="cta-title">
          <p className={styles.kicker}>03 / CONNECT</p>
          <h2 id="cta-title">Have something interesting in mind?</h2>
          <p>I'm always interested in thoughtful engineering problems, research, and new ideas.</p>
          <a href="https://www.linkedin.com/in/miketerekhov/" target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>Let's connect <FiArrowUpRight aria-hidden="true" /></a>
        </section>
        <footer className={styles.footer}><span>© {new Date().getFullYear()} Mike Terekhov</span><span>Built with Next.js · Driven by curiosity</span></footer>
      </div>
    </main>
  );
}
