# PRD: Global Timber Wood Comparison Tool

## Problem Statement

Buyers, architects, and procurement specialists working with Global Timber need to compare wood species across multiple physical and mechanical properties to make informed sourcing decisions. Currently, the Global Timber website presents each wood type as an isolated product page, forcing users to open many tabs and mentally juggle figures across species. There is no way to visually compare hardness, density, durability, or other properties across the full catalog in a single view.

## Solution

A standalone web application that scrapes Global Timber's full sawn-wood catalog (both the Danish site globaltimber.dk and the English site globaltimber.asia), merges the data into a static dataset, and presents an interactive comparison tool. Users can select any combination of wood species from a filterable sidebar and explore their properties through three complementary chart types: a radar chart for head-to-head multi-property comparison, a bar chart for ranking all selected woods on a single property, and a scatter plot for discovering relationships between two numeric properties with a nominal color dimension. The interface matches Global Timber's existing branding and supports both Danish and English.

## User Stories

1. As a timber buyer, I want to see all available wood species in a sidebar list, so that I have a complete overview of what Global Timber offers.
2. As a timber buyer, I want to filter the wood list by origin category (American, European, Tropical), so that I can quickly narrow down to relevant species.
3. As a timber buyer, I want to search for a wood by name, so that I can find a specific species without scrolling the full list.
4. As a timber buyer, I want to see a small thumbnail image next to each wood name in the sidebar, so that I can visually identify species by their grain and color.
5. As a timber buyer, I want to click a wood in the sidebar to add it to my comparison, so that I can build a custom selection for analysis.
6. As a timber buyer, I want to click a selected wood again to deselect it, so that I can refine my comparison without restarting.
7. As a timber buyer, I want to see which woods are currently selected highlighted in the sidebar, so that I always know my active comparison set.
8. As a timber buyer, I want to compare up to 6 wood species simultaneously on a radar chart, so that I can see how each species performs across all properties at a glance.
9. As a timber buyer, I want to be warned when I have already selected 6 woods for the radar chart, so that I understand why adding more has no effect on that view.
10. As a timber buyer, I want to switch between Radar, Bar, and Scatter chart tabs, so that I can explore the data from different analytical perspectives.
11. As a timber buyer, I want the bar chart to show all my selected woods ranked on a single property I choose, so that I can quickly identify which species excels in that dimension.
12. As a timber buyer, I want to choose which property drives the bar chart from a dropdown, so that I can switch the ranking dimension without losing my wood selection.
13. As a timber buyer, I want the scatter plot to let me choose any numeric property for the X axis, so that I can position woods along a dimension I care about.
14. As a timber buyer, I want the scatter plot to let me choose any numeric property for the Y axis independently of the X axis, so that I can discover correlations between two properties.
15. As a timber buyer, I want to choose a nominal property (such as origin or color family) to color the scatter plot points, so that I can visually cluster species by category.
16. As a timber buyer, I want to hover over a scatter plot point and see the wood's image in a tooltip, so that I can identify the species visually without memorizing its name.
17. As a timber buyer, I want the scatter plot tooltip to show the wood's name and the values for both axes, so that I get full context on hover.
18. As a timber buyer, I want woods with missing property data to still appear in all chart views, so that I am not misled into thinking a species is absent.
19. As a timber buyer, I want a "data unavailable" indicator on chart elements where a property value is missing, so that I know the gap is in the source data, not a bug.
20. As a Danish-speaking user, I want to use the app in Danish, so that all wood names and UI labels match the terminology I am familiar with.
21. As an English-speaking user, I want to use the app in English, so that all wood names and UI labels are understandable without knowing Danish.
22. As any user, I want to toggle between Danish and English in the header, so that I can switch languages at any time without losing my current selection or chart state.
23. As a user on a small screen, I want to see a clear message that the app is best used on a desktop, so that I understand why the layout is constrained.
24. As a repeat user, I want the app to reflect Global Timber's visual identity (colors, typography), so that it feels like a natural extension of their website.

## Implementation Decisions

### Modules

**Scraper** (`scraper/`)
- A Node.js script using Cheerio that crawls all wood sub-pages on both `globaltimber.dk` and `globaltimber.asia`
- Extracts: Danish name, English name, origin category, image URL, and all numeric and nominal properties found on each page
- Merges the two datasets by canonical wood identity (matching on English name)
- Outputs a single `src/data/woods.json` file
- Run manually with `node scraper/index.js` whenever the catalog needs refreshing
- Interface: `Wood { id, nameDa, nameEn, category: 'american' | 'european' | 'tropical', imageUrl, properties: Record<string, PropertyValue> }`
- `PropertyValue` is either `{ type: 'numeric', value: number, unit: string }` or `{ type: 'nominal', value: string }` or `{ type: 'unavailable' }`

