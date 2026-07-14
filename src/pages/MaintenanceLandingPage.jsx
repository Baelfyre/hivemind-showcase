import HeroLogoOrbital from '../components/HeroLogoOrbital';
import '../styles/maintenance-landing.css';

const publicLinks = [
  {
    label: 'View Project Repository',
    href: 'https://github.com/Baelfyre/hivemind-showcase',
  },
  {
    label: 'Read Project Overview',
    href: 'https://github.com/Baelfyre/hivemind-showcase/blob/main/PROJECT_OVERVIEW.md',
  },
  {
    label: 'Review the Roadmap',
    href: 'https://github.com/Baelfyre/hivemind-showcase/blob/main/ROADMAP.md',
  },
];

export default function MaintenanceLandingPage() {
  return (
    <div className="maintenance-landing">
      <div className="maintenance-landing__glow" aria-hidden="true" />

      <main className="maintenance-landing__main">
        <section className="maintenance-landing__hero" aria-labelledby="showcase-heading">
          <p className="maintenance-landing__badge">Platform Development in Progress</p>

          <div className="maintenance-landing__visual">
            <HeroLogoOrbital />
          </div>

          <div className="maintenance-landing__copy">
            <h1 id="showcase-heading">
              <span>HiveMind</span> is Evolving
            </h1>
            <p className="maintenance-landing__lead">
              We are restructuring HiveMind to deliver a more accessible, reliable, and responsibly governed AI collaboration experience.
            </p>
            <p className="maintenance-landing__secondary">
              Development is focused on clearer collaborative workflows, stronger review controls, improved platform architecture, and future support for both hosted and locally integrated AI models.
            </p>
          </div>
        </section>

        <section className="maintenance-landing__context" aria-labelledby="project-context-heading">
          <h2 id="project-context-heading">About the project</h2>
          <p>
            HiveMind is a structured AI collaboration platform designed to coordinate specialized AI roles, validation steps, tools, and human review within one governed workflow.
          </p>
        </section>

        <nav className="maintenance-landing__links" aria-label="Public project links">
          {publicLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </main>

      <footer className="maintenance-landing__footer">
        Public project showcase and development status
      </footer>
    </div>
  );
}
