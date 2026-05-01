import { dict } from '../../i18n/dictionary'

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <>
      <div className="desktop-only">{children}</div>
      <div className="mobile-message">
        <p>{dict.desktopOnly}</p>
      </div>
    </>
  )
}