**Data types & utils** (`src/data/`)
- `types.ts` — canonical TypeScript types shared across the app
- `utils.ts` — pure functions:
  - `getNumericProperties(woods)` — returns property keys that have numeric values for at least one wood
  - `getNominalProperties(woods)` — returns property keys that have nominal values
  - `filterWoods(woods, { search, category })` — returns filtered subset
  - `isUnavailable(value)` — type guard for missing data

**Selection & UI state** (`src/store/`)
- A single React context (or Zustand store) holding:
  - `selectedIds: string[]` — ordered list of selected wood IDs
  - `activeTab: 'radar' | 'bar' | 'scatter'`
  - `language: 'da' | 'en'`
  - `barProperty: string` — currently active property for bar chart
  - `scatterX: string`, `scatterY: string`, `scatterColor: string` — scatter axis config
- Radar cap: selecting a 7th wood when on the Radar tab shows a warning; selection still registers and affects Bar/Scatter

**Sidebar** (`src/components/Sidebar`)
- Search input (filters by wood name in active language)
- Category filter buttons (All / American / European / Tropical)
- Scrollable wood list: thumbnail, name, selected state
- Clicking toggles selection in the store

**Chart components** (`src/components/charts/`)
- `RadarChart` — Recharts `RadarChart` wrapping selected woods (up to 6 rendered); shows warning banner when selection exceeds 6
- `BarChart` — Recharts `BarChart`; property selector dropdown above chart; one bar group per selected wood; missing values shown as empty bar with tooltip
- `ScatterChart` — Recharts `ScatterChart`; X/Y/color dropdowns above chart; custom tooltip renders wood name, axis values, and `<img>` of the wood; missing axis values excluded from plot with indicator

**Header** (`src/components/Header`)
- Global Timber logo (linked to globaltimber.dk / globaltimber.asia depending on language)
- Language toggle button (DA / EN)

**ChartPanel** (`src/components/ChartPanel`)
- Tab bar (Radar / Bar / Scatter)
- Renders active chart component
- Passes current selection and axis config from store

### Architectural Decisions

- Static data: all wood data is baked into the built app via `woods.json`; no runtime API calls
- Desktop only: `min-width: 1024px` enforced via CSS; below this threshold a centered message is shown
- Branding: colors and typography extracted from `globaltimber.dk` at implementation time and applied via CSS custom properties
- Language: all UI strings defined in a `src/i18n/` dictionary keyed by `da` / `en`; wood names sourced from the merged dataset's `nameDa` / `nameEn` fields
- Deployment: Vercel, zero-config from the project root

## Testing Decisions

Good tests verify observable behavior through the module's public interface — they do not assert on internal implementation details, private functions, or component rendering internals.

### Modules to test

**`src/data/utils.ts`** — unit tests
- `filterWoods`: verify category filter, search filter, combined filter, case-insensitivity, empty results
- `getNumericProperties`: verify returns only keys with at least one numeric value; excludes fully-unavailable keys
- `getNominalProperties`: verify returns only nominal-typed keys
- `isUnavailable`: verify type guard against all three `PropertyValue` shapes

**`src/store/`** — integration tests against the store's public actions and derived state
- Selecting a wood adds it to `selectedIds`
- Deselecting removes it
- Selecting a 7th wood when `activeTab === 'radar'` sets a warning flag but still registers in `selectedIds`
- Switching language updates `language` without clearing selection
- Switching tabs clears the radar warning flag if selection is now ≤ 6
- `barProperty`, `scatterX`, `scatterY`, `scatterColor` update correctly when set

## Out of Scope

- Mobile or tablet layout
- User accounts or saved comparisons
- Real-time or scheduled data refresh from globaltimber.dk
- A detail page or drawer for individual wood species
- Price data or availability/stock information
- Export to PDF or CSV
- Accessibility (WCAG) compliance beyond default browser behaviour
- Any backend or server-side rendering

## Further Notes

- The scraper must handle the fact that the `.dk` and `.asia` catalogs differ slightly (different wood counts, some species present on one but not the other). Woods present on only one site will have `nameDa` or `nameEn` set to `null` respectively.
- Property names scraped from the Danish site should be translated to match the English property names from the Asia site so the merged dataset uses consistent keys.
- The scatter plot color dimension should gracefully handle the case where the selected nominal property has more unique values than the Recharts default color palette; extend the palette rather than cycling colors.
- Chart colors should be drawn from Global Timber's brand palette where possible, supplemented by accessible contrast-safe additions for larger palettes.
