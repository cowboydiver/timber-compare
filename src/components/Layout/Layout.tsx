import { dict } from '../../i18n/dictionary'

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <>
      <div className="desktop-only">{children}</div>
      <div className="mobile-message">
        <div className="mobile-card">
          <img src="/logo.svg" alt="Global Timber" />
          <p>{dict.desktopOnly}</p>
          <p className="mobile-hint">{dict.desktopOnlyHint}</p>
        </div>
      </div>
    </>
  )
}
