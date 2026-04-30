import { useStore } from '../../store/useStore'
import { dict } from '../../i18n/dictionary'

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  const language = useStore((s) => s.language)
  const t = dict[language]

  return (
    <>
      <div className="desktop-only">{children}</div>
      <div className="mobile-message">
        <p>{t.desktopOnly}</p>
        <p>{t.desktopOnlyEn}</p>
      </div>
    </>
  )
}
