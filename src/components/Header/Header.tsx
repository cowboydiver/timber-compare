import { dict } from '../../i18n/dictionary'

export function Header() {
  return (
    <header>
      <a href={dict.logoLink} target="_blank" rel="noreferrer">
        <img src="/logo.svg" alt="Global Timber" />
      </a>
    </header>
  )
}
