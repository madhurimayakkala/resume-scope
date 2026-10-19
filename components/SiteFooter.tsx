const GITHUB_URL = "https://github.com/madhurimayakkala";
const PORTFOLIO_URL = "https://madhurima-portfolio.vercel.app";

export default function SiteFooter() {
  return (
    <footer className="container-width mt-24 pb-10">
      <div className="border-t border-line-soft pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-ink-muted">
        <p>
          Built by <span className="text-ink-secondary">Madhurima Yakkala</span>
        </p>

        <nav aria-label="Author links" className="flex items-center gap-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            GitHub
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </footer>
  );
}
