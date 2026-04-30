import { create } from 'zustand'
import type { Language } from '../i18n/dictionary'

type Tab = 'radar' | 'bar' | 'scatter'

interface StoreState {
  selectedIds: string[]
  activeTab: Tab
  language: Language
  radarWarning: boolean
  barProperty: string
  scatterX: string
  scatterY: string
  scatterColor: string
  select: (id: string) => void
  deselect: (id: string) => void
  setLanguage: (lang: Language) => void
  setActiveTab: (tab: Tab) => void
  setBarProperty: (key: string) => void
  setScatterX: (key: string) => void
  setScatterY: (key: string) => void
  setScatterColor: (key: string) => void
}

export const useStore = create<StoreState>()((set) => ({
  selectedIds: [],
  activeTab: 'radar',
  language: 'en',
  radarWarning: false,
  barProperty: '',
  scatterX: '',
  scatterY: '',
  scatterColor: '',

  select: (id: string) => set((s) => {
    if (s.selectedIds.includes(id)) return {}
    const next = [...s.selectedIds, id]
    const radarWarning = s.activeTab === 'radar' && next.length > 6
    return { selectedIds: next, radarWarning }
  }),

  deselect: (id: string) => set((s) => ({ selectedIds: s.selectedIds.filter((x) => x !== id) })),

  setLanguage: (lang: Language) => set({ language: lang }),

  setActiveTab: (tab: Tab) => set((s) => ({
    activeTab: tab,
    radarWarning: tab !== 'radar' && s.selectedIds.length <= 6 ? false : s.radarWarning,
  })),

  setBarProperty: (key: string) => set({ barProperty: key }),
  setScatterX: (key: string) => set({ scatterX: key }),
  setScatterY: (key: string) => set({ scatterY: key }),
  setScatterColor: (key: string) => set({ scatterColor: key }),
}))
