export type Language = 'da' | 'en'

export const dict = {
  da: {
    searchPlaceholder: 'Søg træsort…',
    all: 'Alle',
    american: 'Amerikansk',
    european: 'Europæisk',
    tropical: 'Tropisk',
    radar: 'Radar',
    bar: 'Søjle',
    scatter: 'Punktdiagram',
    desktopOnly: 'Dette værktøj er bedst på en større skærm.',
    desktopOnlyEn: 'This tool is best viewed on a desktop.',
    chartPlaceholder: 'Vælg træsorter fra listen for at se diagrammer.',
    radarWarning: 'Radaret viser maks. 6 træsorter.',
    logoLink: 'https://www.globaltimber.dk',
  },
  en: {
    searchPlaceholder: 'Search wood species…',
    all: 'All',
    american: 'American',
    european: 'European',
    tropical: 'Tropical',
    radar: 'Radar',
    bar: 'Bar',
    scatter: 'Scatter',
    desktopOnly: 'This tool is best viewed on a desktop.',
    desktopOnlyEn: 'Dette værktøj er bedst på en større skærm.',
    chartPlaceholder: 'Select wood species from the list to see charts.',
    radarWarning: 'Radar chart shows max. 6 species.',
    logoLink: 'https://www.globaltimber.asia',
  },
} as const satisfies Record<Language, Record<string, string>>
