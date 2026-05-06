import { dict } from '../../i18n/dictionary'

export function Header() {
  return (
    <header className="wb-top">
      <a href={dict.logoLink} className="wb-top-mark" target="_blank" rel="noreferrer" aria-label="Global Timber">
        <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
          <path d="M16 3c4 0 6 3 7 6s3 4 4 7-1 6-4 8-3 5-7 5-5-2-7-5-5-3-5-7 2-5 3-8 5-6 9-6z" fill="none" stroke="#fefefe" strokeWidth="1.4" />
        </svg>
        <span>Global Timber</span>
        <span className="wb-top-tool">Sammenligning</span>
      </a>
      <nav className="wb-top-nav">
        <a className="is-on">Sammenlign</a>
        <a>Træsorter</a>
        <a>Datablade</a>
        <a>Hjælp</a>
      </nav>
      <div className="wb-top-right">
        <button className="wb-top-btn">Eksportér PDF</button>
        <button className="wb-top-btn wb-top-btn-icon">DA</button>
      </div>
    </header>
  )
}
