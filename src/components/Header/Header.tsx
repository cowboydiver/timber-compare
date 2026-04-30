import { useStore } from '../../store/useStore'
import { dict } from '../../i18n/dictionary'

export function Header() {
  const language = useStore((s) => s.language)
  const setLanguage = useStore((s) => s.setLanguage)
  const t = dict[language]

  return (
    <header>
      <a href={t.logoLink} target="_blank" rel="noreferrer">
        <img src="/logo.svg" alt="Global Timber" />
      </a>
      <nav>
        <button onClick={() => setLanguage('da')} aria-pressed={language === 'da'}>DA</button>
        <button onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>EN</button>
      </nav>
    </header>
  )
}
