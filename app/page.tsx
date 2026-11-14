
const projects = [
  {
    number: "01",
    title: "Cinematic Films",
    description: "Stories told through movement, music and emotion.",
    category: "CINEMATIC • STORYTELLING",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200",
    link: "https://drive.google.com/drive/folders/1EN-s2ExMDvJGhSpSeTihODvm1PfLYq36",
  },
  {
    number: "02",
    title: "Advertisement Films",
    description: "Visual experiences made to make brands unforgettable.",
    category: "COMMERCIAL • BRAND FILMS",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
    link: "https://drive.google.com/drive/folders/11OrKTZh2aNyixkckf-dqxEsSkhbZslBx",
  },
];

export default function Home() {
  return (
    <main className="portfolio">
      <nav className="nav">
        <a href="#" className="brand">KA<span>.</span></a>
        <div className="nav-links">
          <a href="#work">WORK</a>
          <a href="#about">ABOUT</a>
          <a href="https://www.instagram.com/being.krisna/" target="_blank">INSTAGRAM ↗</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">INDEPENDENT VIDEO EDITOR · INDIA</p>
          <h1>Krishna<br /><span>Algure.</span></h1>
          <p className="tagline">Frames with feeling.</p>
          <p className="hero-description">
            I create cinematic visuals, meaningful stories and
            films that leave an impression.
          </p>
          <a className="outline-button" href="#work">EXPLORE MY WORK ↘</a>
        </div>
        <div className="hero-art">
          <div className="art-overlay">
            <span>VISUAL STORYTELLING</span>
            <span>01 — 26</span>
          </div>
          <div className="art-center">K<span>.</span></div>
          <p className="art-caption">EVERY FRAME HAS A FEELING.</p>
        </div>
        <div className="hero-bottom">
          <span>BASED IN INDIA</span>
          <span>CREATIVE DIRECTION · EDITING</span>
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK · 2026</p>
            <h2>My <span>Creations.</span></h2>
          </div>
          <p className="section-note">A collection of moments,<br />crafted into stories.</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              className="project-card"
              href={project.link}
              target="_blank"
              rel="noreferrer"
              key={project.number}
            >
              <div className="project-image" style={{
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.55), transparent 65%), url("${project.image}")`
              }}>
                <span className="project-number">{project.number}</span>
                <span className="project-arrow">↗</span>
              </div>
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <span className="view-link">VIEW COLLECTION ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <p className="eyebrow">BEHIND THE FRAMES</p>
        <h2>Not just videos.<br /><span>Experiences.</span></h2>
        <p>
          I'm Krishna, a creative video editor passionate about
          turning ordinary footage into extraordinary visual stories.
          From cinematic edits to brand advertisements, every frame
          deserves a purpose.
        </p>
        <a href="https://www.instagram.com/being.krisna/"
          target="_blank" rel="noreferrer" className="outline-button">
          LET'S CONNECT ↗
        </a>
      </section>

      <footer className="footer">
        <a href="#" className="brand">KA<span>.</span></a>
        <p>KRISHNA ALGURE — FRAMES WITH FEELING.</p>
        <a href="/studio">OPEN MY VIDEO STUDIO ↗</a>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
